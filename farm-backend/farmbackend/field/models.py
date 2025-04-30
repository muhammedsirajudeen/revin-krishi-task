import uuid
from django.db import models
from django.conf import settings

class Field(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    farm = models.ForeignKey(
        'farm.Farm',  # Assuming you have a Farm model
        on_delete=models.CASCADE,
        related_name='fields'
    ) 
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_fields'
    )
    size_in_acres = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    description = models.TextField(blank=True)
    image = models.FileField(upload_to='images/')  # Store in 'media/documents/'
    crop=models.ForeignKey('farm.Crop',on_delete=models.CASCADE,related_name='crop',null=True,blank=True)
    def __str__(self):
        return self.name
