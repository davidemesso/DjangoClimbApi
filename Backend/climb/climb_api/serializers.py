from rest_framework import serializers
from .models import News, Route

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ["name", "difficulty", "description", "end_date"]

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ["title", "content", "insert_date", "posted_by"]

class GetNewsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='posted_by.username')
    
    class Meta:
        model = News
        fields = ["title", "content", "insert_date", "username"]