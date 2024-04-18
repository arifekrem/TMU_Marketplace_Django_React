from django.contrib import admin
from .models import Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'text', 'timestamp')  # Customize the fields to display in the list view
    list_filter = ('sender', 'receiver', 'timestamp')  # Add filter options on the side
    search_fields = ('text',)  # Enable search functionality on the text field

    def get_ordering(self, request):
        """Custom ordering for the messages in the admin list view."""
        return ['-timestamp']  # Orders messages by timestamp in descending order

# Now register the model along with the customized admin options
admin.site.register(Message, MessageAdmin)
