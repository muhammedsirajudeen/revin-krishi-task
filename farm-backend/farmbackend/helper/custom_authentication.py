from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from user.models import CustomUser
class CustomAuthentication(BaseAuthentication):
    def authenticate(self, request):
        username = request.data.get('email')  # Assuming you want to use 'email' instead of 'username'
        password = request.data.get('password')

        if not username or not password:
            raise AuthenticationFailed('Email and password are required')

        try:
            user = CustomUser.objects.get(email=username)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('No such user')

        if not user.check_password(password):
            raise AuthenticationFailed('Invalid credentials')

        return (user, None)