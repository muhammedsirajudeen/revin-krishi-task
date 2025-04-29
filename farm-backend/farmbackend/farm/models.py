from django.db import models
import uuid

class Farm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    owner = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    size_in_acres = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField()

    def __str__(self):
        return self.name
