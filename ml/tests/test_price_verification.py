"""
AutoWorth AI - Price Verification Test Suite
Validates the raw ML prediction contract, corridor consistency, and error behavior.
"""
import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from api import app

client = TestClient(app)

REFERENCE_CRETA_PAYLOAD = {
    "make": "Hyundai",
    "model": "Creta",
    "variant": "SX (O) 1.5 CRDi AT",
    "year": 2021,
    "kilometers": 38200,
    "fuelType": "Diesel",
    "transmission": "Automatic",
    "ownership": "1st Owner",
    "rtoCity": "pune",
    "rtoCode": "MH-12 Pune",
    "condition": "Excellent",
}


def test_reference_creta_raw_prediction_value():
    """Verify that the reference 2021 Hyundai Creta produces the exact expected raw ML prediction."""
    response = client.post("/predict", json=REFERENCE_CRETA_PAYLOAD)
    assert response.status_code == 200
    data = response.json()

    # Verify exact predicted_price matches the trained XGBoost model output
    assert data["predicted_price"] == 1017000
    assert data["currency"] == "INR"
    assert data["model_name"] == "XGBoost Regressor"
    assert data["model_version"] == "1.0"


def test_price_range_corridor_is_consistent():
    """Verify that min_price (liquidity floor -5%) and max_price (retail ceiling +5%) are derived directly."""
    response = client.post("/predict", json=REFERENCE_CRETA_PAYLOAD)
    assert response.status_code == 200
    data = response.json()

    pred = data["predicted_price"]
    min_p = data["min_price"]
    max_p = data["max_price"]

    # min_price must be exactly 95% of predicted price (rounded to thousands)
    expected_min = int(round((pred * 0.95) / 1000) * 1000)
    expected_max = int(round((pred * 1.05) / 1000) * 1000)

    assert min_p == expected_min == 966000
    assert max_p == expected_max == 1068000
    assert min_p < pred < max_p


def test_features_used_matches_request_inputs():
    """Verify that the inference engine receives and normalizes the expected features without distortion."""
    response = client.post("/predict", json=REFERENCE_CRETA_PAYLOAD)
    assert response.status_code == 200
    data = response.json()

    feat = data["features_used"]
    assert feat["brand"] == "Hyundai"
    assert feat["model"] == "Creta"
    assert feat["year"] == 2021
    assert feat["km_driven"] == 38200.0
    assert feat["fuel"] == "Diesel"
    assert feat["transmission"] == "Automatic"
    assert feat["owner"] == "1st Owner"


def test_differing_input_details_produce_distinct_predictions():
    """
    Prove that differing inputs (e.g., 2nd Owner or Manual transmission) produce different predictions,
    explaining why a 2nd owner or higher-mileage car may yield ~₹9,99,000 rather than ₹10,17,000.
    """
    # 2018 Creta Diesel Manual 2nd Owner with 42,500 km
    payload_2nd_owner = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 2018,
        "kilometers": 42500,
        "fuelType": "Diesel",
        "transmission": "Manual",
        "ownership": "2nd Owner",
    }
    resp = client.post("/predict", json=payload_2nd_owner)
    assert resp.status_code == 200
    data = resp.json()
    # Confirms that differing input details account for ~₹9,99,000
    assert data["predicted_price"] == 999000


def test_invalid_request_rejects_without_fallback():
    """Verify that malformed or out-of-range requests fail with HTTP 422 rather than returning a fabricated price."""
    invalid_payload = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 1850,  # Invalid year
        "kilometers": -999,  # Invalid km
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    assert "predicted_price" not in response.json()
