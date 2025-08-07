from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, name, phone, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not name or not phone:
            raise ValueError('Name and phone are required')

        email = self.normalize_email(email)
        temp_password = password or (name[:4] + phone[-4:]).lower()
        
        user = self.model(
            email=email,
            name=name,
            phone=phone,
            temp_password=temp_password,
            is_temp_password_used=False,
            **extra_fields
        )
        user.set_password(temp_password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, phone, password=password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    location = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=list, blank=True)
    temp_password = models.CharField(max_length=100)
    is_temp_password_used = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    image = models.ImageField(upload_to='user_images/', blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    attendance = models.IntegerField(blank=True,null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.email

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Leave', 'Leave')])
    check_in = models.TimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'date')  # Prevent duplicate attendance for same user-date
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.email} - {self.date} - {self.status}"