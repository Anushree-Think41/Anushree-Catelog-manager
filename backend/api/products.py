from fastapi import APIRouter, HTTPException
from backend.services import shopify_service

router = APIRouter()

@router.get("/")
def get_products(limit: int = 10):
    try:
        products = shopify_service.get_products(limit=limit)
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/")
def create_product(product: dict):
    try:
        new_product = shopify_service.create_product(product)
        return {"product": new_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}")
def update_product(product_id: str, product: dict):
    try:
        updated_product = shopify_service.update_product(product_id, product)
        return {"product": updated_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}")
def delete_product(product_id: str):
    try:
        return shopify_service.delete_product(product_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
