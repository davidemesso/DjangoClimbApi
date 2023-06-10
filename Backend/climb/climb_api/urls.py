from django.urls import path
from .views import (
    FavoritesView,
    NewsView,
    RoutesView,
)

urlpatterns = [
    path('routes', RoutesView.as_view()),
    path('news', NewsView.as_view()),
    path('routes/<int:id>/favorites', FavoritesView.as_view()),
]