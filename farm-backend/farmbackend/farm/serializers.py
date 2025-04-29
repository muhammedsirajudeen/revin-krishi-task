from rest_framework import serializers
from .models import Farm
from user.serializers import UserSerializer
class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ['id', 'name', 'location', 'owner', 'size_in_acres', 'description', 'image']
    
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


class FarmListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)  # Join the owner as nested object

    class Meta:
        model = Farm
        fields = ['id', 'name', 'location', 'size_in_acres', 'description', 'image', 'owner']
