"""
Unit tests for model loading and prediction inference.
"""
import sys
import os
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from predict import CarPricePredictor


@pytest.fixture(scope="module")
def predictor():
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "best_model.joblib"))
    metadata_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "model_metadata.json"))
    return CarPricePredictor(model_path=model_path, metadata_path=metadata_path)


def test_predictor_loaded(predictor):
    assert predictor.is_loaded() is True
    assert predictor.pipeline is not None


def test_valid_prediction(predictor):
    spec = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 2021,
        "kilometers": 38000,
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "ownership": "1st Owner",
    }
    result = predictor.predict(spec)

    assert "predicted_price" in result
    assert isinstance(result["predicted_price"], int)
    assert result["predicted_price"] > 100000
    assert np.isfinite(result["predicted_price"])
    assert result["currency"] == "INR"
    assert result["min_price"] < result["predicted_price"] < result["max_price"]
    assert "model_version" in result
    assert "confidence_score" in result


def test_older_economy_car_prediction(predictor):
    spec = {
        "make": "Maruti",
        "model": "Alto",
        "year": 2012,
        "kilometers": 95000,
        "fuelType": "Petrol",
        "transmission": "Manual",
        "ownership": "2nd Owner",
    }
    result = predictor.predict(spec)
    assert result["predicted_price"] >= 20000
    assert result["predicted_price"] < 400000
    assert np.isfinite(result["predicted_price"])


def test_unseen_or_rare_brand_handling(predictor):
    # Model should gracefully handle unknown brands without raising exceptions
    spec = {
        "make": "Bugatti",
        "model": "Veyron",
        "year": 2019,
        "kilometers": 15000,
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "ownership": "1st Owner",
    }
    result = predictor.predict(spec)
    assert result["predicted_price"] > 20000
    assert np.isfinite(result["predicted_price"])


def test_invalid_negative_kilometers(predictor):
    spec = {
        "make": "Hyundai",
        "model": "i20",
        "year": 2020,
        "kilometers": -5000,
        "fuelType": "Petrol",
        "transmission": "Manual",
        "ownership": "1st Owner",
    }
    with pytest.raises(ValueError, match="cannot be negative"):
        predictor.predict(spec)


def test_invalid_future_year(predictor):
    spec = {
        "make": "Honda",
        "model": "City",
        "year": 2035,
        "kilometers": 10000,
        "fuelType": "Petrol",
        "transmission": "Manual",
        "ownership": "1st Owner",
    }
    with pytest.raises(ValueError, match="out of realistic automotive range"):
        predictor.predict(spec)
