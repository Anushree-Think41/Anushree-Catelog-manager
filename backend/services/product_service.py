from backend.db.models import Product
from backend.db.schemas import ProductUpdate
from backend.db import session

async def get_product_by_id(product_id: int):
    return session.query(Product).filter(Product.id == product_id).first()

async def update_product(product_id: int, updates: dict):
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    for key, value in updates.items():
        setattr(product, key, value)
    session.commit()
    session.refresh(product)
    return product
