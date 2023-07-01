from rest_framework import  serializers
from django.contrib.auth.models import User
from climb_auth.models import Certificate

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'username')
        extra_kwargs = {
            'password':{'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            password = validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username')

class GetAccountCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["file", "expire_date", "id"]

class AccountCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["file", "user"]