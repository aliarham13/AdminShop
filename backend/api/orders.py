from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import session
import database_models
import pydantic_models

api = APIRouter(prefix="/api/orders", tags=["Orders"])

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@api.get("/")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(database_models.Order).all()
    return orders

@api.get("/{id}")
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(database_models.Order).filter(database_models.Order.id == id).first()
    if order:
        return order
    return {"message": "Order not found"}

@api.patch("/{id}/status")
def update_order_status(id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(database_models.Order).filter(database_models.Order.id == id).first()
    if order:
        order.status = status
        db.commit()
        return f"Order status updated to {status}"
    return {"message": "Order not found"}


@api.post("/")
def create_order(order: pydantic_models.Order, db: Session = Depends(get_db)):
    new_order = database_models.Order(
        customer_id=order.customer_id,
        total_amount=order.total_amount,
        status=order.status
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@api.put("/{id}")
def update_order(id: int, order: pydantic_models.Order, db: Session = Depends(get_db)):
    db_order = db.query(database_models.Order).filter(database_models.Order.id == id).first()
    if db_order:
        db_order.status = order.status
        db_order.total_amount = order.total_amount
        db_order.customer_id = order.customer_id
        db.commit()
        db.refresh(db_order)
        return db_order
    return {"message": "Order not found"}

@api.delete("/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    db_order = db.query(database_models.Order).filter(database_models.Order.id == id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return "Order Deleted Successfully"
    return {"message": "Order not found"}