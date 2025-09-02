from fastapi import APIRouter, HTTPException
from catalog_agent.product_optimizer_agent import product_optimizer_agent
from backend.services.product_service import get_product_by_id, update_product

router = APIRouter(prefix="/optimize", tags=["optimizer"])


@router.post("/{product_id}")
async def optimize_product(product_id: int):
    # 1. Fetch product from DB
    product = await get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Run agent with product details
    prompt = f"""
    Optimize this product for SEO and engagement:
    Title: {product.title}
    Description: {product.description}
    Tags: {product.tags}
    """

    response = await product_optimizer_agent.run(prompt)

    # 3. Extract optimized fields
    optimized_data = response.get("output", {})
    if not optimized_data:
        raise HTTPException(status_code=500, detail="Agent returned no output")

    # 4. Update product in DB
    updated_product = await update_product(product_id, optimized_data)

    return {"original": product, "optimized": updated_product}
