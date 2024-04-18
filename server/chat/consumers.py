import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist

from .models import Message
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    # Track connected users and their channels
    connected_users = {}  # Maps user IDs to WebSocket channel names

    async def connect(self):
        token_key = self.scope['query_string'].decode().split('=')[1]
        self.user = await self.authenticate_user(token_key)
        if self.user is not None:
            await self.accept()
            # Store the channel name against the user
            self.connected_users[self.user.id] = self.channel_name
        else:
            await self.close()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json['message']
        receiver_id = text_data_json.get('receiver')
        
        if receiver_id:
            receiver_user = await self.get_user_by_id(receiver_id)
            if receiver_user:
                # Save the message
                message = await self.save_message(self.user, receiver_user, message_text)
                
                # Use the serializer to format the message
                message_data = await self.serialize_message(message)
                
                # Send message to the sender as a confirmation
                await self.send(text_data=json.dumps(message_data))

                # If the receiver is connected, send them the message
                receiver_channel_name = self.connected_users.get(receiver_user.id)
                if receiver_channel_name:
                    await self.channel_layer.send(receiver_channel_name, {
                        "type": "chat.message",
                        "text": json.dumps(message_data),
                    })
            else:
                print('Receiver not found.')
                await self.send(text_data=json.dumps({'error': 'Receiver not found.'}))
        else:
            await self.send(text_data=json.dumps({'message': message_text}))

    async def disconnect(self, close_code):
        # Remove user from connected users on disconnect
        if self.user and self.user.id in self.connected_users:
            del self.connected_users[self.user.id]
        await self.close()

    # Handler for sending message to the receiver's channel
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=event["text"])

    @database_sync_to_async
    def authenticate_user(self, token_key):
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except ObjectDoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, sender, receiver, text):
        message = Message(sender=sender, receiver=receiver, text=text)
        message.save()
        return message
    
    @database_sync_to_async
    def get_user_by_id(self, id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
    
    @database_sync_to_async
    def serialize_message(self, message):
        # Instantiate the serializer with the message instance
        serializer = MessageSerializer(message)
        # Return the serialized data
        return serializer.data
