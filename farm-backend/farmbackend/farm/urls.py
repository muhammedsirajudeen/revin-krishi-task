from django.urls import path
from .views import FarmCreateView,FarmListView,FarmRetrieveView,CropListView
urlpatterns = [
    path('create-farm',FarmCreateView.as_view(),name='farm-view'),
    path('list',FarmListView.as_view(),name='farm-list'),
    path("list/<uuid:id>", FarmRetrieveView.as_view(), name="field-detail"),
    path('crops',CropListView.as_view(),name='list-crops')
]