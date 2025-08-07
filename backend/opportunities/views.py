from rest_framework import viewsets
from .models import JobOpportunity, CourseOpportunity
from .serializers import *
from rest_framework import status, permissions
import requests
import json
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission, IsAuthenticatedOrReadOnly
from user.models import *
from rest_framework.response import Response
from rest_framework.views import APIView


class IsAdminOrAuthenticatedReadOnly(BasePermission):
    """
    - Authenticated users can view (GET).
    - Only admin users (is_staff=True) can create, update, or delete.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.is_staff

class JobOpportunityViewSet(viewsets.ModelViewSet):
    queryset = JobOpportunity.objects.all()
    serializer_class = JobOpportunitySerializer
    permission_classes = [IsAdminOrAuthenticatedReadOnly]

class CourseOpportunityViewSet(viewsets.ModelViewSet):
    queryset = CourseOpportunity.objects.all()
    serializer_class = CourseOpportunitySerializer
    permission_classes = [IsAdminOrAuthenticatedReadOnly]

class AggregatedView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        courses = CourseOpportunity.objects.all()
        jobs = JobOpportunity.objects.all()
        users = User.objects.all()

        data = {
            'total_courses': courses.count(),
            'courses': courses,
            'total_jobs': jobs.count(),
            'jobs': jobs,
            'total_users': users.count(),
            'users': users
        }
        print(data)
        serializer = AggregatedSerializer(data)
        return Response(serializer.data)
    
class LlmGenAi(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PromptSerializer(data=request.data)
        if serializer.is_valid():
            prompt = serializer.validated_data['prompt']
            headers = {
                "Authorization": "Bearer e0d6fba04fc94e7fba3ec3bdbc483473",  # Replace with actual key or fetch from env
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "meta-llama/Llama-Vision-Free",
                "messages": [
                    {
                    "role": "user",
                    "content": prompt
                    }
                ],
                "max_tokens": 512,
                "temperature": 1.0,
                "top_p": 1.0,
                "n": 1,
                "stream": False
                }

            try:
                response = requests.post(
                    "https://api.aimlapi.com/v1/chat/completions",
                    headers=headers,
                    data=json.dumps(payload)
                )
                response.raise_for_status()
                response_json = response.json()
                output = response_json['choices'][0]['message']['content'].strip()
            except requests.exceptions.HTTPError as http_err:
                print("HTTP error occurred:", http_err)
                print("Response content:", response.content.decode())
                output = {'error': str(http_err), 'details': response.content.decode()}
            except requests.exceptions.RequestException as e:
                print("Request error:", e)
                output = {'error': 'Request failed', 'details': str(e)}
            print(output)
            return Response({'output': output}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)