from django.contrib import admin
from .models import Ad, AdImage, AdReport
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.safestring import mark_safe
from django.db import models

class AdminImageWidget(AdminFileWidget): # Custom widget for rendering image fields in the admin panel.
    def render(self, name, value, attrs=None, renderer=None):
        output = []

        if value and getattr(value, "url", None):
            image_url = value.url
            file_name = str(value)

            output.append(
                f' <a href="{image_url}" target="_blank">'
                f'  <img src="{image_url}" alt="{file_name}" width="150" height="150" '
                f'style="object-fit: cover;"/> </a>')

        output.append(super(AdminFileWidget, self).render(name, value, attrs, renderer))
        return mark_safe(u''.join(output))
    
class AdImageInline(admin.TabularInline): # Inline admin class for managing AdImage objects in the Ad admin panel.
    model = AdImage
    extra = 1 
    fields = ['image', 'uploaded_at']
    readonly_fields = ['uploaded_at']
    formfield_overrides = {
        models.ImageField: {'widget': AdminImageWidget}
    }
    
class AdReportInline(admin.TabularInline): # Inline admin class for managing AdReport objects in the Ad admin panel.
    model = AdReport
    extra = 0  # No empty forms
    readonly_fields = ['reported_by', 'report_reason', 'other_details', 'reported_at']
    fields = ['reported_by', 'report_reason', 'other_details', 'reported_at']

class AdAdmin(admin.ModelAdmin): # Admin class for managing Ad objects in the admin panel.
    list_display = ('title', 'status', 'type', 'category', 'price', 'created_at', 'owned_by', 'report_count')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    inlines = [AdImageInline, AdReportInline]
    
    def get_queryset(self, request): # Annotates the queryset with the report count of the Ad object
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(report_count=models.Count('reports'))
        return queryset
    
    def report_count(self, obj): # Returns the report count of the Ad object.
        return obj.report_count
    
    report_count.admin_order_field = 'report_count'  # Allows column to be sorted
    report_count.short_description = 'Report Count'

class AdReportAdmin(admin.ModelAdmin): # Admin class for managing AdReport objects in the admin panel.
    list_display = ['ad', 'report_reason', 'reported_by', 'reported_at']
    list_filter = ['report_reason', 'reported_at']
    search_fields = ['ad__title', 'reported_by__username', 'other_details']
    readonly_fields = ['ad', 'reported_by', 'report_reason', 'other_details', 'reported_at']

# Register the admin classes
admin.site.register(AdReport, AdReportAdmin)
admin.site.register(Ad, AdAdmin)
admin.site.register(AdImage)
