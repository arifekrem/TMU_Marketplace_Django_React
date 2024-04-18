from django.db import models
from users.models import CustomUser

class Ad(models.Model):
    """
    Represents an advertisement.

    Attributes:
        title (str): The title of the advertisement.
        description (str): The description of the advertisement.
        type (str): The type of the advertisement. Choices are 'IW' (Items Wanted), 'IS' (Items for Sale), 'AS' (Academic Services).
        category (str): The category of the advertisement.
        location (str): The location of the advertisement.
        status (str): The status of the advertisement. Choices are 'SO' (Sold), 'NS' (Not Sold), 'DE' (Deleted).
        price (Decimal): The price of the advertisement.
        created_at (datetime): The date and time when the advertisement was created.
        owned_by (CustomUser): The user who owns the advertisement.
    """

    TYPE_CHOICES = [
        ('IW', 'Items Wanted'),
        ('IS', 'Items for Sale'),
        ('AS', 'Academic Services'),
    ]

    CATEGORY_CHOICES = [
        # Items
        ('EL', 'Electronics'),
        ('CL', 'Clothing'),
        ('SP', 'Sports & Outdoors'),
        ('GH', 'Games & Hobbies'),
        ('MU', 'Music & Instruments'),
        ('FA', 'Furniture & Appliances'),
        ('BE', 'Beauty & Personal Care'),
        ('GA', 'Garden'),
        ('TB', 'Textbooks'),
        ('LO', 'Lost & Found'),

        # Services
        ('SG', 'Study Groups'),
        ('TU', 'Tutoring'),
        ('RS', 'Research & Surveys'),

        # Other
        ('OT', 'Others'),
    ]

    LOCATION_CHOICES = [
        ('TE', 'Toronto & East York'),
        ('EB', 'Etobicoke'),
        ('NY', 'North York'),
        ('SC', 'Scarborough'),
        ('VA', 'Vaughan'),
        ('MK', 'Markham'),
        ('RH', 'Richmond Hill'),
        ('MV', 'Mississauga'),
        ('BR', 'Brampton'),
        ('AP', 'Ajax & Pickering'),
        ('OS', 'Whitby & Oshawa'),
        ('OK', 'Oakville & Milton'),
        ('OT', 'Other Locations'),
    ]

    STATUS_CHOICES = [
        ('SO', 'Sold'),
        ('NS', 'Not Sold'),
        ('DE', 'Deleted'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=2, choices=TYPE_CHOICES, default='IW')
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES, default='OT')
    location = models.CharField(max_length=2, choices=LOCATION_CHOICES, default='TE')
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owned_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ads')

    class Meta:
        ordering = ['-created_at']

    def __str__(self): # Returns a string representation of the advertisement.
        return self.title
    
class AdImage(models.Model):
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='ad_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"Ad Image for {self.ad.title} uploaded at {self.uploaded_at}"

class AdReport(models.Model):
    # Ad Details
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='reports')
    reported_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    REASONS = [
        ('SPAM', 'Spam'),
        ('INAPPROPRIATE_CONTENT', 'Inappropriate Content'),
        ('MISINFORMATION', 'Misinformation'),
        ('OTHER', 'Other'),
    ]
    report_reason = models.CharField(
        max_length=25,
        choices=REASONS,
        default='OTHER',
        help_text='The reason for the report'
    )
    
    other_details = models.TextField(blank=True, help_text='Additional details for the report if "Other" is selected')
    reported_at = models.DateTimeField(auto_now_add=True, help_text='The date and time the report was submitted')

    class Meta:
        verbose_name = 'Ad Report'
        verbose_name_plural = 'Ad Reports'

    def __str__(self):
        reported_by_str = self.reported_by.username if self.reported_by else 'Anonymous'
        return f"{self.get_report_reason_display()} - {reported_by_str} - {self.reported_at.strftime('%Y-%m-%d %H:%M:%S')}"