from django.urls import path
from .views import (
    RoutesView,
)

urlpatterns = [
    path('routes', RoutesView.as_view()),
]