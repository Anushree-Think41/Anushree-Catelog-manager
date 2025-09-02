from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset, SseServerParams

shopify_toolset = McpToolset(
    connection_params=SseServerParams(
        url="http://127.0.0.1:8000/mcp/sse"
    )
)

# Root agent
root_agent = LlmAgent(
    name="catalog_agent",
    model="gemini-1.5-flash",
    tools=[shopify_toolset],
)

