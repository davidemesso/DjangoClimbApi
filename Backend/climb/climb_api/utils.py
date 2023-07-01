from climb_api.models import Route
from django.db.models import Avg


def average_favorites_routes_difficulty(request):
    user = request.user
    average_difficulty = Route.objects\
        .prefetch_related("favorites")\
        .filter(favorites__user=user.pk)\
        .aggregate(avg_difficulty=Avg('difficulty'))

    return average_difficulty["avg_difficulty"]