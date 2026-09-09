def test_create_product_missing_name(client):

    product_data = {
        "sku": "INVALID-NAME-001",
        "price": 100,
        "category_id": 1,
    }

    response = client.post(
        "/api/products/",
        json=product_data,
    )

    print("Status code:", response.status_code)
    print("Response:", response.json())

    assert response.status_code == 422


def test_create_product_negative_price(client):

    product_data = {
        "name": "Invalid Product",
        "sku": "INVALID-PRICE-001",
        "price": -100,
        "category_id": 1,
    }

    response = client.post(
        "/api/products/",
        json=product_data,
    )

    print("Status code:", response.status_code)
    print("Response:", response.json())

    assert response.status_code == 422


def test_create_product_duplicate_sku(client):

    product_data = {
        "name": "Duplicate SKU Product",
        "sku": "MBA-M2-256",
        "price": 500,
        "category_id": 1,
    }

    response = client.post(
        "/api/products/",
        json=product_data,
    )

    print("Status code:", response.status_code)
    print("Response:", response.json())

    assert response.status_code in [409, 422]

