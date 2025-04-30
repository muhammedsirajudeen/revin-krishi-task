from django.db import models
import uuid

class Farm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    owner = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    size_in_acres = models.FloatField(null=False, blank=False)
    description = models.TextField()
    image = models.FileField(upload_to='images/')  # Store in 'media/documents/'

    def __str__(self):
        return self.name


class Crop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=400)  # make sure MEDIA settings are configured

    def __str__(self):
        return self.crop_name
