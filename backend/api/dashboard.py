from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import session
import database_models

api = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


# 1. Top 5 Stats (Calculated with simple loops)
@api.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    all_orders = db.query(database_models.Order).all()
    all_products = db.query(database_models.Product).all()

    # Calculate total sales and completed orders count
    total_sales = 0.0
    completed_count = 0
    for order in all_orders:
        if order.status == "Completed":
            total_sales += order.total_amount
            completed_count += 1

    # Count low stock products
    low_stock_count = 0
    for prod in all_products:
        if prod.stock <= 5:
            low_stock_count += 1

    # Simple average order value
    avg_order = 0.0
    if completed_count > 0:
        avg_order = round(total_sales / completed_count, 2)

    return {
        "total_sales": round(total_sales, 2),
        "total_orders": len(all_orders),
        "total_products": len(all_products),
        "total_customers": db.query(database_models.Customer).count(),
        "low_stock_items": low_stock_count,
        "avg_order_value": avg_order
    }


# 2. Dynamic Donut Chart (Count orders by status simply)
@api.get("/orders-chart")
def get_orders_chart(db: Session = Depends(get_db)):
    all_orders = db.query(database_models.Order).all()

    pending = 0
    processing = 0
    shipped = 0
    completed = 0
    cancelled = 0

    for order in all_orders:
        if order.status == "Pending":
            pending += 1
        elif order.status == "Processing":
            processing += 1
        elif order.status == "Shipped":
            shipped += 1
        elif order.status == "Completed":
            completed += 1
        elif order.status == "Cancelled":
            cancelled += 1

    return [
        {"name": "Pending", "value": pending, "color": "#6366F1"},
        {"name": "Processing", "value": processing, "color": "#F59E0B"},
        {"name": "Shipped", "value": shipped, "color": "#10B981"},
        {"name": "Completed", "value": completed, "color": "#06B6D4"},
        {"name": "Cancelled", "value": cancelled, "color": "#EF4444"},
    ]


# 3. Dynamic Sales Chart (Each order creates a point on the line)
@api.get("/sales-chart")
def get_sales_chart(db: Session = Depends(get_db)):
    completed_orders = db.query(database_models.Order).filter(database_models.Order.status == "Completed").all()

    chart_data = []
    order_number = 1

    for order in completed_orders:
        chart_data.append({
            "date": f"Order {order_number}",
            "sales": order.total_amount
        })
        order_number += 1

    if len(chart_data) == 0:
        return [{"date": "Start", "sales": 0}]

    return chart_data


# 4. Low Stock List
@api.get("/low-stock")
def get_low_stock_products(db: Session = Depends(get_db)):
    low_stock = db.query(database_models.Product).filter(database_models.Product.stock <= 5).all()
    return low_stock


# 5.  Category Inventory Value 
@api.get("/category-sales")
def get_category_sales(db: Session = Depends(get_db)):
    categories = db.query(database_models.Category).all()
    products = db.query(database_models.Product).all()

    colors = ["bg-indigo-600", "bg-emerald-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500"]
    result = []

    # Calculate overall total inventory worth
    total_store_value = 0.0
    for p in products:
        total_store_value += (p.price * p.stock)

    if total_store_value == 0:
        total_store_value = 1.0  # Avoid division by zero

    color_index = 0
    for cat in categories:
        cat_total = 0.0
        for p in products:
            if p.category_id == cat.id:
                cat_total += (p.price * p.stock)

        percentage = round((cat_total / total_store_value) * 100)

        result.append({
            "name": cat.name,
            "amount": f"${round(cat_total, 2)}",
            "width": f"{percentage}%",
            "color": colors[color_index % len(colors)]
        })
        color_index += 1

    return result


# 6. Dynamic Recent Orders (Powers the Recent Orders Table)
@api.get("/recent-orders")
def get_recent_orders(db: Session = Depends(get_db)):
    # Grab the last 5 orders
    orders = db.query(database_models.Order).order_by(database_models.Order.id.desc()).limit(5).all()

    result = []
    for o in orders:
        # Match customer name
        customer = db.query(database_models.Customer).filter(database_models.Customer.id == o.customer_id).first()
        customer_name = customer.name if customer else "Guest"

        result.append({
            "id": f"#ORD-{o.id:04d}",
            "name": customer_name,
            "date": "Today",
            "amount": f"${round(o.total_amount, 2)}",
            "status": o.status
        })

    return result