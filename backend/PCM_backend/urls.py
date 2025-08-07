"""
URL configuration for PCM_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from user.views import *
from django.contrib import admin
from django.conf import settings
from opportunities.views import *
from django.urls import path,include
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'jobs', JobOpportunityViewSet, basename='job-opportunity')
router.register(r'courses', CourseOpportunityViewSet, basename='course-opportunity')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view()),
    path('register/', RegisterView.as_view()),
    path('set-password/', UpdatePasswordView.as_view()),
    path('api/user/resume/', ResumeView.as_view(), name='resume-upload-fetch'),
    path('api/user/image/', ImageView.as_view(), name='upload-image'),
    path('api/llm-genAi/', LlmGenAi.as_view(), name='lllgenai'),
    path('api/mark-attendance/', AttendanceView.as_view(), name='mark-attendance'),
    path('admin-aggregated/', AggregatedView.as_view(), name="admin_aggregated"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/opportunities/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
