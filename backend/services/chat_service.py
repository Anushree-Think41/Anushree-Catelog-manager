
from typing import List, Dict

class ChatService:
    def __init__(self):
        # Initialize your AI model client here (e.g., OpenAI, Groq)
        pass

    async def get_chat_response(self, messages: List[Dict[str, str]]) -> str:
        # This is a placeholder. Replace with actual AI model interaction.
        # Example using a dummy response:
        last_user_message = messages[-1]["content"] if messages else "Hello"
        return f"AI response to: {last_user_message}"
