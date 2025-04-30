from django.urls import path
from .views import CreateTask,ListTask
urlpatterns = [
    path('add',CreateTask.as_view(),name='create-task'),
    path('list',ListTask.as_view(),name='list-task')
]
