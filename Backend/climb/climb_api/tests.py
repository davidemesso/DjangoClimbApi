from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from climb_api.utils import average_favorites_routes_difficulty
from climb_api.views import RoutesView
from climb_api.models import Favorite, Route

class TestRoutesViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')
        self.route1 = Route.objects.create(name='Route 1', difficulty=4, end_date=timezone.now())
        self.route2 = Route.objects.create(name='Route 2', difficulty=3, end_date=timezone.now())
        self.route3 = Route.objects.create(name='Route 3', difficulty=5, end_date=timezone.now() - timedelta(days=2))
        self.favorite1 = Favorite.objects.create(user=self.user1, route=self.route1)
        self.favorite1 = Favorite.objects.create(user=self.user1, route=self.route2)
        self.favorite1 = Favorite.objects.create(user=self.user2, route=self.route2)

    # Gets only present routes ordered by likes ascending
    def test_get_routes_without_query_params(self):
        request = self.factory.get('/api/routes/', {'difficulty': 0})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Route 1')
        self.assertEqual(response.data[1]['name'], 'Route 2')
    
    # Result with 0 routes
    def test_get_routes_without_results(self):
        request = self.factory.get('/api/routes/', {'difficulty': 1})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
    
    # Difficulty out of range is considered as all
    def test_get_routes_with_wrong_params(self):
        request = self.factory.get('/api/routes/', {'difficulty': 6})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    # Gets all routes ordered by likes ascending
    def test_get_routes_with_show_old_query_param(self):
        request = self.factory.get('/api/routes/', {'showOld': 'true', 'difficulty': 0})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    # Gets only difficulty 4 present routes ordered by likes ascending
    def test_get_routes_with_difficulty_query_param(self):
        request = self.factory.get('/api/routes/', {'difficulty': 4})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Route 1')

    # Gets all present routes ordered by likes descending
    def test_get_routes_with_desc_query_param(self):
        request = self.factory.get('/api/routes/', {'desc': 'true', 'difficulty': 0})
        view = RoutesView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Route 2')
        self.assertEqual(response.data[1]['name'], 'Route 1')


class TestAverageFavoritesRoutesDifficultyTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.user_without_favorites = User.objects.create_user(username='testuser2', password='testpass')
        self.route1 = Route.objects.create(name='Route 1', difficulty=4)
        self.route2 = Route.objects.create(name='Route 2', difficulty=3)
        self.route3 = Route.objects.create(name='Route 3', difficulty=5)
        self.favorite1 = Favorite.objects.create(user=self.user, route=self.route1)
        self.favorite2 = Favorite.objects.create(user=self.user, route=self.route2)

    # Gets the average of a user having a 3 and a 4 routes favorites
    def test_average_favorites_routes_difficulty_with_favorites(self):
        average_difficulty = average_favorites_routes_difficulty(self.user)
        self.assertEqual(average_difficulty, 3.5)

    # Gets the average of a user not having favorite routes (hard set to -1)
    def test_average_favorites_routes_difficulty_without_favorites(self):
        average_difficulty = average_favorites_routes_difficulty(self.user_without_favorites)
        self.assertEqual(average_difficulty, -1)
    
    def test_average_favorites_routes_difficulty_without_user(self):
        user = User()
        average_difficulty = average_favorites_routes_difficulty(user)
        self.assertEqual(average_difficulty, -1)
