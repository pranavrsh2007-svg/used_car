# AutoWorth AI - Machine Learning Pipeline & API

This directory contains the end-to-end Machine Learning pipeline and FastAPI inference service for predicting used car resale prices in the Indian automotive market.

## Architecture

```
ml/
├── api.py                   # FastAPI service (GET /health, POST /predict)
├── requirements.txt         # Pinned Python dependencies
├── README.md                # Architecture & operation guide
├── data/
│   ├── raw/                 # Downloaded Kaggle CarDekho datasets (ignored in git)
│   └── processed/           # 70/15/15 train, validation, and holdout test splits
├── models/
│   ├── best_model.joblib    # Serialized scikit-learn + XGBoost ColumnTransformer pipeline
│   └── model_metadata.json  # Feature specifications, versioning, and validation metrics
├── reports/
│   ├── model_comparison.csv # Comparative benchmark table across 6 regressors
│   ├── test_evaluation.json # Final evaluation metrics on holdout test set
│   ├── actual_vs_predicted.png # Diagnostic correlation plot
│   ├── residuals.png        # Residual error distribution & scatter
│   └── feature_importance.png # Top feature importance visualization
├── src/
│   ├── __init__.py
│   ├── preprocessing.py     # Data cleaning, unit parsing, outlier filtering, ColumnTransformer
│   ├── train.py             # Benchmark comparison across Dummy, Ridge, RF, XGB, LGBM, CatBoost
│   ├── evaluate.py          # Test split validation and tier-wise price breakdown
│   ├── predict.py           # Unified inference class with input validation
│   └── download_data.py     # Verified CarDekho dataset downloader
└── tests/
    ├── test_preprocessing.py # Preprocessing & data integrity tests
    ├── test_model.py         # Pipeline invariance, out-of-distribution, & price boundary tests
    └── test_api.py           # FastAPI GET /health, POST /predict, CORS & validation tests
```

## Model Benchmark Summary

Evaluated on 6,921 clean records from the authentic CarDekho dataset (70% train, 15% validation, 15% holdout test):

| Algorithm | Validation R² | Validation MAE (INR) | Validation RMSE (INR) | Validation MAPE |
| :--- | :--- | :--- | :--- | :--- |
| **Dummy Baseline** | -0.0361 | ₹2,93,052 | ₹6,16,286 | 87.79% |
| **Ridge Regression** | 0.7262 | ₹1,20,941 | ₹3,16,799 | 30.25% |
| **LightGBM** | 0.8277 | ₹84,285 | ₹2,51,332 | 18.69% |
| **Random Forest** | 0.8298 | ₹83,863 | ₹2,49,751 | 17.85% |
| **CatBoost** | 0.8522 | ₹83,811 | ₹2,32,793 | 19.71% |
| **XGBoost (Selected)** | **0.8344** | **₹79,437** | **₹2,46,367** | **17.89%** |

### Holdout Test Set Performance (1,039 unseen samples)
- **R² Score**: `0.9101`
- **Mean Absolute Error (MAE)**: `₹82,276.81`
- **Root Mean Squared Error (RMSE)**: `₹1,77,890.98`
- **Mean Absolute Percentage Error (MAPE)**: `17.12%`
- **Median Absolute Percentage Error (MdAPE)**: `12.10%`

## Local Setup & Quickstart

### 1. Install Dependencies
```bash
python -m pip install -r ml/requirements.txt
```

### 2. Download Datasets & Train Pipeline (Optional - Pre-trained Artifacts Included)
```bash
python ml/src/download_data.py
python ml/src/preprocessing.py
python ml/src/train.py
python ml/src/evaluate.py
```

### 3. Run Automated Tests
```bash
python -m pytest ml/tests/ -v
```

### 4. Start the Prediction API
```bash
python ml/api.py
# Or with uvicorn directly:
uvicorn ml.api:app --host 0.0.0.0 --port 8000 --reload
```

- API Base: `http://localhost:8000`
- Health Endpoint: `http://localhost:8000/health`
- Swagger UI Documentation: `http://localhost:8000/docs`

## API Schema

### `POST /predict` Request Example
```json
{
  "make": "Hyundai",
  "model": "Creta",
  "variant": "SX (O) 1.5 CRDi AT",
  "year": 2021,
  "kilometers": 38000,
  "fuelType": "Diesel",
  "transmission": "Automatic",
  "ownership": "1st Owner"
}
```

### Response Example
```json
{
  "predicted_price": 1017000,
  "min_price": 966000,
  "max_price": 1068000,
  "currency": "INR",
  "model_version": "1.0",
  "model_name": "XGBoost Regressor",
  "confidence_score": 85.0,
  "features_used": {
    "brand": "Hyundai",
    "model": "Creta",
    "year": 2021,
    "car_age": 4.0,
    "km_driven": 38000.0,
    "fuel": "Diesel",
    "transmission": "Automatic",
    "owner": "1st Owner"
  }
}
```
