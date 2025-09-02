import os
from dotenv import load_dotenv
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters  # from the MCP SDK

# Load environment variables
load_dotenv()

# Optional: if you want to make the server command configurable
MCP_SERVER_CMD = os.getenv("MCP_SERVER_CMD", "uvicorn")
MCP_SERVER_ARGS = os.getenv(
    "MCP_SERVER_ARGS",
    "backend.mcp_server:mcp_app --reload --host 127.0.0.1 --port 8001"
).split()

# Define toolset using STDIO
shopify_toolset = MCPToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command=MCP_SERVER_CMD,
            args=MCP_SERVER_ARGS,
        )
    )
)

# Root agent
root_agent = LlmAgent(
    name="catalog_agent",
    model="gemini-1.5-flash",  # can be made configurable via env
    tools=[shopify_toolset],
)
