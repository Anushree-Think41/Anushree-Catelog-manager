import logging
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.db.models import Product
from backend.services.shopify_service import ShopifyService

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

shopify_service = ShopifyService()

async def sync_products_from_shopify(limit: int = 20):
    """
    Fetch products from Shopify and sync with local DB.
    """
    db: Session = SessionLocal()
    try:
        shopify_products = await shopify_service.get_products(limit=limit)
        logger.info(f"Fetched {len(shopify_products)} products from Shopify")

        for sp in shopify_products:
            shopify_id = str(sp["id"])
            logger.info(f"Processing Shopify product {shopify_id} - {sp.get('title')}")

            product = db.query(Product).filter(Product.shopify_id == shopify_id).first()

            variants = sp.get("variants", [])
            price = float(variants[0].get("price", 0)) if variants else 0
            sku = variants[0].get("sku") if variants else None
            tags = sp.get("tags", "")  # Shopify sends as string

            if product:
                logger.info(f"Updating existing product {shopify_id}")
                product.title = sp.get("title")
                product.description = sp.get("body_html")
                product.tags = tags
                product.price = price
                product.sku = sku
            else:
                logger.info(f"Inserting new product {shopify_id}")
                new_product = Product(
                    shopify_id=shopify_id,
                    title=sp.get("title"),
                    description=sp.get("body_html"),
                    tags=tags,
                    price=price,
                    sku=sku,
                )
                db.add(new_product)

        db.commit()
        logger.info("DB commit successful ✅")
    except Exception as e:
        logger.error(f"Sync failed: {e}")
        db.rollback()
    finally:
        db.close()
