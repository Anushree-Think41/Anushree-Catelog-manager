from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
import json
import uuid
import asyncio
import traceback
import os # Import os

from catalog_agent.agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types


class AgentQuery(BaseModel):
    query: str


router = APIRouter()

# Initialize SessionService and Runner once (ideally at app startup for performance)
# Create a single instance of InMemorySessionService
session_service = InMemorySessionService()

# Create a single instance of the Runner for the root_agent
root_agent_runner = Runner(
    agent=root_agent,
    app_name="catalog_manager_app",
    session_service=session_service,
)


@router.post("/agent-playground")
async def run_agent_query(agent_query_data: AgentQuery):
    """
    Receives a query from the frontend and runs it through the root agent.
    """
    print(f"Received agent playground query: {agent_query_data.query}")
    print("--- Starting agent playground execution ---")

    try:
        session_id = f"playground_{uuid.uuid4()}"
        user_id = "playground_user"

        # Explicitly create the session before running the agent
        await session_service.create_session(
            user_id=user_id,
            session_id=session_id,
            app_name="catalog_manager_app"
        )

        full_agent_response = []
        for event in await asyncio.to_thread(
            root_agent_runner.run,
            user_id=user_id,
            session_id=session_id,
            new_message=types.Content(parts=[types.Part(text=agent_query_data.query)])
        ):
            if event.type == "response.output_text.delta":
                full_agent_response.append(event.delta)
        
        agent_response = "".join(full_agent_response)

        print("--- Agent playground execution completed ---")
        print(f"Raw agent response: {agent_response}")

        return {"message": "Agent query executed", "response": agent_response}

    except Exception as e:
        print(f"--- An unexpected error occurred during agent playground execution: {e} ---")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to execute agent query: {str(e)}\nFull Traceback: {traceback.format_exc()}",
        )

@router.get("/check-groq-key")
async def check_groq_key():
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key:
        return {"GROQ_API_KEY_SET": True, "key_prefix": groq_api_key[:5] + "..."}
    else:
        return {"GROQ_API_KEY_SET": False, "message": "GROQ_API_KEY is not set in environment variables."}