from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from climb_courses.serializers import GetCoursesSerializer, CourseSerializer, UpdateCourseSerializer
from climb.utils import staff_required
from .models import Course


class CoursesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Courses
        '''
        courses = Course.objects\
            .all()\
            .select_related('held_by')\
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
        Delete the courses
        '''
        try:
            obj = Course.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
