from fastapi import APIRouter, Depends
from typing import List, Dict
from backend.services.chat_service import ChatService

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(messages: List[Dict[str, str]], chat_service: ChatService = Depends()):
    response = await chat_service.get_chat_response(messages)
    return {"response": response}
