from django.urls import path
from .views import CreateTask,ListTask,TaskStatusUpdateView,TaskDeleteView,TaskUpdateView
urlpatterns = [
    path('add',CreateTask.as_view(),name='create-task'),
    path('list',ListTask.as_view(),name='list-task'),
    path('status/<int:pk>', TaskStatusUpdateView.as_view(), name='task-status-update'),
    path('delete/<int:pk>',TaskDeleteView.as_view(),name='task-delete'),
    path('update/<int:pk>', TaskUpdateView.as_view(), name='task_update'),

]
