from rest_framework import serializers
from .models import Message
from users.models import CustomUser

class MessageSerializer(serializers.ModelSerializer): # Serializer for the Message model.
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    receiver_profile_picture = serializers.SerializerMethodField()
    sender_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_sender_name(self, obj): # Get the username of the sender of the message.
        return obj.sender.username

    def get_receiver_name(self, obj): # Get the username of the receiver of the message.
        return obj.receiver.username

    def get_receiver_profile_picture(self, obj): # Get the profile picture URL of the receiver of the message.
        if obj.receiver.profile_picture and hasattr(obj.receiver.profile_picture, 'url'):
            return obj.receiver.profile_picture.url
        return None
    
    def get_sender_profile_picture(self, obj): # Get the profile picture URL of the sender of the message.
        if obj.sender.profile_picture and hasattr(obj.sender.profile_picture, 'url'):
            return obj.sender.profile_picture.url
        return None