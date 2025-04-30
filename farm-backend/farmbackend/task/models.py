from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Farm(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Field(models.Model):
    name = models.CharField(max_length=100)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="fields")

    def __str__(self):
        return self.name

class Task(models.Model):
    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    deadline = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="tasks")
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="tasks")
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_tasks")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_tasks")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
