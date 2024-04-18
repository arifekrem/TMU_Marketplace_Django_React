from django.apps import AppConfig

class ChatConfig(AppConfig): # Define the configuration for the chat app
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'
