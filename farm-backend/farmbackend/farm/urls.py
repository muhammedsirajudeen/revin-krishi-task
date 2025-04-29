from django.urls import path
from .views import FarmCreateView,FarmListView,FarmRetrieveView
urlpatterns = [
    path('create-farm',FarmCreateView.as_view(),name='farm-view'),
    path('list',FarmListView.as_view(),name='farm-list'),
    path("list/<uuid:id>", FarmRetrieveView.as_view(), name="field-detail"),

]