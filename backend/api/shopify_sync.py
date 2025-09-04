from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import OptimizedProduct
from backend.services.shopify_sync_service import sync_products_from_shopify
from backend.services.shopify_service import ShopifyService

router = APIRouter()
shopify_service = ShopifyService()

@router.post("/shopify/sync")
async def sync_shopify():
    await sync_products_from_shopify()
    return {"status": "success", "message": "Shopify products synced"}

@router.post("/products/shopify/update-single/{optimized_product_id}")
async def update_single_product_on_shopify(
    optimized_product_id: int,
    db: Session = Depends(get_db)
):
    optimized_product = db.query(OptimizedProduct).filter(OptimizedProduct.id == optimized_product_id).first()

    if not optimized_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Optimized product not found")

    if not optimized_product.shopify_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Optimized product does not have a Shopify ID")

    # Prepare data for Shopify API
    product_data = {
        "title": optimized_product.title,
        "body_html": optimized_product.description,
        "variants": [
            {
                "price": str(optimized_product.price),
                "sku": optimized_product.sku
            }
        ],
        "tags": optimized_product.tags # Assuming tags are already in a comma-separated string
    }

    try:
        await shopify_service.update_product(optimized_product.shopify_id, product_data)
        return {"status": "success", "message": f"Product {optimized_product_id} updated on Shopify"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update product on Shopify: {e}")
