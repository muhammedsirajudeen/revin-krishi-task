from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from .models import Field
from .serializers import FieldSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from helper.custom_pagination import CustomPageNumberPagination
class FieldCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        try:
            data['size_in_acres'] = int(data.get('sizeInAcres'))
        except (ValueError, TypeError):
            return Response({'detail': 'Invalid value for sizeInAcres'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data['manager'] = int(data.get('managerId'))
        except (ValueError, TypeError) as e:
            return Response({'detail': 'Invalid value for manager'}, status=status.HTTP_400_BAD_REQUEST)
           
        serializer = FieldSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListFieldView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FieldSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        farm_id = self.kwargs.get('farm_id')
        return Field.objects.filter(farm_id=farm_id)