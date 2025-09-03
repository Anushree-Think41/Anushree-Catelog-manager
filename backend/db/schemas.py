from pydantic import BaseModel

class ProductBase(BaseModel):
    title: str
    description: str | None = None
    price: float
    sku: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None

class ProductOut(ProductBase):
    id: int
    class Config:
        from_attributes = True

class OptimizedProductOut(BaseModel):
    id: int
    original_product_id: int
    title: str
    description: str | None = None
    price: float
    sku: str | None = None
    tags: str | None = None
    shopify_id: str | None = None

    class Config:
        from_attributes = True

