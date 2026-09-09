from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import session
import database_models
import pydantic_models
from sqlalchemy.exc import IntegrityError

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

@api.get("/{id}", status_code=200)
def get_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        return db_product
    raise HTTPException(status_code=404, detail="Product not found")

@api.post("/", status_code=201)
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

    try:
        db.commit()
        db.refresh(new_prod)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

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

@api.delete("/{id}", status_code=200)
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product Deleted Successfully"
    return {"message": "Product not Found"}