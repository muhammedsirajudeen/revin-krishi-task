from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import Task
from .serializers import TaskListSerializer,CreateTaskSerializer
from helper.custom_pagination import CustomPageNumberPagination
class CreateTask(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTask(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=TaskListSerializer
    pagination_class=CustomPageNumberPagination
    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user)