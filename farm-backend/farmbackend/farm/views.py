from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .serializers import FarmSerializer,FarmListSerializer
from .models import Farm
from helper.custom_pagination import CustomPageNumberPagination
class FarmCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['owner'] = request.user.id  # Safely inject the user ID
        try:
            data['size_in_acres'] = int(data.get('sizeInAcres'))
        except (ValueError, TypeError):
            return Response({'detail': 'Invalid value for sizeInAcres'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FarmSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FarmListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FarmListSerializer
    queryset = Farm.objects.all()
    pagination_class = CustomPageNumberPagination
