def test_get_product_by_id(client):
    
    product_id = 2

    response = client.get(
        f"/api/products/{product_id}"
    )

    print("Status code:", response.status_code)
    print("Response:", response.json())

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 2
    assert data["name"] == "Dell XPS 13"
    assert data["sku"] == "DELL-XPS-13"
    assert data["price"] == 1099
    assert data["category_id"] == 1