from rest_framework import serializers
from .models import Field

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'farm', 'manager', 'size_in_acres', 'description', 'image']

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
