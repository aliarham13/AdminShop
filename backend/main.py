from fastapi import FastAPI, Depends
from database import engine, session
import database_models
import seed
from sqlalchemy.orm import Session
from api import categories, customers, products, orders, dashboard
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"]
)


app.include_router(categories.api)
app.include_router(customers.api)
app.include_router(products.api)
app.include_router(orders.api)
app.include_router(dashboard.api)

database_models.Base.metadata.create_all(bind=engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def seed_db():
    db = session()
    try:
        # 1. Seed Categories
        category_count = db.query(database_models.Category).count()
        if category_count == 0:
            for cat in seed.CATEGORIES_DATA:
                db.add(database_models.Category(**cat))
            db.commit()
            print("Categories seeded successfully.")
        else:
            print("Categories already seeded.")

        # 2. Seed Products
        product_count = db.query(database_models.Product).count()
        if product_count == 0:
            for prod in seed.PRODUCTS_DATA:
                db.add(database_models.Product(**prod))
            db.commit()
            print("Products seeded successfully.")
        else:
            print("Products already seeded.")

        # 3. Seed Customers
        customer_count = db.query(database_models.Customer).count()
        if customer_count == 0:
            for cust in seed.CUSTOMERS_DATA:
                db.add(database_models.Customer(**cust))
            db.commit()
            print("Customers seeded successfully.")
        else:
            print("Customers already seeded.")

        # 4. Seed Orders
        order_count = db.query(database_models.Order).count()
        if order_count == 0:
            for ord in seed.ORDERS_DATA:
                db.add(database_models.Order(**ord))
            db.commit()
            print("Orders seeded successfully.")
        else:
            print("Orders already seeded.")

    finally:
        db.close()

seed_db()