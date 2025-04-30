from django.urls import path
from .views import FieldCreateView,ListFieldView,AddCropToField

urlpatterns = [
    path('create', FieldCreateView.as_view(), name='field-create'),
    path('farm/<str:farm_id>', ListFieldView.as_view(), name='list-fields-by-farm'),
    path('crop/<uuid:fieldid>',AddCropToField.as_view(),name='add-crop-to-field')
]
