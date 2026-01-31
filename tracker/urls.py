from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create', views.create_workout, name='create'), # 'create/' değil 'create' (JS ile uyumlu olmalı)
    path('workout/<str:workout_type>/', views.workout_detail, name='workout_detail'),
    # urls.py
path('create/', views.create_workout, name='create'), # Sona slash (/) eklemek Django standartıdır
path('delete/<int:workout_id>/', views.delete_workout, name='delete_workout'),
]
