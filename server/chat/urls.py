from django.urls import path
from .views import MessageListView, SendMessageView

urlpatterns = [
    path('', MessageListView.as_view(), name='message-list'), # URL pattern for the message list view
    path('send/', SendMessageView.as_view(), name='message-list'), # URL pattern for sending a message
]