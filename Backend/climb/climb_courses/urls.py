from django.urls import path
from .views import (
    CourseParticipationView,
    CoursesView,
    UserParticipatingCoursesView,
)

urlpatterns = [
    path('', CoursesView.as_view()),
    path('<int:course_id>/participation', CourseParticipationView.as_view()),
    path('participations', UserParticipatingCoursesView.as_view()),
]