"""
AutoWorth AI - Unified Predictor Module
Provides resilient vehicle valuation inference using the trained ML pipeline.
"""
import os
import json
import logging
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib

from preprocessing import (
    REFERENCE_YEAR,
    clean_brand_name,
    clean_fuel_type,
    clean_transmission,
    clean_owner_title,
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Catalog fallback estimates for engine displacement and power by segment/brand
DEFAULT_CATALOG_DEFAULTS = {
    "engine_cc": 1498.0,
    "max_power_bhp": 105.0,
    "mileage_kmpl": 18.5,
    "seats": 5.0,
}


class CarPricePredictor:
    """Singleton-style predictor that loads model artifacts once into memory."""
    _instance: Optional["CarPricePredictor"] = None

    def __init__(self, model_path: str = "ml/models/best_model.joblib", metadata_path: str = "ml/models/model_metadata.json"):
        self.model_path = model_path
        self.metadata_path = metadata_path
        self.pipeline = None
        self.metadata = {}
        self.load_artifacts()

    @classmethod
    def get_instance(cls, model_path: str = "ml/models/best_model.joblib", metadata_path: str = "ml/models/model_metadata.json") -> "CarPricePredictor":
        if cls._instance is None:
            cls._instance = cls(model_path, metadata_path)
        return cls._instance

    def load_artifacts(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
        logger.info(f"Loading ML pipeline from {self.model_path}...")
        self.pipeline = joblib.load(self.model_path)

        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {"best_model_name": "Trained ML Model", "model_version": "1.0"}
        logger.info(f"Loaded model: {self.metadata.get('best_model_name', 'Unknown')}")

    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def predict(self, car_spec: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts vehicle specifications dictionary and returns predicted price corridor.
        Validates ranges and normalizes features to match training schema.
        """
        if not self.is_loaded():
            raise RuntimeError("Model pipeline is not loaded.")

        # 1. Extract and sanitize make/brand & model
        raw_make = str(car_spec.get("make") or car_spec.get("brand") or "Hyundai").strip()
        brand = clean_brand_name(raw_make)
        
        raw_model = str(car_spec.get("model") or "Other").strip()
        model_token = raw_model.split()[0] if raw_model else "Other"

        # 2. Year & Age
        raw_year = car_spec.get("year", 2021)
        try:
            year = int(raw_year)
        except (ValueError, TypeError) as e:
            raise ValueError(f"Invalid manufacturing year: {raw_year}") from e

        if year < 1990 or year > (REFERENCE_YEAR + 1):
            raise ValueError(f"Year {year} is out of realistic automotive range (1990 - {REFERENCE_YEAR + 1}).")

        car_age = max(0.5, float(REFERENCE_YEAR - year))

        # 3. Kilometers driven
        raw_km = car_spec.get("kilometers", car_spec.get("km_driven", 40000))
        try:
            km_driven = float(raw_km)
        except (ValueError, TypeError) as e:
            raise ValueError(f"Invalid kilometers value: {raw_km}") from e

        if km_driven < 0:
            raise ValueError("Kilometers driven cannot be negative.")
        if km_driven > 1000000:
            raise ValueError(f"Kilometers {km_driven:,} exceeds 1,000,000 km threshold.")

        # 4. Fuel & Transmission & Ownership
        fuel = clean_fuel_type(car_spec.get("fuelType") or car_spec.get("fuel") or "Petrol")
        transmission = clean_transmission(car_spec.get("transmission") or "Manual")
        owner = clean_owner_title(car_spec.get("ownership") or car_spec.get("owner") or "1st Owner")
        seller_type = str(car_spec.get("seller_type") or "Individual").strip()

        # 5. Technical specs (engine, power, mileage, seats)
        engine_cc = float(car_spec.get("engine_cc") or car_spec.get("engine") or DEFAULT_CATALOG_DEFAULTS["engine_cc"])
        max_power_bhp = float(car_spec.get("max_power_bhp") or car_spec.get("max_power") or DEFAULT_CATALOG_DEFAULTS["max_power_bhp"])
        mileage_kmpl = float(car_spec.get("mileage_kmpl") or car_spec.get("mileage") or DEFAULT_CATALOG_DEFAULTS["mileage_kmpl"])
        seats = float(car_spec.get("seats") or DEFAULT_CATALOG_DEFAULTS["seats"])

        # 6. Assemble single-row DataFrame matching training features
        row_dict = {
            "brand": brand,
            "model": model_token,
            "fuel": fuel,
            "transmission": transmission,
            "owner": owner,
            "seller_type": seller_type,
            "car_age": car_age,
            "km_driven": km_driven,
            "engine_cc": engine_cc,
            "max_power_bhp": max_power_bhp,
            "mileage_kmpl": mileage_kmpl,
            "seats": seats,
        }

        input_df = pd.DataFrame([row_dict])

        # 7. Model Inference
        raw_pred = float(self.pipeline.predict(input_df)[0])

        # Ensure realistic pricing bounds (minimum scrap/liquidity floor of ₹20,000)
        predicted_price = int(max(20000, round(raw_pred / 1000) * 1000))

        # Liquidity spreads (Dealer liquidation floor -5%, Direct consumer retail +5%)
        min_price = int(round((predicted_price * 0.95) / 1000) * 1000)
        max_price = int(round((predicted_price * 1.05) / 1000) * 1000)

        # Confidence metric derived from validation metrics
        val_r2 = self.metadata.get("best_model_val_metrics", {}).get("r2_score", 0.90)
        confidence_percent = round(min(98.5, max(85.0, val_r2 * 100)), 1)

        return {
            "predicted_price": predicted_price,
            "min_price": min_price,
            "max_price": max_price,
            "currency": "INR",
            "model_version": self.metadata.get("model_version", "1.0"),
            "model_name": self.metadata.get("best_model_name", "AutoWorth Ensemble"),
            "confidence_score": confidence_percent,
            "features_used": {
                "brand": brand,
                "model": model_token,
                "year": year,
                "car_age": car_age,
                "km_driven": km_driven,
                "fuel": fuel,
                "transmission": transmission,
                "owner": owner,
            },
        }


if __name__ == "__main__":
    predictor = CarPricePredictor()
    sample = {
        "make": "Hyundai",
        "model": "Creta",
        "year": 2021,
        "kilometers": 38000,
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "ownership": "1st Owner",
    }
    result = predictor.predict(sample)
    print("Sample Prediction:\n", json.dumps(result, indent=2))
