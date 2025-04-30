from rest_framework import serializers
from .models import Field
from django.contrib.auth import get_user_model
from farm.models import Crop
class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'farm', 'manager', 'size_in_acres', 'description', 'image','crop']

    '''
        TODO:
        add custom valdiation logics here instead of in models
    '''
    def validate_image(self, value):
        """
        Validate that the uploaded image is under 5MB.
        """
        max_size = 5 * 1024 * 1024  # 5MB
        if value.size > max_size:
            raise serializers.ValidationError("Image size exceeds the 5MB limit.")
        
        # You can also validate the file type (e.g., only allow images)
        if not value.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            raise serializers.ValidationError("Invalid image format. Allowed formats: PNG, JPG, JPEG, GIF.")
        
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()  # Use the custom user model
        fields = ['id', 'email']

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ['id', 'name','image']  # Adjust fields according to your model

class ListFieldSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True)  # Nested User Serializer
    crop = CropSerializer(read_only=True)  # Nested Crop Serializer

    class Meta:
        model = Field
        fields = ['id', 'name', 'farm', 'manager', 'size_in_acres', 'description', 'image', 'crop']