from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FarmSerializer
from rest_framework.permissions import IsAuthenticated
class FarmCreateView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['owner'] = request.user.id  # Safely inject the user ID

        serializer = FarmSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)