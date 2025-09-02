from sqlalchemy import Column, Integer, String, Float
from backend.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float)
    sku = Column(String, unique=True, index=True)
