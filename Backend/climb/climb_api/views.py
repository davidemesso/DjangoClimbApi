from django.db.models import Count
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from climb_api.utils import average_favorites_routes_difficulty
from climb.utils import authentication_required
from climb.utils import staff_required
from .models import Favorite, News, Price, Route
from django.contrib.auth.models import User
from django.db.models import F, Func
from .serializers import FavoritesSerializer, GetNewsSerializer, GetPricesSerializer, GetRoutesSerializer, GetUsersSerializer, NewsSerializer, PricesSerializer, RoutesSerializer, UpdateNewsSerializer, UpdateRoutesSerializer, UserFavoritesSerializer

class RoutesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Route items
        '''
        routes = Route.objects\
            .all()\
            .prefetch_related("favorites")\
            .annotate(favorites_count=Count("favorites"))
            
        show_old = request.query_params.get('showOld')
        if not show_old or show_old == "false":
            routes = routes.filter(end_date__gte=timezone.now())
        
        difficulty = int(request.query_params.get('difficulty'))
        if difficulty is not None and difficulty > 0 and difficulty <= 5:
            routes = routes.filter(difficulty=difficulty)
        
        desc = request.query_params.get("desc") == "true"
        sorting = "-favorites_count" if desc else "favorites_count"
        routes = routes.order_by(sorting)
            
        serializer = GetRoutesSerializer(routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @staff_required
    def post(self, request, *args, **kwargs):
        '''
        Create the Route with given data
        '''
        serializer = RoutesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def delete(self, request, *args, **kwargs):
        '''
        Delete the Route
        '''
        try:
            obj = Route.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Route.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @staff_required
    def put(self, request, *args, **kwargs):
        '''
        Update the Route with given data
        '''
        obj = Route.objects.get(pk=request.data.get('id'))
        if(obj is None):
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'name': request.data.get('name'), 
            'description': request.data.get('description'),
            'id': request.data.get('id'),
            'difficulty': obj.difficulty,
            'end_date': obj.end_date,
            'image': obj.image,
        }
        serializer = UpdateRoutesSerializer(data=data)
        if serializer.is_valid():
            serializer.update(obj, serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
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
        
        existing = Favorite.objects.filter(user=user, route=id)
        if existing.exists():
            existing.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        serializer = FavoritesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsersView(APIView):
    @staff_required
    def get(self, request):
        '''
        Get the users list
        '''
        users = User.objects\
            .filter(is_staff=False)\
            .select_related("certificate")
            
        data = []
        
        for user in users:
            data.append({
                "id": user.pk,
                "username": user.username,
                "firstName": user.first_name,
                "lastName": user.last_name,
            })
        
        serializer = GetUsersSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class PricesView(APIView):
    def get(self, request, *args, **kwargs):
        '''
        List all the Prices
        '''
        news = Price.objects\
            .all()
            
        serializer = GetPricesSerializer(news, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @staff_required
    def post(self, request, *args, **kwargs):
        '''
        Create the Price with given data
        '''
        data = {
            'article': request.data.get('article'), 
            'price': request.data.get('price'),
        }
        
        serializer = PricesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staff_required
    def delete(self, request, *args, **kwargs):
        '''
        Delete the Price
        '''
        try:
            obj = Price.objects.get(pk=request.data.get('id'))
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Price.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        
class RecommendedRoutesView(APIView):
    @authentication_required
    def get(self, request):
        '''
        Gets the recommended routes based on user
        '''
        target_difficulty = average_favorites_routes_difficulty(request.user)
        
        routes = Route.objects\
            .all()\
            .filter(end_date__gte=timezone.now())\
            .annotate(favorites_count=Count("favorites"))
            
        if target_difficulty > 0:
            routes = routes\
                .annotate(abs_difficulty=Func(F('difficulty') - float(target_difficulty), function='ABS'))\
                .filter(abs_difficulty__lte=2)\
                .order_by('abs_difficulty', "-favorites_count")
        else:
            routes = routes.order_by("-favorites_count")
        
        serializer = GetRoutesSerializer(routes, many=True)
        return Response(serializer.data)


class AverageDifficultyView(APIView):
    @authentication_required
    def get(self, request):
        '''
        Gets current user average difficulty
        '''
        target_difficulty = average_favorites_routes_difficulty(request.user)
        
        if not target_difficulty or target_difficulty < 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        return Response(target_difficulty)