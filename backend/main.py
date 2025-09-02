# backend/main.py
from fastapi import FastAPI
from backend.api import products, auth, optimize
from backend.mcp_server import mcp_app  # ✅ import the ASGI app instead

app = FastAPI(title="Catalog Manager Backend")

# Register routes
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(optimize.router, prefix="/optimize", tags=["Optimize"])

# Mount MCP server under /mcp
app.mount("/mcp", mcp_app)

@app.get("/")
def root():
    return {"message": "Catalog Manager Backend is running 🚀"}
