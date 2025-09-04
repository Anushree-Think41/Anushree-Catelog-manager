from sqlalchemy.orm import Session
from backend.db.models import Product, OptimizedProduct
from backend.db.schemas import ProductUpdate, ProductOut
from typing import Optional, Dict

# Fetch a product by ID
def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

# Fetch a product by Shopify ID
def get_product_by_shopify_id(db: Session, shopify_id: str) -> Optional[Product]:
    return db.query(Product).filter(Product.shopify_id == shopify_id).first()

# Update product fields
def update_product(db, product_id: int, optimized_data: dict):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    print(f"Product before update: {product.title}")
    # Update fields if present
    product.title = optimized_data.get("title", product.title)
    product.description = optimized_data.get("description", product.description)
    # Store keywords as tags (comma-separated)
    tags = optimized_data.get("tags", [])
    product.tags = ",".join(tags) if tags else product.tags

    db.commit()        # ✅ Commit changes
    db.refresh(product)  # ✅ Refresh object to reflect committed values
    print(f"Product after update: {product.title}")
    return product


# Create a new product
def create_product(db: Session, product_data: Dict) -> Product:
    product = Product(
        shopify_id=product_data.get("shopify_id"),
        title=product_data.get("title"),
        description=product_data.get("description"),
        price=product_data.get("price"),
        sku=product_data.get("sku"),
        tags=product_data.get("tags"),
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_all_products(db: Session) -> list[Product]:
    return db.query(Product).all()

def create_optimized_product(db: Session, original_product: Product, optimized_data: dict) -> OptimizedProduct:
    optimized_product = OptimizedProduct(
        original_product_id=original_product.id,
        title=optimized_data.get("title", original_product.title),
        description=optimized_data.get("description", original_product.description),
        price=original_product.price,
        sku=original_product.sku,
        tags=", ".join(optimized_data.get("tags", [])),
        shopify_id=original_product.shopify_id
    )
    db.add(optimized_product)
    db.commit()
    db.refresh(optimized_product)
    return optimized_product

def get_all_optimized_products(db: Session) -> list[OptimizedProduct]:
    return db.query(OptimizedProduct).all()

def get_optimized_product_by_id(db: Session, product_id: int) -> Optional[OptimizedProduct]:
    return db.query(OptimizedProduct).filter(OptimizedProduct.id == product_id).first()
