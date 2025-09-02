from fastapi import APIRouter, HTTPException
from backend.services.shopify_service import ShopifyService
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
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

@router.post("/sync")
def sync_products(db: Session = Depends(get_db)):
    shopify_products = [
        {
            "id": "12345",
            "title": "Test Product",
            "body_html": "A product description",
            "tags": "tag1,tag2",
            "variants": [{"price": "100", "sku": "SKU123"}]
        }
    ]

    ShopifyService.save_products_to_db(db, shopify_products)  # ✅ Use class method
    return {"message": "Products synced successfully!"}