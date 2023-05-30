from django.urls import path
from .views import (
    RouteListApiView,
)

urlpatterns = [
    path('routes', RouteListApiView.as_view()),
]