from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import session
import database_models
import pydantic_models

api = APIRouter(prefix="/api/categories", tags=["Categories"])

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@api.get("/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(database_models.Category).all()
    return categories

@api.get("/{id}")
def get_category(id: int, db: Session = Depends(get_db)):
    cat = db.query(database_models.Category).filter(database_models.Category.id == id).first()
    if cat:
        return cat
    return {"message": "Category not found"}

@api.post("/")
def add_category(category: pydantic_models.Category, db: Session = Depends(get_db)):
    new_cat = database_models.Category(
        name=category.name,
        description=category.description
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@api.put("/{id}")
def update_category(id: int, category: pydantic_models.Category, db: Session = Depends(get_db)):
    cat = db.query(database_models.Category).filter(database_models.Category.id == id).first()
    if cat:
        cat.name = category.name
        cat.description = category.description
        db.commit()
        return "Category updated successfully"
    return {"message": "Category not found"}

@api.delete("/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    cat = db.query(database_models.Category).filter(database_models.Category.id == id).first()
    if cat:
        # Check if products exist in category before deleting
        has_products = db.query(database_models.Product).filter(database_models.Product.category_id == id).first()
        if has_products:
            return {"message": "Cannot delete category that still has products"}
        db.delete(cat)
        db.commit()
        return "Category deleted successfully"
    return {"message": "Category not found"}