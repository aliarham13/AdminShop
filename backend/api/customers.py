from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import session
import database_models
import pydantic_models

api = APIRouter(prefix="/api/customers", tags=["Customers"])

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@api.get("/")
def get_all_customers(db: Session = Depends(get_db)):
    customers = db.query(database_models.Customer).all()
    return customers

@api.get("/{id}")
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(database_models.Customer).filter(database_models.Customer.id == id).first()
    if customer:
        return customer
    return {"message": "Customer not found"}

@api.get("/{id}/orders")
def get_customer_orders(id: int, db: Session = Depends(get_db)):
    orders = db.query(database_models.Order).filter(database_models.Order.customer_id == id).all()
    return orders


@api.post("/")
def create_customer(customer: pydantic_models.Customer, db: Session = Depends(get_db)):
    new_customer = database_models.Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        address=customer.address
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer


@api.put("/{id}")
def update_customer(id: int, customer: pydantic_models.Customer, db: Session = Depends(get_db)):
    db_cust = db.query(database_models.Customer).filter(database_models.Customer.id == id).first()
    if db_cust:
        db_cust.name = customer.name
        db_cust.email = customer.email
        db_cust.phone = customer.phone
        db_cust.address = customer.address
        db.commit()
        db.refresh(db_cust)
        return db_cust
    return {"message": "Customer not found"}

@api.delete("/{id}")
def delete_customer(id: int, db: Session = Depends(get_db)):
    db_cust = db.query(database_models.Customer).filter(database_models.Customer.id == id).first()
    if db_cust:
        db.delete(db_cust)
        db.commit()
        return "Customer Deleted Successfully"
    return {"message": "Customer not found"}