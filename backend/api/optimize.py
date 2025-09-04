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
from backend.services.shopify_service import ShopifyService
from backend.db.models import OptimizedProduct
from typing import List

router = APIRouter()

class ProductOptimizationRequest(BaseModel):
    prompt: str
    product_details: dict # This will contain title, description, tags

class OptimizationParameters(BaseModel):
    category: str | None = None
    seoFocus: str | None = None
    writingTone: str | None = None

class ProductIdsRequest(BaseModel):
    product_ids: List[str]

async def _send_single_optimized_product_to_shopify(
    shopify_product_id: str,
    db: Session
):
    # 1. Fetch the latest optimized product for the given shopify_product_id
    optimized_product = db.query(OptimizedProduct).filter(
        OptimizedProduct.shopify_id == shopify_product_id
    ).order_by(OptimizedProduct.id.desc()).first() # Get the latest optimized version

    if not optimized_product:
        raise HTTPException(status_code=404, detail=f"Optimized product not found for Shopify ID: {shopify_product_id}")

    if not optimized_product.shopify_id:
        raise HTTPException(status_code=400, detail="Optimized product does not have a Shopify ID. Cannot update Shopify.")

    # 2. Prepare product data for Shopify
    # Note: Shopify API expects price as a string, and tags as a comma-separated string
    shopify_product_data = {
        "title": optimized_product.title,
        "body_html": optimized_product.description,
        "tags": optimized_product.tags,
        "variants": [
            {
                "price": str(optimized_product.price),
                "sku": optimized_product.sku
            }
        ]
    }

    # 3. Call ShopifyService to update the product
    try:
        shopify_service = ShopifyService()
        updated_shopify_product = await shopify_service.update_product(
            product_id=optimized_product.shopify_id,
            product_data=shopify_product_data
        )
        return {
            "status": "success",
            "message": f"Optimized product {shopify_product_id} sent to Shopify successfully",
            "shopify_response": updated_shopify_product
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send product {shopify_product_id} to Shopify: {str(e)}")

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

@router.post("/products/shopify/{shopify_product_id}/send-to-shopify")
async def send_optimized_product_to_shopify(
    shopify_product_id: str,
    db: Session = Depends(get_db)
):
    return await _send_single_optimized_product_to_shopify(shopify_product_id, db)

@router.post("/products/shopify/send-multiple")
async def send_multiple_optimized_products_to_shopify(
    request: ProductIdsRequest,
    db: Session = Depends(get_db)
):
    results = []
    for product_id in request.product_ids:
        try:
            result = await _send_single_optimized_product_to_shopify(product_id, db)
            results.append(result)
        except HTTPException as e:
            results.append({"status": "error", "product_id": product_id, "detail": e.detail})
        except Exception as e:
            results.append({"status": "error", "product_id": product_id, "detail": str(e)})
    return results
