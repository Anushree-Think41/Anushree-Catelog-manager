from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    sku = Column(String, unique=True, index=True)
    tags = Column(String, nullable=True)
    shopify_id = Column(String, unique=True, index=True, nullable=True)

class OptimizedProduct(Base):
    __tablename__ = "optimized_products"

    id = Column(Integer, primary_key=True, index=True)
    original_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    sku = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    shopify_id = Column(String, nullable=True)
    