from django.urls import path
from .views import UserRegistrationView,CustomTokenObtainPairView,GoogleLogin,GoogleRegister
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView

)
urlpatterns = [
    path('register', UserRegistrationView.as_view(), name='user-register'),
    path('login', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('google/login',GoogleLogin.as_view(),name='google-login'),
    path('google/register',GoogleRegister.as_view(),name='google-register'),
    path('token/verify', TokenVerifyView.as_view(), name='token-verify'),    
    path('token/refresh', TokenRefreshView.as_view(), name='token-refresh'),

]