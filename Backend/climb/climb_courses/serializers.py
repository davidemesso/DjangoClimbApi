from rest_framework import  serializers
from climb_courses.models import Course, Participation

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["title", "description", "date", "held_by", "price", "max_people"]

class GetCoursesSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='held_by.username')
    date = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    participants_count = serializers.ReadOnlyField(source='participants.count')
    
    class Meta:
        model = Course
        fields = ["title", "description", "date", "price", "max_people", "username", "id", "participants_count"]

class UpdateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class GetCourseParticipantsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Participation
        fields = ['username']