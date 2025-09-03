# backend/api/optimize.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Product
from backend.services.product_service import get_product_by_shopify_id, create_optimized_product
import asyncio
from catalog_agent.product_optimizer_agent import optimize_product
from catalog_agent.all_products_optimizer_agent import optimize_all_products
import json
router = APIRouter()

@router.post("/shopify/{shopify_id}")
async def optimize_product_endpoint(shopify_id: str, db: Session = Depends(get_db)):
    # 1. Fetch product from DB
    product = get_product_by_shopify_id(db, shopify_id)
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
async def optimize_all_products_endpoint(background_tasks: BackgroundTasks):
    """
    Triggers the optimization of all Shopify products in the background.
    """
    background_tasks.add_task(optimize_all_products)
    return {"message": "Product optimization started in the background."}