from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Certificate(models.Model):
    def file_upload_to(instance, filename):
        return f"certificates/{instance.user.pk}/{filename}"

    file = models.FileField(upload_to=file_upload_to)
    expire_date = models.DateField(default=timezone.now() + timedelta(days=365))
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="certificate")