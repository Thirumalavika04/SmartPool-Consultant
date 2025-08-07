from rest_framework import serializers
from .models import JobOpportunity, CourseOpportunity
from user.models import *

class JobOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpportunity
        fields = '__all__'

class CourseOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOpportunity
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'department', 'skills', 'attendance']  # or use '__all__' if needed

class AggregatedSerializer(serializers.Serializer):
    total_courses = serializers.IntegerField()
    courses = CourseOpportunitySerializer(many=True)

    total_jobs = serializers.IntegerField()
    jobs = JobOpportunitySerializer(many=True)

    total_users = serializers.IntegerField()
    users = UserSerializer(many=True)
    
class PromptSerializer(serializers.Serializer):
    prompt = serializers.CharField()