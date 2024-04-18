from django.db import models
from django.conf import settings

class Message(models.Model): 
    sender = models.ForeignKey( # The user who sends the message
        settings.AUTH_USER_MODEL,
        related_name='sent_messages',
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey( # The user who receives the message
        settings.AUTH_USER_MODEL,
        related_name='received_messages',
        on_delete=models.CASCADE
    )
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True) # The date and time the message was sent

    def __str__(self): # Returns a string representation of the message object.
        return f"Message {self.text} to {self.receiver} from {self.sender}"

    class Meta: # Set the ordering of the messages in the admin panel
        ordering = ['-timestamp']