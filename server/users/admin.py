from django.contrib import admin
from .models import CustomUser

admin.site.register(CustomUser) # Register the CustomUser model with Django's built-in UserAdmin
