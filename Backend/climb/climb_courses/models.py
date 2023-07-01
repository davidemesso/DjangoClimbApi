from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 1500)
    date = models.DateTimeField(null=True)
    held_by = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.PositiveIntegerField()
    max_people = models.PositiveIntegerField()

    def __str__(self):
        return self.title
    
class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="participants")