from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .models import CustomUser
from .serializers import CustomUserSerializer, CustomProfileSerializer, CustomPasswordSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import CustomUser
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser

class CustomUserListView(ListAPIView): 
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
@api_view(['POST'])
def login(request): # Login view to authenticate users and return auth token
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        # User not found, but return a generic 401 status to avoid giving away information
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    # Check if the provided password is correct
    if not user.check_password(password):
        # Password is incorrect, return a generic 401 status
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Authentication is successful, create or get the token
    token, created = Token.objects.get_or_create(user=user)
    serializer = CustomUserSerializer(instance=user)
    
    # Return the token and user data
    return Response({"Authorization": "Token " + token.key, "user": serializer.data})

@api_view(['POST'])
def signup(request): # Signup view to create a new user and return auth token
    # Check for uniqueness first
    username = request.data.get('username')
    if CustomUser.objects.filter(username=username).exists():
        return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
    email = request.data.get('email')
    if CustomUser.objects.filter(email=email).exists():
        return Response({"detail": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Now attempt to create a new user
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()  # This will call create() on the serializer
        user.set_password(request.data['password'])
        user.save()

        # Create auth token
        token = Token.objects.create(user=user)
        return Response({
            "Authorization": "Token " + token.key,
            "user": serializer.data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def updateUser(request): # Update user profile view
    # Get the current user and update the fields with the provided data
    user = CustomUser.objects.get(id = request.data['id'])
    serializer = CustomProfileSerializer(user, request.data)
    print(user.password)
    if serializer.is_valid():
        # Save the updated user and return the updated user data
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def updatePassword(request): # Update user password view
    # Check that the old password is correct
    # Get the current user and update the fields with the provided data
    user = CustomUser.objects.get(username = request.data['username'])
    password = request.data['password']
    serializer = CustomPasswordSerializer(user, request.data)
    print(user.password)
    if serializer.is_valid():
        serializer.save()
        # Save the updated password to user object
        user.set_password(request.data['password'])
        user.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request): # Logout view to delete the user's auth token
    if request.method == "POST":
        #delete request user's auth token
        request.user.auth_token.delete()
        return Response({"Message": "Logged out"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request): # Authentication test case for checking if a valid token is present in header
    #authentication test case
    return Response("passed!")
