from django.urls import path
from .views import (
    AverageDifficultyView,
    FavoritesView,
    NewsView,
    RecommendedRoutesView,
    RoutesView,
    PricesView,
    UserFavoritesView,
    UsersView,
)

urlpatterns = [
    path('average/difficulty', AverageDifficultyView.as_view()),
    path('routes', RoutesView.as_view()),
    path('routes/recommended', RecommendedRoutesView.as_view()),
    path('news', NewsView.as_view()),
    path('prices', PricesView.as_view()),
    path('routes/<int:id>/favorites', FavoritesView.as_view()),
    path('user/favorites', UserFavoritesView.as_view()),
    path('users/', UsersView.as_view()),
    path('users/staff', UsersView.as_view()),
]