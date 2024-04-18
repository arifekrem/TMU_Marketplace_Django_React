from django.contrib import admin
from django.urls import path, re_path
from .views import AdListView, AdDetailView, CreateAdView, EditAdView, DeleteAdView, CreateAdReportView

# Define the URL patterns for the ads app
urlpatterns = [
    path('', AdListView.as_view(), name='ad-list'),  # URL pattern for the ad list view
    path('<int:pk>/', AdDetailView.as_view(), name='ad-detail'),  # URL pattern for the ad detail view
    path('create/', CreateAdView.as_view(), name='create_ad'),  # URL pattern for creating a new ad
    path('edit/', EditAdView.as_view(), name='edit-ad'),  # URL pattern for editing an existing ad
    path('delete/', DeleteAdView.as_view(), name='delete-ad'),  # URL pattern for deleting an ad
    path('report/<int:pk>/', CreateAdReportView.as_view(), name='ad-report'),  # URL pattern for reporting an ad
    #re_path('create-ad', createAd),  # Example of using a regular expression in URL pattern
    #re_path('edit-ad', editAd),  # Example of using a regular expression in URL pattern
]