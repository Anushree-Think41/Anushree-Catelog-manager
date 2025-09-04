# backend/api/optimize.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Body
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Product
from backend.services.product_service import create_optimized_product
import asyncio
from catalog_agent.product_optimizer_agent import optimize_product
from catalog_agent.all_products_optimizer_agent import optimize_all_products
from pydantic import BaseModel
import json

router = APIRouter()

class ProductOptimizationRequest(BaseModel):
    prompt: str
    product_details: dict # This will contain title, description, tags

class OptimizationParameters(BaseModel):
    category: str | None = None
    seoFocus: str | None = None
    writingTone: str | None = None

@router.post("/products/{product_id}/optimize")
async def optimize_product_endpoint(
    product_id: int,
    request: ProductOptimizationRequest,
    db: Session = Depends(get_db)
):
    # 1. Fetch product from DB
    # Assuming product_id is the primary key (id) in the Product model
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Prepare product input
    product_input = {
        "title": product.title,
        "description": product.description,
        "tags": product.tags
    }

    # 3. Call agent to optimize product
    try:
        optimized_data = await optimize_product(product_input)
        if "error" in optimized_data:
            # Handle cases where the agent output is not valid JSON
            raise HTTPException(status_code=500, detail=f"Agent error: {optimized_data['error']}. Raw output: {optimized_data.get('raw_output')}")

    except Exception as e:
        # Handle other exceptions during agent execution
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

    # 4. Create optimized product in DB
    optimized_product_entry = create_optimized_product(db, product, optimized_data)

    return {
        "original": product,
        "optimized": optimized_product_entry,
        "raw_output": optimized_data
    }

@router.post("/all-products")
async def optimize_all_products_endpoint(background_tasks: BackgroundTasks, params: OptimizationParameters = Body(...)):
    """
    Triggers the optimization of all Shopify products in the background.
    """
    background_tasks.add_task(optimize_all_products, category=params.category, seo_focus=params.seoFocus, writing_tone=params.writingTone)
    return {"message": "Product optimization started in the background."}