from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'location', 'department', 'position', 'skills']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        
        print(f"🔐 Received login: {email} / {password}")
        
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
            return user
        raise serializers.ValidationError("Both email and password are required.")

class UpdatePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=6)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        print(f"🔐 [TOKEN LOGIN] Email: {email}, Password: {password}")

        data = super().validate(attrs)

        # You can also add debug info here
        data['name'] = self.user.name
        data['email'] = self.user.email
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['email'] = user.email
        return token

class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['resume']

    def update(self, instance, validated_data):
        instance.resume = validated_data.get('resume', instance.resume)
        instance.save()
        return instance
    
class ResumeFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['resume']
        
            
class ImageFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['image']
    
class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['image']

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance