from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from helper.fetch_google import GoogleLoginHelper
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth.hashers import make_password
from rest_framework.generics import ListAPIView

from .serializers import UserSerializer,ListUserSerializer
from .models import CustomUser
from helper.custom_pagination import CustomPageNumberPagination
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['email'] = user.email
        token['id'] = user.id

        return token

    def validate(self, attrs):
        if 'username' in attrs:
            del attrs['username']  # Remove 'username' to avoid validation

        data = super().validate(attrs)

        # Add extra response data
        data.update({
            'user': {
                'id': self.user.id,
                'email': self.user.email,
            }
        })

        return data
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class GoogleLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            access_token = request.data.get('access_token')
            if not access_token:
                raise ValidationError('Access token is required', code=status.HTTP_400_BAD_REQUEST)

            user_info=GoogleLoginHelper(access_token)
            # new_user=User.objects.create({'username':user_info.name,'email':user_info.email,'password':user_info.sub})
            print(user_info)
            '''
                Check the details of the user
            '''
            return Response({'message': 'success', 'profile': user_info})

        except ValidationError as ve:
            return Response({'message': str(ve)}, status=ve.status_code)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleRegister(APIView):
    def post(self, request, *args, **kwargs):
        try:
            access_token = request.data.get('access_token')
            if not access_token:
                raise ValidationError('Access token is required', code=status.HTTP_400_BAD_REQUEST)

            user_info=GoogleLoginHelper(access_token)
            # new_user=User.objects.create({'username':user_info.name,'email':user_info.email,'password':user_info.sub})
            print(user_info)
            '''
                Check the details of the user
            '''
            return Response({'message': 'success', 'profile': user_info})

        except ValidationError as ve:
            return Response({'message': str(ve)}, status=ve.status_code)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AddMember(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        role=request.data.get('role')
        managed_by=request.user
        if not email or not password or not role:
            return Response({'error': 'Email and password and role are required'}, status=status.HTTP_400_BAD_REQUEST)

        if role not in ["FarmWorker","FarmManager"]:
            return Response({'error':'role should be either FarmWorker or FarmManager'},status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.create(
                email=email,
                password=make_password(password),
                role=role,
                managed_by=managed_by
            )
            return Response({'message': 'Member created successfully'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ListMembers(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListUserSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return CustomUser.objects.filter(managed_by=self.request.user)