from rest_framework import serializers
from .models import Task
from farm.models import Farm
from field.models import Field
from django.contrib.auth import get_user_model
from farm.serializers import FarmSerializer
from field.serializers import FieldSerializer
from user.serializers import UserSerializer

User=get_user_model()
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'deadline',
            'priority',
            'farm',
            'field',
            'assigned_to',
            'created_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class CreateTaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    farm = serializers.PrimaryKeyRelatedField(queryset=Farm.objects.all())
    field = serializers.PrimaryKeyRelatedField(queryset=Field.objects.all())

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "deadline",
            "priority",
            "farm",
            "field",
            "assigned_to",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["created_by"] = request.user
        return super().create(validated_data)
    

class TaskListSerializer(serializers.ModelSerializer):
    farm = FarmSerializer(read_only=True)
    field = FieldSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'deadline',
            'priority',
            'farm',
            'field',
            'assigned_to',
            'created_by',
            'created_at',
            'updated_at',
            "status"
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']