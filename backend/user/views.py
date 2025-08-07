from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
from io import BytesIO
from pdfminer.high_level import extract_text
from pdfminer.pdfparser import PDFSyntaxError
from .serializers import *
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from datetime import date, time
from rest_framework_simplejwt.authentication import JWTAuthentication


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class RegisterView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'temp_password': user.temp_password}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            print("sended the rsponse")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'name': user.name,
                    'phone': user.phone,
                    'location': user.location,
                    'used_temp': user.check_password(user.temp_password),
                    'skills': user.skills,
                    'role': 'admin' if user.is_superuser else 'user'
                }
            })
        print(serializer.errors)
        return Response(serializer.errors, status=400)

class UpdatePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UpdatePasswordSerializer(data=request.data)
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password updated successfully'})
        return Response(serializer.errors, status=400)

class UploadUserFilesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Check for files
        image = request.FILES.get('image')
        resume = request.FILES.get('resume')

        if not image and not resume:
            return Response({"error": "No file provided. Please upload an image and/or a resume."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate & save
        if image:
            user.image = image
        if resume:
            user.resume = resume

        try:
            user.save()
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "File(s) uploaded successfully",
            "image_url": user.image.url if user.image else None,
            "resume_url": user.resume.url if user.resume else None
        }, status=status.HTTP_200_OK)

class AttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        attendance_records = Attendance.objects.filter(user=user).order_by('-date')

        if not attendance_records.exists():
            return Response({
                "message": "No attendance records found."
            }, status=status.HTTP_404_NOT_FOUND)

        # If you're not using a serializer:
        data = [
            {
                "date": str(record.date),
                "status": record.status,
                "check_in": str(record.check_in) if record.check_in else None,
            }
            for record in attendance_records
        ]

        return Response(data, status=status.HTTP_200_OK)
        
    def post(self, request):
        user = request.user
        today = date.today()
        status_input = request.data.get('status')
        allowed_statuses = ['Present', 'Absent']

        if status_input not in allowed_statuses:
            return Response({
                "error": f"Invalid status. Only allowed values: {allowed_statuses}"
            }, status=status.HTTP_400_BAD_REQUEST)

        existing_attendance = Attendance.objects.filter(user=user, date=today).first()
        if existing_attendance:
            return Response({
                "message": "Attendance already marked for today.",
                "status": existing_attendance.status
            }, status=status.HTTP_200_OK)
        check_in = timezone.now().time() 
        attendance = Attendance.objects.create(
            user=user,
            date=today,
            status=status_input,
            check_in=check_in
        )
        
        data = {
                "date": str(today),
                "status": status_input,
                "check_in": str(check_in if status_input == "Present" else "-"),
            }

        return Response(data, status=status.HTTP_201_CREATED)

class ResumeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user_id = request.query_params.get("user")
        
        if user_id:
            try:
                user = User.objects.get(user_id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ResumeFetchSerializer(user)
        print(serializer.data.get("resume"))
        return Response({"resume": serializer.data.get("resume")}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        resume_file = request.FILES.get("resume")

        serializer = ResumeUploadSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # resume_file = serializer.data.get("resume")
            
            SKILL_KEYWORDS = [
                "python", "django", "react", "sql", "javascript", "machine learning",
                "data analysis", "aws", "docker", "linux", "node.js", "pandas"
            ]
            print('resume_file')
            if resume_file:
                try:
                    resume_file.seek(0)  # important!
                    pdf_bytes = resume_file.read()
                    pdf_text = extract_text(BytesIO(pdf_bytes)).lower()
                except PDFSyntaxError:
                    return Response({"error": "Uploaded file is not a valid PDF."}, status=400)
                except Exception as e:
                    return Response({"error": f"Error processing PDF: {str(e)}"}, status=500)
                found_skills = [
                    skill for skill in SKILL_KEYWORDS if skill.lower() in pdf_text
                ]
                print(found_skills)
                if found_skills:
                    # Merge with existing skills if needed
                    existing_skills = user.skills if isinstance(user.skills, list) else user.skills.split(",") if user.skills else []
                    existing_skills_cleaned = set(skill.strip().lower() for skill in existing_skills)
                    found_skills_cleaned = set(skill.strip().lower() for skill in found_skills)
                    new_skills_set = existing_skills_cleaned.union(found_skills_cleaned)
                    all_skills_dict = {skill.strip().lower(): skill.strip() for skill in existing_skills + found_skills}
                    new_skills = [all_skills_dict[skill] for skill in sorted(new_skills_set)]
                    user.skills = new_skills
                    user.save()
                    
            return Response({"skills": user.skills}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = request.query_params.get("user")
        
        if user_id:
            try:
                user = User.objects.get(user_id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ImageFetchSerializer(user)
        print(serializer.data.get("image"))
        return Response({"image": serializer.data.get("image")}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        serializer = ImageUploadSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"image": serializer.data.get("image")}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)