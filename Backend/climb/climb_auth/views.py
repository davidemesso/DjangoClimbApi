from rest_framework.views import APIView, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(APIView):
    def post(self, request, *args,  **kwargs):
        '''
        Register a new User
        '''
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = serializer.data
        return Response(user, status=status.HTTP_201_CREATED)

class AccountView(APIView):
    def get(self, request, *args,  **kwargs):
        '''
        Get a User infos
        '''
        if request.user.is_anonymous:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                "username": request.user.username,
                "isStaff": request.user.is_staff,
                "id": request.user.id
            }, 
            status=status.HTTP_200_OK
        )