from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Ad
from .serializers import AdSerializer, AdImageSerializer, AdFormSerializer, AdDeleteSerializer, AdReportSerializer
from users.models import CustomUser
from rest_framework.decorators import authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

class AdListView(ListAPIView):
    # API view for retrieving a list of ads based on filters.
    serializer_class = AdSerializer

    def get_queryset(self):
        # Get the queryset of ads based on the provided filters.
        queryset = Ad.objects.all()
        category = self.request.query_params.get('category')
        location = self.request.query_params.get('location')
        status = self.request.query_params.get('status')
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if category is not None:
            queryset = queryset.filter(category=category)

        if location is not None:
            queryset = queryset.filter(location=location)

        if status is not None:
            queryset = queryset.filter(status=status)

        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        # Exclude 'deleted' datasets in the final queryset
        return queryset.exclude(status='DE')

class AdDetailView(RetrieveAPIView):
    # API view for retrieving a single ad.
    queryset = Ad.objects.all()
    serializer_class = AdSerializer

class CreateAdView(APIView):
    # API view for creating a new ad.
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Create a new ad based on the provided form data.
        serializer = AdFormSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ad = serializer.save(owned_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditAdView(APIView):
    # API view for editing an existing ad.
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        # Update an existing ad based on the provided form data.
        ad = Ad.objects.get(pk=request.data["pk"])   
        adSerializer = AdFormSerializer(ad, data=request.data, context={'request': request})
        if adSerializer.is_valid():
            adSerializer.save()
            return Response(adSerializer.data, status=status.HTTP_201_CREATED)
        return Response(adSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAdView(APIView):
    # API view for deleting an ad.
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Delete an ad based on the provided ad ID.
        ad = Ad.objects.get(pk=request.data["pk"])   
        serializer = AdDeleteSerializer(ad, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateAdReportView(APIView):
    # API view for creating a report for an ad.
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        # Create a report for an ad based on the provided data.
        # Extract the ad ID from the URL parameters
        ad_id = kwargs.get('pk')

        # Retrieve the ad instance associated with the provided ID or return a 404 error if not found
        ad = get_object_or_404(Ad, pk=ad_id)

        # Update the request data with the ad instance
        request.data.update({'ad': ad.pk})

        # Initialize the serializer with the request data
        serializer = AdReportSerializer(data=request.data)

        if serializer.is_valid():
            # Save the report, associating it with the retrieved ad and the authenticated user (if any)
            if request.user.is_authenticated:
                serializer.save(reported_by=request.user, ad=ad)
            else:
                serializer.save(ad=ad)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)