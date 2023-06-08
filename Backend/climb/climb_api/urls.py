from django.urls import path
from .views import (
    NewsView,
    RoutesView,
)

urlpatterns = [
    path('routes', RoutesView.as_view()),
    path('news', NewsView.as_view()),
]