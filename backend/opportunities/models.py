from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class JobOpportunity(models.Model):
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    job_type = models.CharField(max_length=100, choices=[
        ("full-time", "Full-time"),
        ("part-time", "Part-time"),
        ("internship", "Internship"),
        ("contract", "Contract"),
        ("remote", "Remote"),
    ])
    salary = models.CharField(max_length=100, blank=True, null=True)
    required_skills = models.JSONField(default=list, help_text="List of required skills")
    job_description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    posted_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"

class CourseOpportunity(models.Model):
    course_title = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)  # e.g., "6 weeks", "10 hours"
    level = models.CharField(max_length=50, choices=[
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
        ("Expert", "Expert")
    ])
    category = models.CharField(max_length=100)
    skills_covered = models.JSONField(default=list, help_text="Skills taught in this course")
    course_description = models.TextField()
    prerequisites = models.TextField(blank=True, null=True)
    posted_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.course_title} by {self.instructor}"

class UserCourseProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(CourseOpportunity, on_delete=models.CASCADE, related_name='user_progress')
    is_completed = models.BooleanField(default=False)
    progress_percent = models.FloatField(default=0.0)  # Range: 0.0 to 100.0
    enrolled_on = models.DateTimeField(auto_now_add=True)
    completed_on = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'course')  # Prevent duplicate enrollments

    def __str__(self):
        return f"{self.user} - {self.course} - {self.progress_percent}%"
    
class UserJobMatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_matches')
    job = models.ForeignKey(JobOpportunity, on_delete=models.CASCADE, related_name='matched_users')
    match_score = models.FloatField(default=0.0)  # Optional: Based on skills or profile
    saved_on = models.DateTimeField(auto_now_add=True)
    applied = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'job')  # Prevent duplicate entries

    def __str__(self):
        return f"{self.user} - {self.job} - Score: {self.match_score}"