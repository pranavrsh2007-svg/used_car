"""
AutoWorth AI - Prediction Service API
FastAPI backend providing real-time ML-powered used car resale valuation.
"""
import os
import sys
import time
import logging
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, ConfigDict

# Ensure ml/src is importable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(CURRENT_DIR, "src")
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from predict import CarPricePredictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

APP_START_TIME = time.time()


# ============================================================================
# Pydantic Schemas
# ============================================================================

class CarPredictionRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    make: str = Field(..., min_length=1, max_length=60, description="Car manufacturer/brand", examples=["Hyundai"])
    model: str = Field(..., min_length=1, max_length=60, description="Vehicle model name", examples=["Creta"])
    year: int = Field(..., ge=1990, le=2026, description="Manufacturing year (1990-2026)", examples=[2021])
    kilometers: float = Field(..., ge=0, le=1000000, description="Total kilometers driven", examples=[38000.0])
    fuel_type: str = Field(default="Petrol", alias="fuelType", description="Fuel category (Petrol, Diesel, CNG, EV, Hybrid)", examples=["Diesel"])
    transmission: str = Field(default="Manual", description="Transmission type (Manual, Automatic)", examples=["Automatic"])
    ownership: str = Field(default="1st Owner", description="Ownership designation (1st Owner, 2nd Owner, 3rd+ Owner)", examples=["1st Owner"])
    
    # Optional metadata from frontend form
    variant: Optional[str] = Field(default=None, description="Model variant", examples=["SX (O) 1.5 CRDi AT"])
    rto_city: Optional[str] = Field(default=None, alias="rtoCity", description="Registration city cluster", examples=["pune"])
    rto_code: Optional[str] = Field(default=None, alias="rtoCode", description="RTO code", examples=["MH-12 Pune"])
    condition: Optional[str] = Field(default="Excellent", description="Physical condition grade", examples=["Excellent"])

    # Optional engine / technical specifications if known
    engine_cc: Optional[float] = Field(default=None, alias="engineCc", ge=500, le=8000)
    max_power_bhp: Optional[float] = Field(default=None, alias="maxPowerBhp", ge=20, le=1200)
    mileage_kmpl: Optional[float] = Field(default=None, alias="mileageKmpl", ge=5, le=50)
    seats: Optional[float] = Field(default=None, ge=2, le=14)


class CarPredictionResponse(BaseModel):
    predicted_price: int = Field(..., description="Estimated fair market resale price in INR", examples=[1017000])
    min_price: int = Field(..., description="Estimated dealer liquidity floor price in INR", examples=[966000])
    max_price: int = Field(..., description="Estimated direct consumer retail ceiling in INR", examples=[1068000])
    currency: str = Field(default="INR", description="Currency ISO code")
    model_version: str = Field(default="1.0", description="ML model release version")
    model_name: str = Field(..., description="Underlying algorithm utilized")
    confidence_score: float = Field(..., description="Model statistical confidence score (%)", examples=[85.0])
    features_used: Dict[str, Any] = Field(..., description="Normalized features used during inference")


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    model_version: str
    uptime_seconds: float


# ============================================================================
# Application Lifespan & Initialization
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model once into memory on application startup."""
    logger.info("Initializing AutoWorth AI prediction API...")
    model_path = os.getenv("MODEL_PATH", os.path.join(CURRENT_DIR, "models", "best_model.joblib"))
    metadata_path = os.getenv("METADATA_PATH", os.path.join(CURRENT_DIR, "models", "model_metadata.json"))

    try:
        predictor = CarPricePredictor.get_instance(model_path=model_path, metadata_path=metadata_path)
        app.state.predictor = predictor
        logger.info(f"ML Predictor initialized successfully with model: {predictor.metadata.get('best_model_name')}")
    except Exception as e:
        logger.error(f"Failed to load ML model on startup: {e}")
        app.state.predictor = None

    yield
    logger.info("Shutting down AutoWorth AI prediction API...")


app = FastAPI(
    title="AutoWorth AI - Used Car Price Prediction API",
    description="High-performance ML inference service for indicative used car valuation in the Indian automotive market.",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================================
# CORS Configuration
# ============================================================================

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Exception Handlers
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Sanitize validation error messages; never expose internal stacks or server paths."""
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(item) for item in err.get("loc", []) if item != "body"])
        errors.append(f"{loc}: {err.get('msg', 'Invalid value')}")
    logger.warning(f"Validation error on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "One or more vehicle attributes are invalid.",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Sanitize internal errors without leaking file paths or stacks."""
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during prediction processing. Please try again later.",
        },
    )


def get_predictor():
    """Retrieve or lazily initialize the predictor."""
    predictor = getattr(app.state, "predictor", None)
    if predictor is None:
        model_path = os.getenv("MODEL_PATH", os.path.join(CURRENT_DIR, "models", "best_model.joblib"))
        metadata_path = os.getenv("METADATA_PATH", os.path.join(CURRENT_DIR, "models", "model_metadata.json"))
        try:
            predictor = CarPricePredictor.get_instance(model_path=model_path, metadata_path=metadata_path)
            app.state.predictor = predictor
        except Exception as e:
            logger.error(f"Failed to lazily load ML model: {e}")
            return None
    return predictor


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Liveness and readiness health check verifying that the model is loaded."""
    predictor = get_predictor()
    is_loaded = predictor is not None and predictor.is_loaded()
    
    if not is_loaded:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "degraded",
                "model_loaded": False,
                "model_name": "None",
                "model_version": "1.0",
                "uptime_seconds": round(time.time() - APP_START_TIME, 2),
            },
        )

    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_name=predictor.metadata.get("best_model_name", "AutoWorth Regressor"),
        model_version=predictor.metadata.get("model_version", "1.0"),
        uptime_seconds=round(time.time() - APP_START_TIME, 2),
    )


@app.post("/predict", response_model=CarPredictionResponse, tags=["Prediction"])
def predict_car_price(payload: CarPredictionRequest):
    """
    Accepts vehicle specifications and returns genuinely predicted resale price in INR.
    """
    predictor = get_predictor()
    if predictor is None or not predictor.is_loaded():
        logger.error("Prediction requested but ML model is not available.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is currently unavailable or initializing. Please try again shortly.",
        )

    try:
        spec_dict = payload.model_dump(by_alias=True)
        result = predictor.predict(spec_dict)
        return CarPredictionResponse(**result)
    except ValueError as val_err:
        logger.warning(f"Invalid input values in prediction request: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as err:
        logger.error(f"Inference pipeline execution error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate vehicle price prediction.",
        )


@app.post("/predict/batch", response_model=List[CarPredictionResponse], tags=["Prediction"])
def predict_batch_car_prices(payload: List[CarPredictionRequest]):
    """
    Accepts a batch list of vehicle specifications and returns predicted resale prices in INR.
    """
    predictor = get_predictor()
    if predictor is None or not predictor.is_loaded():
        logger.error("Batch prediction requested but ML model is not available.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is currently unavailable or initializing. Please try again shortly.",
        )

    if len(payload) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch limit exceeded. Maximum 100 vehicles allowed per batch request.",
        )

    results = []
    try:
        for car in payload:
            spec_dict = car.model_dump(by_alias=True)
            res = predictor.predict(spec_dict)
            results.append(CarPredictionResponse(**res))
        return results
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as err:
        logger.error(f"Batch prediction error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Batch prediction failed during processing.",
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=False)
