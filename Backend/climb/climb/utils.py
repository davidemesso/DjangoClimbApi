from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def staff_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(args)
        request = args[1]
        print(request.user)
        if not request.user.is_staff:
            return Response(
                {"error": "You do not have staff permission."},
                status=status.HTTP_403_FORBIDDEN
            )
        return func(*args, **kwargs)
    return wrapper

def authentication_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        request = args[1]
        if not (request.user and request.user.is_authenticated):
            return Response(
                {"error": "You are not authenticated."},
                status=status.HTTP_403_FORBIDDEN
            )
        return func(*args, **kwargs)
    return wrapper

def superuser_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        request = args[1]
        if not (request.user and request.user.is_superuser):
            return Response(
                {"error": "You do not have superuser permission."},
                status=status.HTTP_403_FORBIDDEN
            )
        return func(*args, **kwargs)
    return wrapper