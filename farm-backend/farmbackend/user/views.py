from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from helper.fetch_google import GoogleLoginHelper
from rest_framework.permissions import AllowAny

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