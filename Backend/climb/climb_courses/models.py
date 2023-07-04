from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db.models import CheckConstraint, Q

class Course(models.Model):
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 1500)
    date = models.DateTimeField(null=True)
    held_by = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.FloatField(models.FloatField(validators=[MinValueValidator(0.0)]))
    max_people = models.PositiveIntegerField()

    def __str__(self):
        return self.title
    
    class Meta:
        constraints = (
            CheckConstraint(
                check=Q(price__gte=0.0),
                name='price_range'
            ),
        )
    
class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="participants")