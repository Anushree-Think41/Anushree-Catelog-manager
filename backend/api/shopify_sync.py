from fastapi import APIRouter
from backend.services.shopify_sync_service import sync_products_from_shopify

router = APIRouter()

@router.post("/shopify/sync")
async def sync_shopify():
    await sync_products_from_shopify()
    return {"status": "success", "message": "Shopify products synced"}
