from climb_api.models import Route
from django.db.models import Avg


def average_favorites_routes_difficulty(user):
    average_difficulty = Route.objects\
        .prefetch_related("favorites")\
        .filter(favorites__user=user.pk)\
        .aggregate(avg_difficulty=Avg('difficulty'))

    result = average_difficulty["avg_difficulty"]
    if result is None:
        return -1
    
    return result