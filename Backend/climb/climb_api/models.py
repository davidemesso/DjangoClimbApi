from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Route(models.Model):
    name = models.CharField(max_length = 180)
    difficulty = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    description = models.CharField(max_length = 500)
    end_date = models.DateField(null=True)

    def __str__(self):
        return self.name