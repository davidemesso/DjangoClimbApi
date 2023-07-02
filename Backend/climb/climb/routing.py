from django.urls import path
from climb.consumers import WsConsumer

ws_urlpatterns = [
    path("ws", WsConsumer.as_asgi()),
]