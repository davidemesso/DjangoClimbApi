from channels.generic.websocket import AsyncWebsocketConsumer

class WsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send("Connected")

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass

    async def send_message(self, event):
        pass