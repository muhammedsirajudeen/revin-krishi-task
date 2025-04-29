from django.urls import path
from .views import FieldCreateView,ListFieldView

urlpatterns = [
    path('create', FieldCreateView.as_view(), name='field-create'),
    path('farm/<str:farm_id>', ListFieldView.as_view(), name='list-fields-by-farm'),

]
