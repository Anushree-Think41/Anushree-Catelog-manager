import os
from dotenv import load_dotenv
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import SseConnectionParams
from google.adk.tools import google_search # Import google_search directly
from catalog_agent.tools.product_tools import (
    get_original_product_details_tool,
    get_optimized_product_details_tool,
    optimize_product_tool,
    update_product_on_shopify_tool
)

# Load environment variables
load_dotenv()

# Define toolset using SSE to connect to a running server
shopify_toolset = MCPToolset(
    connection_params=SseConnectionParams(
        url="http://127.0.0.1:8000/mcp/",
    )
)

# Root agent
root_agent = LlmAgent(
    name="catalog_agent",
    model="gemini-1.5-flash-latest",  # can be made configurable via env
    tools=[
        shopify_toolset,
        get_original_product_details_tool,
        get_optimized_product_details_tool,
        optimize_product_tool,
        update_product_on_shopify_tool
    ], # Use google_search directly
    # tools=[google_search]
)
