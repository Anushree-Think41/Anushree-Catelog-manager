from fastapi import APIRouter, HTTPException
from backend.services.shopify_service import ShopifyService

router = APIRouter()
shopify_service = ShopifyService()


@router.get("/")
async def get_products(limit: int = 10):
    try:
        products = await shopify_service.get_products(limit=limit)
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_product(product: dict):
    try:
        new_product = await shopify_service.create_product(product)
        return {"product": new_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{product_id}")
async def update_product(product_id: str, product: dict):
    try:
        updated_product = await shopify_service.update_product(product_id, product)
        return {"product": updated_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    try:
        return await shopify_service.delete_product(product_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
