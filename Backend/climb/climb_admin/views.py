from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from climb_admin.serializers import AdminRegisterSerializer
from climb.utils import superuser_required


class AdminRegisterView(APIView):
    @superuser_required
    def post(self, request, *args,  **kwargs):
        '''
        Register a new User
        '''
        serializer = AdminRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = serializer.data
        return Response(user, status=status.HTTP_201_CREATED)