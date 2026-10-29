"""
AutoWorth AI - Data Preprocessing Pipeline
Cleans, normalizes, and prepares CarDekho vehicle data for training and inference.
"""
import os
import re
import logging
from typing import Tuple, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import joblib

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

REFERENCE_YEAR = 2025

# Normalized mapping for known brands
BRAND_NORMALIZATION = {
    "maruti suzuki": "Maruti",
    "maruti": "Maruti",
    "hyundai": "Hyundai",
    "tata": "Tata",
    "mahindra": "Mahindra",
    "honda": "Honda",
    "toyota": "Toyota",
    "kia": "Kia",
    "ford": "Ford",
    "volkswagen": "Volkswagen",
    "renault": "Renault",
    "skoda": "Skoda",
    "nissan": "Nissan",
    "mg": "MG",
    "bmw": "BMW",
    "mercedes-benz": "Mercedes-Benz",
    "mercedes": "Mercedes-Benz",
    "audi": "Audi",
    "volvo": "Volvo",
    "jeep": "Jeep",
}

# Categorical and numerical column definitions
CATEGORICAL_FEATURES = ["brand", "model", "fuel", "transmission", "owner", "seller_type"]
NUMERICAL_FEATURES = ["car_age", "km_driven", "engine_cc", "max_power_bhp", "mileage_kmpl", "seats"]
TARGET_COLUMN = "selling_price"


def extract_numeric(val: Any) -> Optional[float]:
    """Extract first floating-point or integer number from mixed string representation."""
    if pd.isna(val) or val is None:
        return None
    match = re.search(r"([\d\.]+)", str(val).strip())
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return None
    return None


def clean_brand_name(brand_str: str) -> str:
    """Standardize brand casing and known aliases."""
    if not brand_str or pd.isna(brand_str):
        return "Other"
    clean = str(brand_str).strip()
    clean_lower = clean.lower()
    return BRAND_NORMALIZATION.get(clean_lower, clean.title())


def clean_owner_title(owner_str: str) -> str:
    """Normalize ownership designations to match standard categories."""
    if not owner_str or pd.isna(owner_str):
        return "1st Owner"
    s = str(owner_str).strip().lower()
    if "first" in s or "1st" in s or s == "0" or s == "1":
        return "1st Owner"
    elif "second" in s or "2nd" in s or s == "2":
        return "2nd Owner"
    elif "third" in s or "3rd" in s or "fourth" in s or "above" in s or "3+" in s or s in ["3", "4"]:
        return "3rd+ Owner"
    elif "test" in s:
        return "Test Drive Car"
    return "1st Owner"


def clean_fuel_type(fuel_str: str) -> str:
    """Normalize fuel type."""
    if not fuel_str or pd.isna(fuel_str):
        return "Petrol"
    f_upper = str(fuel_str).strip().upper()
    if f_upper in ["CNG", "LPG"]:
        return f_upper
    if f_upper in ["EV", "ELECTRIC"]:
        return "Electric"
    f_cap = str(fuel_str).strip().capitalize()
    if f_cap in ["Petrol", "Diesel"]:
        return f_cap
    return "Petrol"


def clean_transmission(trans_str: str) -> str:
    """Normalize transmission type."""
    if not trans_str or pd.isna(trans_str):
        return "Manual"
    t = str(trans_str).strip().capitalize()
    return "Automatic" if "auto" in t.lower() else "Manual"


def load_raw_dataset(csv_path: str = "ml/data/raw/Car details v3.csv") -> pd.DataFrame:
    """Load raw CSV dataset with integrity checks."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Raw dataset file not found at: {csv_path}")
    logger.info(f"Loading raw dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded raw records: {len(df):,} rows, {len(df.columns)} columns")
    return df


def clean_dataset(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw CarDekho records:
    - Normalizes column names
    - Extracts brand, model, car age, numeric engine/power/mileage
    - Drops duplicates
    - Removes corrupted odometer/price entries while preserving legitimate luxury vehicles
    """
    df = df_raw.copy()
    
    # 1. Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    # 2. Extract brand and model
    if "name" in df.columns:
        df["brand"] = df["name"].apply(lambda x: clean_brand_name(str(x).split()[0] if str(x).split() else "Other"))
        df["model"] = df["name"].apply(lambda x: str(x).split()[1] if len(str(x).split()) > 1 else "Other")
    else:
        if "brand" not in df.columns and "make" in df.columns:
            df["brand"] = df["make"].apply(clean_brand_name)
        if "model" not in df.columns:
            df["model"] = "Other"

    # 3. Calculate car age with fixed reference year
    if "year" in df.columns:
        df["car_age"] = df["year"].apply(lambda y: max(0.5, REFERENCE_YEAR - float(y)))
    else:
        df["car_age"] = 4.0

    # 4. Standardize numeric columns
    if "km_driven" in df.columns:
        df["km_driven"] = pd.to_numeric(df["km_driven"], errors="coerce")
    elif "kms_driven" in df.columns:
        df["km_driven"] = pd.to_numeric(df["kms_driven"], errors="coerce")
    else:
        df["km_driven"] = 40000.0

    # 5. Parse engine, max_power, mileage, seats if present
    df["engine_cc"] = df["engine"].apply(extract_numeric) if "engine" in df.columns else np.nan
    df["max_power_bhp"] = df["max_power"].apply(extract_numeric) if "max_power" in df.columns else np.nan
    df["mileage_kmpl"] = df["mileage"].apply(extract_numeric) if "mileage" in df.columns else np.nan
    df["seats"] = pd.to_numeric(df["seats"], errors="coerce") if "seats" in df.columns else np.nan

    # 6. Standardize categorical features
    df["fuel"] = df["fuel"].apply(clean_fuel_type) if "fuel" in df.columns else "Petrol"
    df["transmission"] = df["transmission"].apply(clean_transmission) if "transmission" in df.columns else "Manual"
    df["owner"] = df["owner"].apply(clean_owner_title) if "owner" in df.columns else "1st Owner"
    if "seller_type" in df.columns:
        df["seller_type"] = df["seller_type"].fillna("Individual").astype(str).str.strip()
    else:
        df["seller_type"] = "Individual"

    # 7. Deduplicate records
    initial_count = len(df)
    df = df.drop_duplicates()
    logger.info(f"Removed {initial_count - len(df):,} duplicate records. Remaining: {len(df):,}")

    # 8. Filter corrupted outliers without deleting genuine high-end cars
    # Valid price range: >= 20,000 INR and <= 20,000,000 INR (2 Crore)
    # Valid km range: 100 to 500,000 km (filters 2.36 million km data entry typos)
    valid_mask = (
        (df[TARGET_COLUMN] >= 20000) &
        (df[TARGET_COLUMN] <= 20000000) &
        (df["km_driven"] >= 100) &
        (df["km_driven"] <= 500000) &
        (df["car_age"] >= 0.5) &
        (df["car_age"] <= 35)
    )
    df = df[valid_mask].reset_index(drop=True)
    logger.info(f"Cleaned valid dataset: {len(df):,} records")
    return df


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs an scikit-learn ColumnTransformer.
    - Numerical features: Median Imputation + Optional Standard Scaling
    - Categorical features: Constant Imputation + One-Hot Encoding (handle_unknown='ignore')
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="constant", fill_value="Other")),
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )
    return preprocessor


def prepare_and_split_data(
    raw_path: str = "ml/data/raw/Car details v3.csv",
    output_dir: str = "ml/data/processed",
    test_size: float = 0.15,
    val_size: float = 0.15,
    random_state: int = 42,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Loads raw data, cleans it, splits into Train / Validation / Test sets,
    and persists processed data artifacts.
    """
    os.makedirs(output_dir, exist_ok=True)
    df_raw = load_raw_dataset(raw_path)
    df_clean = clean_dataset(df_raw)

    # All required features + target
    cols_to_keep = CATEGORICAL_FEATURES + NUMERICAL_FEATURES + [TARGET_COLUMN]
    df_final = df_clean[cols_to_keep].copy()

    # Split: Train (70%), Val (15%), Test (15%)
    # First split off test set (15%)
    train_val_df, test_df = train_test_split(
        df_final,
        test_size=test_size,
        random_state=random_state,
        shuffle=True,
    )

    # Next split train and val from train_val_df
    # val_size / (1 - test_size) = 0.15 / 0.85 approx 0.1765
    relative_val_size = val_size / (1.0 - test_size)
    train_df, val_df = train_test_split(
        train_val_df,
        test_size=relative_val_size,
        random_state=random_state,
        shuffle=True,
    )

    # Save processed splits
    train_df.to_csv(os.path.join(output_dir, "train.csv"), index=False)
    val_df.to_csv(os.path.join(output_dir, "val.csv"), index=False)
    test_df.to_csv(os.path.join(output_dir, "test.csv"), index=False)

    logger.info(
        f"Data split completed: Train={len(train_df):,} ({(len(train_df)/len(df_final))*100:.1f}%), "
        f"Val={len(val_df):,} ({(len(val_df)/len(df_final))*100:.1f}%), "
        f"Test={len(test_df):,} ({(len(test_df)/len(df_final))*100:.1f}%)"
    )

    return train_df, val_df, test_df


if __name__ == "__main__":
    prepare_and_split_data()
