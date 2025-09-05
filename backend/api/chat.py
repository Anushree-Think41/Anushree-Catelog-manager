from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.services import product_service
from catalog_agent.agent import root_agent
from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from google.adk.sessions.session import Session
from google.genai import types
import uuid
from google.adk.agents.run_config import RunConfig

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    original_product_id: int | None = None
    optimized_product_id: int | None = None

@router.post("/chat")
async def chat_with_ai(
    req: ChatRequest,
    db: Session = Depends(get_db)
):
    # Prepare initial context for the agent
    session_service = InMemorySessionService()
    session = Session(
        id=str(uuid.uuid4()),
        app_name="catalog_chat",
        user_id="chat_user",
    )

    # Construct user content with product context if available
    user_content_parts = []

    if req.original_product_id:
        original_product = product_service.get_product_by_id(db, req.original_product_id)
        if original_product:
            user_content_parts.append(
                f"Original Product Details: Title: {original_product.title}, Description: {original_product.description}, Price: {original_product.price}, SKU: {original_product.sku}, Tags: {original_product.tags}. "
            )

    if req.optimized_product_id:
        optimized_product = product_service.get_optimized_product_by_id(db, req.optimized_product_id)
        if optimized_product:
            user_content_parts.append(
                f"Optimized Product Details: Title: {optimized_product.title}, Description: {optimized_product.description}, Price: {optimized_product.price}, SKU: {optimized_product.sku}, Tags: {optimized_product.tags}. "
            )

    user_content_parts.append(req.message)
    user_content = types.Content(parts=[types.Part(text=" ".join(user_content_parts))])

    # Create a RunConfig instance
    run_config = RunConfig(response_modalities=["text"]) # Initialize with 'text' for response_modalities

    invocation_context = InvocationContext(
        invocation_id=new_invocation_context_id(),
        agent=root_agent,
        session_service=session_service,
        session=session,
        user_content=user_content,
        run_config=run_config # Pass the RunConfig instance
    )

    full_response = ""
    async for event in root_agent.run_async(invocation_context):
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    full_response += part.text

    return {"reply": full_response}
