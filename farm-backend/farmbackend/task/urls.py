from django.urls import path
from .views import CreateTask
urlpatterns = [
    path('add',CreateTask.as_view(),name='create-task')
]
