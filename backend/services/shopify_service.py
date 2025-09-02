import os
import httpx
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from backend.db.models import Product
from backend.utils.logger import logger  # optional
from typing import List, Dict
load_dotenv()

SHOPIFY_STORE = os.getenv("SHOPIFY_STORE_URL")  # e.g. mystore.myshopify.com
SHOPIFY_ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")
SHOPIFY_API_VERSION = "2025-01"

BASE_URL = f"https://{SHOPIFY_STORE}/admin/api/{SHOPIFY_API_VERSION}"


class ShopifyService:
    """Service layer for interacting with Shopify API"""

    def __init__(self):
        if not SHOPIFY_STORE or not SHOPIFY_ACCESS_TOKEN:
            raise ValueError("Missing Shopify environment variables")
        self.base_url = BASE_URL
        self.headers = {
            "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            "Content-Type": "application/json",
        }

    async def get_products(self, limit: int = 10):
        url = f"{self.base_url}/products.json?limit={limit}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            resp.raise_for_status()
            products = resp.json().get("products", [])
            logger.info(f"Fetched {len(products)} products from Shopify")
            return products

    async def get_product(self, product_id: str):
        url = f"{self.base_url}/products/{product_id}.json"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            resp.raise_for_status()
            return resp.json().get("product")

    async def create_product(self, product_data: dict):
        url = f"{self.base_url}/products.json"
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=self.headers, json={"product": product_data})
            resp.raise_for_status()
            product = resp.json().get("product")
            logger.info(f"Created product {product.get('id')} in Shopify")
            return product

    async def update_product(self, product_id: str, product_data: dict):
        url = f"{self.base_url}/products/{product_id}.json"
        async with httpx.AsyncClient() as client:
            resp = await client.put(url, headers=self.headers, json={"product": product_data})
            resp.raise_for_status()
            return resp.json().get("product")

    async def delete_product(self, product_id: str):
        url = f"{self.base_url}/products/{product_id}.json"
        async with httpx.AsyncClient() as client:
            resp = await client.delete(url, headers=self.headers)
            resp.raise_for_status()
            logger.info(f"Deleted product {product_id} from Shopify")
            return {"deleted": product_id}

    @staticmethod
    def save_products_to_db(db: Session, shopify_products: List[Dict]):
        """Save Shopify products to the database. Avoids duplicates using shopify_id."""
        for sp in shopify_products:
            shopify_id = str(sp["id"])
            existing = db.query(Product).filter_by(shopify_id=shopify_id).first()
            if existing:
                continue

            variants = sp.get("variants", [])
            price, sku = 0, None
            if variants:
                price = int(float(variants[0].get("price") or 0))
                sku = variants[0].get("sku")

            product = Product(
                title=sp.get("title"),
                description=sp.get("body_html"),
                price=price,
                sku=sku,
                tags=sp.get("tags"),
                shopify_id=shopify_id,
            )
            db.add(product)

        db.commit()
