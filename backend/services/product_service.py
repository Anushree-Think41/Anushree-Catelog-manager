from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.db.models import Product
from backend.db.schemas import ProductUpdate


# Fetch product by ID
async def get_product_by_id(product_id: int):
    with SessionLocal() as session:  # create a new session
        return session.query(Product).filter(Product.id == product_id).first()


# Update product with optimized fields
async def update_product(product_id: int, updates: dict):
    with SessionLocal() as session:
        product = session.query(Product).filter(Product.id == product_id).first()
        if not product:
            return None

        # Apply updates dynamically
        for key, value in updates.items():
            if hasattr(product, key):  # only set valid fields
                setattr(product, key, value)

        session.commit()
        session.refresh(product)
        return product
