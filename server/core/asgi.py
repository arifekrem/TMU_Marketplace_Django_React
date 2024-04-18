import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') # Set the Django settings module
django.setup()

from django.urls import path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from chat.consumers import ChatConsumer

application = ProtocolTypeRouter({ # Define the ASGI application that will handle all incoming requests.
    "http": get_asgi_application(),
    "websocket": ChatConsumer.as_asgi(),
})
