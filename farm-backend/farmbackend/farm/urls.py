from django.urls import path
from .views import FarmCreateView
urlpatterns = [
    path('create-farm',FarmCreateView.as_view(),name='farm-view')
]