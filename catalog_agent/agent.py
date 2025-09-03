import os
from dotenv import load_dotenv
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import SseConnectionParams

# Load environment variables
load_dotenv()

# Define toolset using SSE to connect to a running server
shopify_toolset = MCPToolset(
    connection_params=SseConnectionParams(
        url="http://127.0.0.1:8000/mcp",
    )
)

# Root agent
root_agent = LlmAgent(
    name="catalog_agent",
    model="gemini-1.5-flash-latest",  # can be made configurable via env
    tools=[shopify_toolset],
)
