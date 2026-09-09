def test_get_non_existing_product(client):
    product_id=999

    response = client.get(
        f"/api/products/{product_id}"
    )

    print("Status code:", response.status_code)
    print("Response:", response.json())

    assert response.status_code == 404

    data = response.json()

    assert data["detail"] == "Product not found"