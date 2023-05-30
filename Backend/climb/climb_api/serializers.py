from rest_framework import serializers
from .models import Route
class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ["name", "difficulty", "description", "end_date"]