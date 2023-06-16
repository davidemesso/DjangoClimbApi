from rest_framework.views import APIView, status
from rest_framework.response import Response
from climb_auth.models import Certificate
from climb.utils import authentication_required
from .serializers import AccountCertificateSerializer, GetAccountCertificateSerializer, RegisterSerializer

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
        Get the current user certificate
        '''
        user = request.user.pk
        cert = Certificate.objects.filter(user=user).first()
        
        if cert is None:
            return Response(status=status.HTTP_200_OK)
        
        serializer = GetAccountCertificateSerializer(cert, many=False)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    @authentication_required
    def post(self, request):
        '''
        Insert a new certificate for the current user
        '''
        user = request.user.pk
        
        data = {
            "file": request.data.get("file"),
            "user": user
        }
        
        serializer = AccountCertificateSerializer(data=data)
        if serializer.is_valid():
            serializer.create(serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @authentication_required
    def delete(self, request):
        '''
        Delete the certificate for the current user
        '''
        try:
            obj = Certificate.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Certificate.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)