# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import products, auth, optimize, shopify_sync, insights, agent_playground, chat # Import agent_playground and chat
from backend.mcp_server import mcp_app  # ✅ import the ASGI app instead

app = FastAPI(title="Catalog Manager Backend")

# Configure CORS
origins = [
    "http://localhost:5173",  # Allow requests from your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(optimize.router, prefix="/optimize", tags=["Optimize"])
app.include_router(shopify_sync.router, prefix="/shopify", tags=["Shopify"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(agent_playground.router, prefix="/api", tags=["Agent Playground"]) # Include agent_playground router
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
# Mount MCP server under /mcp
app.mount("/mcp/", mcp_app)

@app.get("/")
def root():
    return {"message": "Catalog Manager Backend is running 🚀"}
