"""
Unit tests for data preprocessing module.
"""
import sys
import os
import pandas as pd
import numpy as np
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from preprocessing import (
    clean_brand_name,
    clean_fuel_type,
    clean_transmission,
    clean_owner_title,
    extract_numeric,
    clean_dataset,
    build_preprocessor,
    TARGET_COLUMN,
)


def test_clean_brand_name():
    assert clean_brand_name("maruti suzuki") == "Maruti"
    assert clean_brand_name("Maruti") == "Maruti"
    assert clean_brand_name("hyundai") == "Hyundai"
    assert clean_brand_name("mercedes-benz") == "Mercedes-Benz"
    assert clean_brand_name("tata") == "Tata"
    assert clean_brand_name("") == "Other"
    assert clean_brand_name(None) == "Other"


def test_clean_fuel_type():
    assert clean_fuel_type("Petrol") == "Petrol"
    assert clean_fuel_type("diesel") == "Diesel"
    assert clean_fuel_type("cng") == "CNG"
    assert clean_fuel_type("lpg") == "LPG"
    assert clean_fuel_type(None) == "Petrol"


def test_clean_transmission():
    assert clean_transmission("Manual") == "Manual"
    assert clean_transmission("automatic") == "Automatic"
    assert clean_transmission("Auto") == "Automatic"
    assert clean_transmission(None) == "Manual"


def test_clean_owner_title():
    assert clean_owner_title("First Owner") == "1st Owner"
    assert clean_owner_title("1st Owner") == "1st Owner"
    assert clean_owner_title("Second Owner") == "2nd Owner"
    assert clean_owner_title("Third Owner") == "3rd+ Owner"
    assert clean_owner_title("Fourth & Above Owner") == "3rd+ Owner"
    assert clean_owner_title("Test Drive Car") == "Test Drive Car"


def test_extract_numeric():
    assert extract_numeric("23.4 kmpl") == 23.4
    assert extract_numeric("1248 CC") == 1248.0
    assert extract_numeric("74 bhp") == 74.0
    assert extract_numeric(1500) == 1500.0
    assert extract_numeric(None) is None
    assert extract_numeric("") is None


def test_cleaning_pipeline_removes_invalid_odometer_and_duplicates():
    raw_sample = pd.DataFrame([
        # Valid car 1
        {"name": "Maruti Swift VDI", "year": 2018, "selling_price": 450000, "km_driven": 45000, "fuel": "Diesel", "transmission": "Manual", "owner": "First Owner", "seller_type": "Individual"},
        # Duplicate of car 1
        {"name": "Maruti Swift VDI", "year": 2018, "selling_price": 450000, "km_driven": 45000, "fuel": "Diesel", "transmission": "Manual", "owner": "First Owner", "seller_type": "Individual"},
        # Invalid odometer typo (2.5 million km)
        {"name": "Hyundai i20", "year": 2015, "selling_price": 350000, "km_driven": 2500000, "fuel": "Petrol", "transmission": "Manual", "owner": "First Owner", "seller_type": "Individual"},
        # Zero selling price
        {"name": "Honda City", "year": 2016, "selling_price": 0, "km_driven": 30000, "fuel": "Petrol", "transmission": "Manual", "owner": "First Owner", "seller_type": "Individual"},
        # Valid luxury car (should NOT be removed)
        {"name": "BMW X5 xDrive30d", "year": 2019, "selling_price": 6500000, "km_driven": 22000, "fuel": "Diesel", "transmission": "Automatic", "owner": "First Owner", "seller_type": "Dealer"},
    ])

    cleaned = clean_dataset(raw_sample)
    # Should drop duplicate, drop 2.5m km, drop 0 price, but KEEP the BMW luxury car
    assert len(cleaned) == 2
    assert "BMW" in cleaned["brand"].values
    assert "Maruti" in cleaned["brand"].values


def test_preprocessor_transformation():
    preprocessor = build_preprocessor()
    sample = pd.DataFrame([{
        "brand": "Hyundai",
        "model": "Creta",
        "fuel": "Diesel",
        "transmission": "Automatic",
        "owner": "1st Owner",
        "seller_type": "Individual",
        "car_age": 4.0,
        "km_driven": 38000.0,
        "engine_cc": 1493.0,
        "max_power_bhp": 113.4,
        "mileage_kmpl": 18.0,
        "seats": 5.0,
    }])
    transformed = preprocessor.fit_transform(sample)
    assert transformed is not None
    assert transformed.shape[0] == 1
    assert not np.isnan(transformed).any()
