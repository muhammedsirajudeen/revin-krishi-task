from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView,UpdateAPIView,DestroyAPIView
from .models import Task
from .serializers import TaskListSerializer,CreateTaskSerializer,TaskStatusUpdateSerializer
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


class TaskStatusUpdateView(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskStatusUpdateSerializer
    lookup_field = 'pk'  # or 'id' based on your URL

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
class TaskDeleteView(DestroyAPIView):
    queryset = Task.objects.all()
    lookup_field = 'pk'  # you can change to 'id' if needed

class TaskUpdateView(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = CreateTaskSerializer

    def update(self, request, *args, **kwargs):
        task = self.get_object()        
        if 'created_by' in request.data:
            return Response({"error": "You cannot modify 'created_by' field."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)