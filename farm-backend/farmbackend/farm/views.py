from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .serializers import FarmSerializer,FarmListSerializer,CropSerializer
from task.serializers import TaskSerializer
from .models import Farm,Crop
from field.models import Field
from task.models import Task
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
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return Farm.objects.filter(owner=self.request.user)

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



class SummaryView(APIView):
    def get(self, request, *args, **kwargs):
        user=request.user
        farm_count=Farm.objects.filter(owner=user).count()
        farm_objects=Farm.objects.filter(owner=user)
        total_field_count = 0
        for farm in farm_objects:
            field_count = Field.objects.filter(farm=farm).count()
            print("Field count for farm", farm.id, "is", field_count)
            total_field_count += field_count
        crop_count = 0
        for farm in farm_objects:
            field_crop_count = Field.objects.filter(farm=farm, crop__isnull=False).count()
            print(f"Field count with crop for farm {farm.id} is {field_crop_count}")
            crop_count += field_crop_count
        total_task=Task.objects.filter(created_by=user).count()
        total_task_objects = Task.objects.filter(created_by=user).order_by('id')[:5]
        total_harvest_objects = Task.objects.filter(created_by=user,type="harvest").order_by('id')[:5]
        serialized_task=TaskSerializer(total_task_objects, many=True)
        serialized_harvest=TaskSerializer(total_harvest_objects, many=True)

        pending_task=Task.objects.filter(status="pending").count()
        progress_task=Task.objects.filter(status="in-progress").count()
        completed_task=Task.objects.filter(status="completed").count()
        summary_data = {
            "farm":farm_count,
            "field":total_field_count,
            "crop":crop_count,
            "task":total_task,
            "recent_task":serialized_task.data,
            "recent_harvest":serialized_harvest.data,
            "pending":pending_task,
            "progress":progress_task,
            "completed":completed_task
        }

        return Response(summary_data, status=status.HTTP_200_OK)    