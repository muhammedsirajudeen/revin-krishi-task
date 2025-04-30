from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .serializers import FarmSerializer,FarmListSerializer,CropSerializer
from .models import Farm,Crop
from helper.custom_pagination import CustomPageNumberPagination
from rest_framework.generics import RetrieveAPIView
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

class FarmListViewByOwner(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FarmListSerializer
    pagination_class = CustomPageNumberPagination
    def get_queryset(self):
        return Farm.objects.filter(owner=self.request.user)

class FarmRetrieveView(RetrieveAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    lookup_field = 'id'

class CropListView(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=CropSerializer
    pagination_class=CustomPageNumberPagination
    queryset=Crop.objects.all()

