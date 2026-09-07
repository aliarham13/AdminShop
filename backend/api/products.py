from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import session
import database_models
import pydantic_models

api = APIRouter(prefix="/api/products", tags=["Products"])

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@api.get("/")
def get_all_products(db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).all()
    return db_products

@api.get("/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        return db_product
    return {"message": "Product Not Found"}

@api.post("/")
def add_product(product: pydantic_models.Product, db: Session = Depends(get_db)):
    new_prod = database_models.Product(
        name=product.name,
        sku=product.sku,
        description=product.description,
        price=product.price,
        stock=product.stock,
        image_url=product.image_url,
        status=product.status,
        category_id=product.category_id
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

@api.put("/{id}")
def update_product(id: int, product: pydantic_models.Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.sku = product.sku
        db_product.description = product.description
        db_product.price = product.price
        db_product.stock = product.stock
        db_product.status = product.status
        db_product.category_id = product.category_id
        db.commit()
        return "Product Updated Successfully"
    return {"message": "Product not found"}

@api.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product Deleted Successfully"
    return {"message": "Product not Found"}