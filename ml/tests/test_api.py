"""
Automated tests for FastAPI endpoints (GET /health and POST /predict).
"""
import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from api import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert "model_name" in data
    assert "model_version" in data
    assert data["uptime_seconds"] >= 0


def test_predict_endpoint_valid_payload():
    payload = {
        "make": "Hyundai",
        "model": "Creta",
        "variant": "SX (O) 1.5 CRDi AT",
        "year": 2021,
        "kilometers": 38000,
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "ownership": "1st Owner",
        "rtoCity": "pune",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], int)
    assert data["predicted_price"] > 100000
    assert data["currency"] == "INR"
    assert data["model_version"] == "1.0"
    assert "min_price" in data
    assert "max_price" in data
    assert data["min_price"] < data["predicted_price"] < data["max_price"]
    assert "confidence_score" in data


def test_predict_endpoint_snake_case_payload():
    payload = {
        "make": "Maruti",
        "model": "Swift",
        "year": 2018,
        "kilometers": 42000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "ownership": "1st Owner",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_price"] > 50000
    assert data["currency"] == "INR"


def test_predict_endpoint_negative_kilometers():
    payload = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 2021,
        "kilometers": -500,
        "fuelType": "Diesel",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "Validation Error" in data.get("error", "")


def test_predict_endpoint_future_year():
    payload = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 2035,
        "kilometers": 20000,
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_endpoint_missing_required_fields():
    payload = {
        "make": "Hyundai",
        # missing model, year, kilometers
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_cors_preflight():
    # 1. Localhost origin
    resp_local = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert resp_local.status_code == 200
    assert resp_local.headers.get("access-control-allow-origin") == "http://localhost:3000"

    # 2. Production Vercel origin
    resp_vercel = client.options(
        "/predict",
        headers={
            "Origin": "https://used-car-seven.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert resp_vercel.status_code == 200
    assert resp_vercel.headers.get("access-control-allow-origin") == "https://used-car-seven.vercel.app"

    # 3. Vercel preview branch deployment
    resp_preview = client.options(
        "/predict",
        headers={
            "Origin": "https://used-car-pranavrsh2007-preview.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert resp_preview.status_code == 200
    assert resp_preview.headers.get("access-control-allow-origin") == "https://used-car-pranavrsh2007-preview.vercel.app"

    # 4. Actual POST request returns access-control-allow-origin
    post_resp = client.post(
        "/predict",
        json={
            "make": "Hyundai",
            "model": "Creta",
            "year": 2021,
            "kilometers": 38000,
            "fuelType": "Diesel",
            "transmission": "Automatic",
            "ownership": "1st Owner",
        },
        headers={"Origin": "https://used-car-seven.vercel.app"},
    )
    assert post_resp.status_code == 200
    assert post_resp.headers.get("access-control-allow-origin") == "https://used-car-seven.vercel.app"


def test_predict_endpoint_negative_or_extreme_year():
    # Negative year
    resp1 = client.post("/predict", json={"make": "Tata", "model": "Nexon", "year": -2019, "kilometers": 20000})
    assert resp1.status_code == 422

    # Ancient year (<1990)
    resp2 = client.post("/predict", json={"make": "Tata", "model": "Nexon", "year": 1970, "kilometers": 20000})
    assert resp2.status_code == 422


def test_predict_endpoint_unsupported_categorical_values():
    # Unsupported fuel type and ownership should be safely sanitized rather than crashing
    payload = {
        "make": "Toyota",
        "model": "Innova",
        "year": 2016,
        "kilometers": 85000,
        "fuelType": "Hydrogen_Rocket_Fuel",
        "transmission": "Semi-Automatic",
        "ownership": "Royal Fleet Owner",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_price"] > 50000
    assert data["currency"] == "INR"


def test_multiple_realistic_vehicle_fixtures():
    fixtures = [
        {"make": "Honda", "model": "City", "year": 2017, "kilometers": 52000, "fuelType": "Petrol", "transmission": "Manual"},
        {"make": "Toyota", "model": "Innova", "year": 2015, "kilometers": 110000, "fuelType": "Diesel", "transmission": "Manual"},
        {"make": "Tata", "model": "Nexon", "year": 2022, "kilometers": 24000, "fuelType": "Petrol", "transmission": "Automatic"},
    ]
    for car in fixtures:
        response = client.post("/predict", json=car)
        assert response.status_code == 200
        data = response.json()
        assert data["predicted_price"] >= 50000
        assert data["currency"] == "INR"
        assert data["min_price"] < data["predicted_price"] < data["max_price"]


def test_predict_batch_endpoint():
    batch = [
        {"make": "Maruti", "model": "Swift", "year": 2019, "kilometers": 35000, "fuelType": "Petrol", "transmission": "Manual"},
        {"make": "Hyundai", "model": "Creta", "year": 2021, "kilometers": 40000, "fuelType": "Diesel", "transmission": "Automatic"},
    ]
    response = client.post("/predict/batch", json=batch)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    for item in data:
        assert "predicted_price" in item
        assert item["predicted_price"] > 50000
        assert item["currency"] == "INR"


