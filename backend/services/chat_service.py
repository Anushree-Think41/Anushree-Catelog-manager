
from typing import List, Dict
from backend.services.groq_service import GroqService

class ChatService:
    def __init__(self):
        self.groq_service = GroqService()

    def get_chat_response(self, messages: List[Dict[str, str]]):
        return self.groq_service.stream_chat_response(messages)
