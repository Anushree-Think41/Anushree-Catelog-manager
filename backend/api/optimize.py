from fastapi import APIRouter, HTTPException
from catalog_agent.product_optimizer_agent import product_optimizer_agent
from backend.services.product_service import get_product_by_id, update_product
import json

router = APIRouter(prefix="/optimize", tags=["optimizer"])


@router.post("/{product_id}")
async def optimize_product(product_id: int):
    # 1. Fetch product from DB
    product = await get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Build structured prompt
    prompt = f"""
    Optimize this product for SEO and engagement.
    Return JSON only, with keys: suggested_title, suggested_description, seo_keywords.

    Product Input:
    Title: {product.title}
    Description: {product.description}
    Tags: {product.tags}
    """

    # 3. Call LLM agent
    try:
        response = await product_optimizer_agent.chat(prompt)
        raw_output = response.output_text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

    # 4. Parse agent response as JSON
    try:
        optimized_data = json.loads(raw_output)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Agent did not return valid JSON")

    # 5. Update product in DB
    updated_product = await update_product(product_id, optimized_data)

    return {
        "original": product,
        "optimized": updated_product,
        "raw_output": raw_output  # keep for debugging
    }
