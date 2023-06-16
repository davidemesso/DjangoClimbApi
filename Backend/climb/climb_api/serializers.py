from rest_framework import serializers
from .models import Favorite, News, Route
from django.contrib.auth.models import User

class RoutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ["name", "difficulty", "description", "end_date",  "image"]

class GetRoutesSerializer(serializers.ModelSerializer):
    favorites_count = serializers.ReadOnlyField(source='favorites.count')
    
    class Meta:
        model = Route
        fields = ["id", "name", "difficulty", "description", "end_date", "favorites_count", "image"]
        
class UpdateRoutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = "__all__"

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ["title", "content", "posted_by"]

class GetNewsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='posted_by.username')
    insert_date = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = News
        fields = ["title", "content", "insert_date", "username", "id"]

class UpdateNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = "__all__"

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["user", "route"]

class UserFavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["route"]

class GetUsersSerializer(serializers.ModelSerializer):
    certificate_file = serializers.FileField(source='certificate.file')
    expire_date = serializers.ReadOnlyField(source='certificate.expire_date')
    
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "certificate_file", "expire_date"]