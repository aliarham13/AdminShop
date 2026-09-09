def test_delete_product(client):
    print("DELETE TEST FUNCTION RUNNING")

    product_id = 12

    response = client.delete(f"/api/products/{product_id}")

    print("DELETE RESPONSE:", response.status_code)
    print("DELETE BODY:", response.json())

    assert response.status_code == 200

    response = client.get(f"/api/products/{product_id}")
    assert response.status_code == 404