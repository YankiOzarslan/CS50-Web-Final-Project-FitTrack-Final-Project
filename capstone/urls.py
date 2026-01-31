from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Buradaki 'urls' kelimesini kontrol et
    path('', include('tracker.urls')),
    
]
