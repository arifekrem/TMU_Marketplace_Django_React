from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer): # Serializer for user creation and update
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile_picture', 'is_active', 'is_staff']
        read_only_fields = ('id',)

class CustomProfileSerializer(serializers.ModelSerializer):
    #Serializer for profile updates (excluding password changes)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_picture', 'is_active', 'is_staff']
        read_only_fields = ('id',)
        
class CustomPasswordSerializer(serializers.ModelSerializer):
    #Serializer for password updates 
    class Meta:
        model = User
        fields = ['id', 'password']
        read_only_fields = ('id',)