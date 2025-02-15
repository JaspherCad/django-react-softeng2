# custom_app/urls.py

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#api/
urlpatterns = [
    path('about', views.about, name='about'),
    path('user/register', views.CreateUserView.as_view(), name='register'),
    path('user/login', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('protected', views.protected_view, name='test-protected-view'),
    path('doctor', views.doctorOnly, name='test-doctor-view'),




]   
