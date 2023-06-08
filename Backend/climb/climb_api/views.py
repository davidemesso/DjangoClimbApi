from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import News, Route
from .serializers import GetNewsSerializer, NewsSerializer, RouteSerializer

class RoutesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Route items
        '''
        routes = Route.objects.all()
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        '''
        Create the Route with given data
        '''
        data = {
            'name': request.data.get('name'), 
            'difficulty': request.data.get('difficulty'), 
            'description': request.data.get('description'),
            'end_date': request.data.get('end_date')
        }
        serializer = RouteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the News items
        '''
        news = News.objects.all().select_related('posted_by')
        serializer = GetNewsSerializer(news, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        '''
        Create the News with given data
        '''
        data = {
            'title': request.data.get('title'), 
            'content': request.data.get('content'), 
            'insert_date': request.data.get('insert_date'),
            'posted_by': request.data.get('posted_by')
        }
        serializer = NewsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)