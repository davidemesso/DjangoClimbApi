from channels.generic.websocket import AsyncWebsocketConsumer

class WsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "completions_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_message(self, event):
        message = event['message']
        await self.send(message)
