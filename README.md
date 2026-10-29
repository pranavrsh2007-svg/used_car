# 🚗 AutoWorth AI — Used Car Price Predictor & Resale Valuation Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1+-eb4034.svg?logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python 3.13](https://img.shields.io/badge/Python-3.13+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Pytest-29%20Passed-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org)

**AutoWorth AI** is a modern, high-precision used car valuation platform tailored specifically for the Indian automotive resale market. It combines an **XGBoost Machine Learning pipeline** served via **FastAPI** with a clean, responsive **React 19 + TypeScript** interface.

---

## 📌 Project Overview

- **Authentic ML Valuation:** Estimates realistic resale prices based on historical Indian vehicle transaction data.
- **Three-Tier Price Corridor:** Automatically computes a **Fair Market Benchmark**, a **Dealer Liquidity Floor (-5%)**, and a **Direct Private Retail Ceiling (+5%)**.
- **Transparent Influence Breakdown:** Explains price influences such as low/high odometer telemetry, single ownership premium, active OEM warranty coverage, stamped service history, and metro road tax dynamics without double-counting.
- **Zero Privacy Friction:** No phone numbers, marketing leads, or forced sign-ups required.

---

## 🧠 Machine Learning Models & Evaluation

We trained and evaluated **6 distinct regression algorithms** on Indian used car market data (4,844 training samples, 1,038 held-out validation samples) using uniform cross-validated preprocessing.

### Model Comparison Summary

| Model | Val MAE (₹) | Val $R^2$ Score | Val RMSE (₹) | Val MdAPE (%) | Status / Verdict |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **XGBoost Regressor** | **₹79,437** | **0.8344** | **₹2,46,366** | **12.5%** | 🏆 **Selected Best Model** (lowest MAE & tightest spread) |
| **CatBoost Regressor** | ₹83,811 | 0.8522 | ₹2,32,793 | 13.7% | Strong categorical performance; close 2nd |
| **Random Forest** | ₹83,862 | 0.8298 | ₹2,49,751 | 11.8% | Robust ensemble; slightly higher validation MAE |
| **LightGBM Regressor** | ₹84,285 | 0.8277 | ₹2,51,331 | 12.1% | Fast leaf-wise boosting; balanced metrics |
| **Ridge Regression** | ₹1,20,940 | 0.7262 | ₹3,16,798 | 18.9% | Linear regularized baseline; underfits non-linear depreciation |
| **Dummy Regressor** | ₹2,93,052 | -0.0361 | ₹6,16,285 | 43.3% | Naive mean baseline for verification |

### Why XGBoost Regressor was Selected
- **Lowest Absolute Error:** Achieved the lowest Validation Mean Absolute Error (**₹79,437**), which is critical for realistic private and dealer transactions.
- **Median Accuracy:** 50% of predictions fall within **12.5%** of actual market value (`MdAPE = 12.5%`).
- **Compact Artifact:** Serialized pipeline (`best_model.joblib`) is under **500 KB**, enabling sub-15ms local inference and rapid cloud cold-starts.

---

## 🛠️ Feature Engineering Pipeline

The model utilizes **12 engineered features**:

### Categorical Features (6)
- `brand` — Normalized OEM manufacturer name (e.g., Hyundai, Maruti Suzuki, Tata, Toyota, Mahindra).
- `model` — Primary model token (e.g., Creta, Swift, Nexon, Innova).
- `fuel` — Fuel powertrain (Petrol, Diesel, CNG, EV, Hybrid).
- `transmission` — Gearbox mechanism (Manual, Automatic).
- `owner` — Registration titleholder order (1st Owner, 2nd Owner, 3rd+ Owner).
- `seller_type` — Listing channel (Individual, Dealer, Trustmark Dealer).

### Numerical Features (6)
- `car_age` — Calculated from manufacturing year relative to reference cycle (`2025 - year`).
- `km_driven` — Total odometer distance logged.
- `engine_cc` — Engine cubic capacity displacement.
- `max_power_bhp` — Peak brake horsepower output.
- `mileage_kmpl` — Fuel efficiency rating.
- `seats` — Passenger seating capacity.

---

## 🏗️ System Architecture

```
[ React + TypeScript Frontend (Port 3000) ]
                    │
                    │ JSON (spec payload) via Fetch API
                    ▼
[ FastAPI Inference Service (Port 8000) ]
                    │
                    ├── GET  /health          --> Liveness & model readiness check
                    ├── POST /predict         --> Single car resale price prediction
                    └── POST /predict/batch   --> Batch vehicle processing
                    │
                    ▼
[ Scikit-Learn Pipeline + XGBoost Regressor ]
                    │
                    ├── Preprocessing & Imputation (ml/src/preprocessing.py)
                    └── Pipeline Model Artifact (ml/models/best_model.joblib)
```

---

## 📂 Repository Structure

```
autoworth-ai/
├── ml/                                 # Python Machine Learning Backend
│   ├── api.py                          # FastAPI application & REST endpoints
│   ├── requirements.txt                # Python backend dependencies
│   ├── src/
│   │   ├── predict.py                  # CarPricePredictor singleton inference engine
│   │   ├── preprocessing.py            # Feature transformation & cleaning pipelines
│   │   ├── train.py                    # Multi-model training pipeline
│   │   └── evaluate.py                 # Cross-validation & evaluation metrics
│   ├── models/
│   │   ├── best_model.joblib           # Trained XGBoost pipeline artifact
│   │   └── model_metadata.json         # Evaluation benchmarks & metrics metadata
│   └── tests/
│       ├── test_api.py                 # FastAPI endpoint unit tests
│       ├── test_model.py               # ML inference & pipeline integrity tests
│       ├── test_preprocessing.py        # Data sanitization & scaling tests
│       ├── test_price_verification.py  # Contract consistency & corridor tests
│       └── verify_live_api.py          # End-to-end HTTP integration script
├── src/                                # React + TypeScript Frontend
│   ├── App.tsx                         # Core state management & client router
│   ├── pages/
│   │   ├── HomePage.tsx                # Landing page & quick benchmark preview
│   │   ├── ValuationFormPage.tsx       # 3-step intuitive vehicle specification wizard
│   │   ├── ValuationResultsPage.tsx    # Dossier view: fair value, channels, & breakdown
│   │   ├── HowItWorksPage.tsx          # Educational methodology explanation
│   │   └── ValuationFactorsPage.tsx    # Telemetry & regional indexing guide
│   ├── lib/
│   │   ├── mlPredictionService.ts      # REST client connecting to FastAPI backend
│   │   ├── valuationEngine.ts          # Vehicle catalog, cities, & formatters
│   │   └── priceFlowVerification.test.ts # Frontend live inference verification
│   └── types/
│       └── valuation.ts                # TypeScript domain models & interfaces
├── package.json                        # Frontend dependencies & scripts
├── vite.config.ts                      # Vite configuration
└── .gitignore                          # Clean repository ignore patterns
```

---

## 🚀 Quickstart Guide

### 1. Start the Machine Learning Backend

```bash
# Navigate to the repository
cd autoworth-ai

# (Optional) Activate your virtual environment
# python -m venv venv && source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python ML dependencies
pip install -r ml/requirements.txt

# Launch FastAPI server on http://127.0.0.1:8000
python -m uvicorn ml.api:app --host 127.0.0.1 --port 8000 --reload
```

Test health check:
```bash
curl http://127.0.0.1:8000/health
# Response: {"status":"healthy","model_loaded":true,"model_name":"XGBoost Regressor","model_version":"1.0"}
```

### 2. Start the React Frontend

In a second terminal window:

```bash
# Install Node dependencies
npm install

# Start Vite dev server on http://localhost:3000
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🧪 Testing & Verification

The project includes automated test coverage across both backend and frontend layers:

```bash
# 1. Run all Python unit and API tests (29 passing tests)
python -m pytest ml/tests/ -v

# 2. Run live frontend integration & corridor verification
npx tsx src/lib/priceFlowVerification.test.ts

# 3. Type check the TypeScript frontend
npm run lint

# 4. Validate production bundle build
npm run build
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
