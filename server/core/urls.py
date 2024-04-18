from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [ # This is the root URL configuration for the Django project
    path('api/ads/', include('ads.urls')),
    path('api/messages/', include('chat.urls')),
    path('api/users/', include('users.urls')),
    path('api/admin/', admin.site.urls),
]

if settings.DEBUG: # If the project is in debug mode, serve media files using Whitenoise
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
