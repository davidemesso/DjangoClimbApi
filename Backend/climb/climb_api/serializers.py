from datetime import timezone
from rest_framework import serializers
from .models import News, Route

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ["name", "difficulty", "description", "end_date"]

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