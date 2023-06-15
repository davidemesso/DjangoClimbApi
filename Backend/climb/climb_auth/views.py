from rest_framework.views import APIView, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from climb_auth.models import Certificate
from climb.utils import authentication_required
from .serializers import GetAccountCertificateSerializer, RegisterSerializer

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
                "email": request.user.email,
                "firstName": request.user.first_name,
                "lastName": request.user.last_name,
                "id": request.user.id,
            }, 
            status=status.HTTP_200_OK
        )

class AccountCertificateView(APIView):
    @authentication_required
    def get(self, request):
        '''
        Assing the route to the user favorites
        '''
        user = request.user.pk
        cert = Certificate.objects.filter(user=user)
        
        print(cert.count())
        
        if cert.count() == 0:
            return Response(data={"certificate": None}, status=status.HTTP_200_OK)
        
        serializer = GetAccountCertificateSerializer(cert)
        return Response(data=serializer.data, status=status.HTTP_200_OK)