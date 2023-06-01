from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Route
from .serializers import RouteSerializer

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