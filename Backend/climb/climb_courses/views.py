from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from climb_courses.serializers import GetCoursesSerializer, CourseSerializer, UpdateCourseSerializer, GetCourseParticipantsSerializer
from climb.utils import staff_required, authentication_required
from .models import Course, Participation
from django.utils import timezone


class CoursesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Courses
        '''
        courses = Course.objects\
            .all()\
            .select_related('held_by')\
            .filter(date__gte=timezone.now())\
            .order_by("-date")
        serializer = GetCoursesSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @staff_required
    def post(self, request, *args, **kwargs):
        '''
        Create the course with given data
        '''
        data = {
            'title': request.data.get('title'), 
            'description': request.data.get('description'),
            'held_by': request.data.get('held_by'),
            'date': request.data.get('date'),
            'price': request.data.get('price'),
            'max_people': request.data.get('max_people'),
        }
        serializer = CourseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def put(self, request, *args, **kwargs):
        '''
        Update the course with given data
        '''
        obj = Course.objects.get(pk=request.data.get('id'))
        if(obj is None):
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'title': request.data.get('title'), 
            'description': request.data.get('description'),
            'id': request.data.get('id'),
            'held_by': obj.held_by.pk,
            'date': obj.date,
            'price': request.data.get('price'),
            'max_people': request.data.get('max_people'),
        }
        serializer = UpdateCourseSerializer(data=data)
        if serializer.is_valid():
            serializer.update(obj, serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def delete(self, request, *args, **kwargs):
        '''
        Delete the course
        '''
        try:
            obj = Course.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    

class CourseParticipationView(APIView):
    @staff_required
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        participants = Participation.objects.filter(course=course)
        serializer = GetCourseParticipantsSerializer(participants, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @authentication_required
    def post(self, request, course_id):
        user = request.user

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        participation = Participation.objects\
            .filter(user=user, course=course)\
            .first()
            
        if participation:
            participation.delete()
            return Response(status=status.HTTP_200_OK)

        if course.participants.count() >= course.max_people:
            return Response(status=status.HTTP_403_FORBIDDEN)

        participation = Participation(user=user, course=course)
        participation.save()

        return Response(status=status.HTTP_200_OK)
    
    
class UserParticipatingCoursesView(APIView):
    @authentication_required
    def get(self, request):
        user = request.user

        course_ids = Participation.objects\
            .filter(user=user)\
            .values_list('course__id', flat=True)

        return Response(course_ids, status=status.HTTP_200_OK)