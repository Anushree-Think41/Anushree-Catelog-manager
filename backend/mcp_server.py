# backend/mcp_server.py
from fastmcp import FastMCP
from backend.services import shopify_service

# Create the MCP server
mcp = FastMCP(name="Catalog Shopify MCP Server")

@mcp.tool()
async def get_products(limit: int = 10):
    return await shopify_service.get_products(limit=limit)

@mcp.tool()
async def create_product(product: dict):
    return await shopify_service.create_product(product)

@mcp.tool()
async def update_product(product_id: str, updates: dict):
    return await shopify_service.update_product(product_id, updates)

@mcp.tool()
async def delete_product(product_id: str):
    return await shopify_service.delete_product(product_id)

@mcp.tool()
async def get_product(product_id: str):
    return await shopify_service.get_product(product_id)

# Expose the ASGI app for FastAPI
mcp_app = mcp.http_app()

