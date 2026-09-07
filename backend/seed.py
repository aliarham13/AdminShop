CATEGORIES_DATA = [
    {"id": 1, "name": "Laptops", "description": "Laptops and notebooks"},
    {"id": 2, "name": "Smartphones", "description": "Mobile phones and devices"},
    {"id": 3, "name": "Audio", "description": "Headphones and audio equipment"},
    {"id": 4, "name": "Monitors", "description": "Displays and screens"},
    {"id": 5, "name": "Accessories", "description": "Keyboards, mice, and chargers"},
    {"id": 6, "name": "Storage", "description": "SSDs and external drives"},
    {"id": 7, "name": "Networking", "description": "Routers and networking gear"},
]



CUSTOMERS_DATA = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "phone": "+1 555-0101", "address": "123 Main St"},
    {"id": 2, "name": "Sarah Smith", "email": "sarah@example.com", "phone": "+1 555-0102", "address": "456 Oak Ave"},
    {"id": 3, "name": "Michael Johnson", "email": "michael@example.com", "phone": "+1 555-0103", "address": "789 Pine Rd"},
    {"id": 4, "name": "Emily Davis", "email": "emily@example.com", "phone": "+1 555-0104", "address": "321 Cedar Blvd"},
]

ORDERS_DATA = [
    {"id": 1, "customer_id": 1, "status": "Completed", "total_amount": 1240.00},
    {"id": 2, "customer_id": 2, "status": "Processing", "total_amount": 320.50},
    {"id": 3, "customer_id": 3, "status": "Shipped", "total_amount": 560.00},
    {"id": 4, "customer_id": 4, "status": "Pending", "total_amount": 120.00},
    {"id": 5, "customer_id": 1, "status": "Completed", "total_amount": 999.00},
    {"id": 6, "customer_id": 2, "status": "Cancelled", "total_amount": 75.00},
    {"id": 7, "customer_id": 3, "status": "Completed", "total_amount": 650.00},
]

PRODUCTS_DATA = [
    {
        "name": "MacBook Air M2 256GB",
        "category_id": 1,
        "price": 999.00,
        "stock": 12,
        "sku": "MBA-M2-256",
        "description": "Apple MacBook Air with M2 chip, 256GB SSD storage.",
        "status": "Active"
    },
    {
        "name": "Dell XPS 13",
        "category_id": 1,
        "price": 1099.00,
        "stock": 8,
        "sku": "DELL-XPS-13",
        "description": "Dell XPS 13 inch ultrabook laptop.",
        "status": "Active"
    },
    {
        "name": "iPhone 15 Pro 256GB",
        "category_id": 2,
        "price": 1099.00,
        "stock": 20,
        "sku": "IPHONE-15P-256",
        "description": "Apple iPhone 15 Pro with titanium design.",
        "status": "Active"
    },
    {
        "name": "Samsung Galaxy S24",
        "category_id": 2,
        "price": 899.00,
        "stock": 15,
        "sku": "SAMSUNG-S24",
        "description": "Samsung Galaxy S24 featuring Galaxy AI.",
        "status": "Active"
    },
    {
        "name": "Sony WH-1000XM5",
        "category_id": 3,
        "price": 349.00,
        "stock": 3,
        "sku": "SONY-WH1000XM5",
        "description": "Noise canceling headphones.",
        "status": "Active"
    },
    {
        "name": "Apple AirPods Pro 2",
        "category_id": 3,
        "price": 249.00,
        "stock": 18,
        "sku": "AIRPODS-PRO-2",
        "description": "Wireless earbuds with active noise cancellation.",
        "status": "Active"
    },
    {
        "name": "Dell 24\" Monitor",
        "category_id": 4,
        "price": 149.00,
        "stock": 5,
        "sku": "DELL-24-MON",
        "description": "24-inch Full HD IPS monitor.",
        "status": "Active"
    },
    {
        "name": "LG UltraWide 34\" Monitor",
        "category_id": 4,
        "price": 449.00,
        "stock": 6,
        "sku": "LG-34-UW-MON",
        "description": "34-inch curved UltraWide QHD display.",
        "status": "Active"
    },
    {
        "name": "Logitech MX Master 3S",
        "category_id": 5,
        "price": 99.00,
        "stock": 25,
        "sku": "LOGI-MX3S",
        "description": "Wireless performance mouse.",
        "status": "Active"
    },
    {
        "name": "Logitech MX Keys Keyboard",
        "category_id": 5,
        "price": 109.00,
        "stock": 14,
        "sku": "LOGI-MX-KEYS",
        "description": "Advanced wireless illuminated keyboard.",
        "status": "Active"
    },
    {
        "name": "Anker USB-C 65W Charger",
        "category_id": 5,
        "price": 39.00,
        "stock": 30,
        "sku": "ANKER-65W-CHG",
        "description": "Fast compact GaN wall charger.",
        "status": "Active"
    },
    {
        "name": "Samsung T7 1TB SSD",
        "category_id": 6,
        "price": 119.00,
        "stock": 10,
        "sku": "SAMSUNG-T7-1TB",
        "description": "Portable solid state drive.",
        "status": "Active"
    },
    {
        "name": "TP-Link Wi-Fi 6 Router",
        "category_id": 7,
        "price": 129.00,
        "stock": 0,
        "sku": "TPLINK-AX-WIFI6",
        "description": "Wi-Fi 6 gigabit router.",
        "status": "Active"
    }
]