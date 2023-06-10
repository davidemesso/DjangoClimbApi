from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from climb.utils import authentication_required
from climb.utils import staff_required
from .models import Favorite, News, Route
from .serializers import FavoritesSerializer, GetNewsSerializer, GetRoutesSerializer, NewsSerializer, RoutesSerializer, UpdateNewsSerializer, UserFavoritesSerializer

class RoutesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Route items
        '''
        routes = Route.objects\
            .all()\
            .prefetch_related("favorites")
            
        serializer = GetRoutesSerializer(routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @staff_required
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
        serializer = RoutesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the News items
        '''
        news = News.objects\
            .all()\
            .select_related('posted_by')\
            .order_by("-insert_date")
        serializer = GetNewsSerializer(news, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @staff_required
    def post(self, request, *args, **kwargs):
        '''
        Create the News with given data
        '''
        data = {
            'title': request.data.get('title'), 
            'content': request.data.get('content'),
            'posted_by': request.data.get('posted_by')
        }
        serializer = NewsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def put(self, request, *args, **kwargs):
        '''
        Update the News with given data
        '''
        obj = News.objects.get(pk=request.data.get('id'))
        if(obj is None):
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'title': request.data.get('title'), 
            'content': request.data.get('content'),
            'id': request.data.get('id'),
            'posted_by': obj.posted_by.pk,
            'insert_date': obj.insert_date,
        }
        serializer = UpdateNewsSerializer(data=data)
        if serializer.is_valid():
            serializer.update(obj, serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def delete(self, request, *args, **kwargs):
        '''
        Delete the News
        '''
        try:
            obj = News.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except News.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class UserFavoritesView(APIView):
    @authentication_required
    def get(self, request):
        '''
        Get the favorite routes for user
        '''
        favorites = Favorite.objects.filter(user=request.user.pk)
        serializer = UserFavoritesSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FavoritesView(APIView):
    @authentication_required
    def post(self, request, id):
        '''
        Assing the route to the user favorites
        '''
        user = request.user.pk
        
        data = {
            'route': id, 
            'user': user,
        }
        
        existing = Favorite.objects.filter(user=user, route=id).exists()
        if existing:
            return Response(status=status.HTTP_409_CONFLICT)
        
        serializer = FavoritesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
