from rest_framework import serializers
from rest_framework.fields import ListField
from .models import Ad, AdImage, AdReport


class AdImageSerializer(serializers.ModelSerializer): # Serializer for the AdImage model.
    image_url = serializers.ImageField(source='image', read_only=True)

    class Meta:
        model = AdImage
        fields = ['id', 'image_url', 'uploaded_at']


class AdSerializer(serializers.ModelSerializer): # Serializer for the Ad model.
    owned_by = serializers.SerializerMethodField()
    owned_by_id = serializers.SerializerMethodField()
    owned_by_profile_picture = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = ['id', 'title', 'description', 'category', 'type', 'location', 'price', 'created_at', 'owned_by', 'owned_by_id', 'owned_by_profile_picture', 'images', 'status']

    def get_owned_by(self, obj): # Get the username of the owner of the ad.

        return obj.owned_by.username
    
    def get_owned_by_id(self, obj): # Get the ID of the owner of the ad.
        return obj.owned_by.id
    
    def get_owned_by_profile_picture(self, obj): # Get the profile picture URL of the owner of the ad.
        try:
            return obj.owned_by.profile_picture.url
        except ValueError:
            return None
    
    def get_category(self, obj): # Get the display value of the category field.
        return dict(Ad.CATEGORY_CHOICES)[obj.category]
    
    def get_type(self, obj): # Get the display value of the type field.
        return dict(Ad.TYPE_CHOICES)[obj.type]
    
    def get_location(self, obj): # Get the display value of the location field.
        return dict(Ad.LOCATION_CHOICES)[obj.location]
    
    def get_status(self, obj): # Get the display value of the status field.
        return dict(Ad.STATUS_CHOICES)[obj.status]
    
    def get_images(self, obj): # Get the serialized data of the ad images.
        images = obj.images.all()
        return AdImageSerializer(images, many=True, context=self.context).data


class AdFormSerializer(serializers.ModelSerializer): # Serializer for the Ad model used in form submissions.
    images = ListField(
        child=serializers.FileField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Ad
        fields = ('title', 'description', 'price', 'type', 'category', 'location', 'images', 'status')
        extra_kwargs = {
            'images': {'required': False},
        }

    def create(self, validated_data): # Create a new ad instance with the provided validated data.
        images_data = validated_data.pop('images', [])
        ad = Ad.objects.create(**validated_data)

        for image_file in images_data:
            AdImage.objects.create(ad=ad, image=image_file)

        return ad
    
    def update(self, instance, validated_data): # Update an existing ad instance with the provided validated data.
        # Debug: Print validated data
        print("Validated data:", validated_data)

        # Debug: Print raw request data
        print("Raw request data:", self.context['request'].data)

        # Update basic ad fields
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.type = validated_data.get('type', instance.price)
        instance.category = validated_data.get('category', instance.price)
        instance.location = validated_data.get('location', instance.price)
        # etc. for other fields
        instance.save()

        # Image handling
        images_data = validated_data.pop('images', [])
        images_to_keep = self.context['request'].data.getlist('images_to_keep', [])
        
        # Delete images not in images_to_keep_ids
        instance.images.exclude(id__in=images_to_keep).delete()

        # Add new images
        for image_file in images_data:
            AdImage.objects.create(ad=instance, image=image_file)

        return instance


class AdDeleteSerializer(serializers.ModelSerializer): # Serializer for deleting an ad.
    class Meta:
        model = Ad
        fields = ['id', 'status']


class AdReportSerializer(serializers.ModelSerializer): # Serializer for the AdReport model.
    class Meta:
        model = AdReport
        fields = ['id', 'ad', 'reported_by', 'report_reason', 'other_details', 'reported_at']
        read_only_fields = ['reported_by', 'reported_at']

    def create(self, validated_data): # Create a new ad report instance with the provided validated data.
        if 'other_details' not in validated_data:
            validated_data['other_details'] = ''
        ad_report = AdReport.objects.create(**validated_data)
        return ad_report
