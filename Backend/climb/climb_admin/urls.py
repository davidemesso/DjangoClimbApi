from django.urls import path
from climb_admin.views import AdminRegisterView

urlpatterns = [
    path('register/', AdminRegisterView.as_view(), name='register'),
]