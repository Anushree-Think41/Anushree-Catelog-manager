from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.services.product_service import get_all_products, get_product_by_shopify_id, get_all_optimized_products
from backend.db.schemas import ProductOut, OptimizedProductOut
from backend.services import shopify_service
from backend.services.shopify_service import ShopifyService 

router = APIRouter()

@router.get("/", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    products = get_all_products(db)
    print(f"Products from DB: {products}")
    return products


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

@router.get("/shopify/{shopify_id}")
def fetch_product(shopify_id: str, db: Session = Depends(get_db)):
    product = get_product_by_shopify_id(db, shopify_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/optimized-products", response_model=list[OptimizedProductOut])
def get_optimized_products(db: Session = Depends(get_db)):
    optimized_products = get_all_optimized_products(db)
    return optimized_products