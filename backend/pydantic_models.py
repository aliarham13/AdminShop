from pydantic import BaseModel

class Category(BaseModel):
    id: int = 0
    name: str
    description: str = ""
    created_at: str = ""

class Product(BaseModel):
    id: int = 0
    name: str
    sku: str = ""
    description: str = ""
    price: float = 0.0
    stock: int = 0
    image_url: str = ""
    status: str = "Active"
    category_id: int
    created_at: str = ""

class Order(BaseModel):
    id: int = 0
    customer_id: int
    status: str = "Pending"
    total_amount: float = 0.0
    created_at: str = ""

class OrderItem(BaseModel):
    id: int = 0
    order_id: int
    product_id: int
    quantity: int = 1
    price: float = 0.0

class Customer(BaseModel):
    id: int = 0
    name: str
    email: str
    phone: str = ""
    address: str = ""
    created_at: str = ""