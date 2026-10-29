"""
AutoWorth AI - Model Training & Comparison Pipeline
Trains and compares multiple regression models on training/validation splits,
selects the optimal pipeline, and persists artifacts in ml/models/ and ml/reports/.
"""
import os
import sys
import json
import logging
from typing import Dict, Any, List
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
    mean_absolute_percentage_error,
)
from sklearn.pipeline import Pipeline

# Import optional gradient boosters
try:
    from xgboost import XGBRegressor
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

try:
    from lightgbm import LGBMRegressor
    LGBM_AVAILABLE = True
except ImportError:
    LGBM_AVAILABLE = False

try:
    from catboost import CatBoostRegressor
    CATBOOST_AVAILABLE = True
except ImportError:
    CATBOOST_AVAILABLE = False

from preprocessing import (
    build_preprocessor,
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    TARGET_COLUMN,
)

# Ensure UTF-8 output on Windows console
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

RANDOM_SEED = 42


def calculate_metrics(y_true: pd.Series, y_pred: np.ndarray) -> Dict[str, float]:
    """Calculate comprehensive regression metrics."""
    # Ensure non-negative predictions for vehicle prices
    y_pred_clipped = np.clip(y_pred, 15000, None)
    mae = float(mean_absolute_error(y_true, y_pred_clipped))
    rmse = float(root_mean_squared_error(y_true, y_pred_clipped))
    r2 = float(r2_score(y_true, y_pred_clipped))
    mape = float(mean_absolute_percentage_error(y_true, y_pred_clipped) * 100)
    mdape = float(np.median(np.abs((y_true - y_pred_clipped) / y_true)) * 100)
    return {
        "mae_inr": round(mae, 2),
        "rmse_inr": round(rmse, 2),
        "r2_score": round(r2, 4),
        "mape_percent": round(mape, 2),
        "mdape_percent": round(mdape, 2),
    }


def plot_diagnostics(
    y_val: pd.Series,
    y_val_pred: np.ndarray,
    model_name: str,
    output_dir: str = "ml/reports",
):
    """Generate and save publication-quality diagnostic plots."""
    os.makedirs(output_dir, exist_ok=True)
    sns.set_theme(style="whitegrid")

    # 1. Actual vs Predicted Plot
    fig, ax = plt.subplots(figsize=(8, 6), dpi=150)
    y_val_lakh = y_val / 100000.0
    y_pred_lakh = y_val_pred / 100000.0

    ax.scatter(y_val_lakh, y_pred_lakh, alpha=0.45, color="#007060", edgecolors="none", s=25)
    max_val = max(y_val_lakh.max(), y_pred_lakh.max()) * 1.05
    ax.plot([0, max_val], [0, max_val], "r--", linewidth=1.5, label="Ideal 1:1 Identity")

    ax.set_title(f"Actual vs Predicted Resale Prices ({model_name})", fontsize=12, fontweight="bold")
    ax.set_xlabel("Actual Selling Price (in Lakhs INR)", fontsize=10)
    ax.set_ylabel("Predicted Selling Price (in Lakhs INR)", fontsize=10)
    ax.set_xlim(0, max_val)
    ax.set_ylim(0, max_val)
    ax.legend(loc="upper left")
    plt.tight_layout()
    actual_vs_pred_path = os.path.join(output_dir, "actual_vs_predicted.png")
    fig.savefig(actual_vs_pred_path)
    plt.close(fig)
    logger.info(f"Saved actual vs predicted plot to {actual_vs_pred_path}")

    # 2. Residual Distribution & Scatter Plot
    residuals = y_val - y_val_pred
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5), dpi=150)

    # Residuals vs Predicted
    ax1.scatter(y_pred_lakh, residuals / 100000.0, alpha=0.4, color="#4B6100", s=20)
    ax1.axhline(0, color="red", linestyle="--", linewidth=1.2)
    ax1.set_title("Residuals vs Predicted Value", fontsize=11, fontweight="bold")
    ax1.set_xlabel("Predicted Selling Price (Lakhs INR)", fontsize=10)
    ax1.set_ylabel("Residual (Actual - Pred) (Lakhs INR)", fontsize=10)

    # Residual Histogram / KDE
    sns.histplot(residuals / 100000.0, kde=True, ax=ax2, color="#007060", bins=35)
    ax2.set_title("Residual Distribution (Lakhs INR)", fontsize=11, fontweight="bold")
    ax2.set_xlabel("Error (Actual - Predicted) in Lakhs INR", fontsize=10)
    ax2.set_ylabel("Frequency", fontsize=10)

    plt.tight_layout()
    residuals_path = os.path.join(output_dir, "residuals.png")
    fig.savefig(residuals_path)
    plt.close(fig)
    logger.info(f"Saved residuals plot to {residuals_path}")


def train_and_compare(
    train_path: str = "ml/data/processed/train.csv",
    val_path: str = "ml/data/processed/val.csv",
    models_dir: str = "ml/models",
    reports_dir: str = "ml/reports",
) -> Dict[str, Any]:
    """Train candidate regressors, log comparative metrics, and save best model."""
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)

    logger.info(f"Loading training data: {train_path}")
    train_df = pd.read_csv(train_path)
    logger.info(f"Loading validation data: {val_path}")
    val_df = pd.read_csv(val_path)

    feature_cols = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
    X_train = train_df[feature_cols]
    y_train = train_df[TARGET_COLUMN]

    X_val = val_df[feature_cols]
    y_val = val_df[TARGET_COLUMN]

    # Candidate Regressors Definition
    candidates = {
        "Dummy Regressor (Baseline)": DummyRegressor(strategy="median"),
        "Ridge Linear Regression": Ridge(alpha=10.0, random_state=RANDOM_SEED),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=150,
            max_depth=16,
            min_samples_leaf=2,
            random_state=RANDOM_SEED,
            n_jobs=-1,
        ),
    }

    if XGB_AVAILABLE:
        candidates["XGBoost Regressor"] = XGBRegressor(
            n_estimators=160,
            max_depth=6,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=RANDOM_SEED,
            n_jobs=-1,
        )

    if LGBM_AVAILABLE:
        candidates["LightGBM Regressor"] = LGBMRegressor(
            n_estimators=160,
            max_depth=6,
            learning_rate=0.08,
            subsample=0.85,
            random_state=RANDOM_SEED,
            verbose=-1,
            n_jobs=-1,
        )

    if CATBOOST_AVAILABLE:
        candidates["CatBoost Regressor"] = CatBoostRegressor(
            iterations=220,
            depth=6,
            learning_rate=0.08,
            random_seed=RANDOM_SEED,
            verbose=0,
        )

    results = []
    fitted_pipelines = {}

    print(f"\n{'='*80}")
    print(f"{'MODEL COMPARISON BENCHMARK':^80}")
    print(f"{'='*80}")
    print(f"{'Algorithm':<28} | {'Val R2':<8} | {'Val MAE (INR)':<14} | {'Val RMSE (INR)':<14} | {'Val MAPE':<9}")
    print(f"{'-'*80}")

    best_score = float("inf")
    best_model_name = None

    for name, regressor in candidates.items():
        preprocessor = build_preprocessor()
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", regressor),
        ])

        # Train on train split only
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline

        # Predictions
        train_pred = pipeline.predict(X_train)
        val_pred = pipeline.predict(X_val)

        train_metrics = calculate_metrics(y_train, train_pred)
        val_metrics = calculate_metrics(y_val, val_pred)

        model_summary = {
            "model_name": name,
            "train_metrics": train_metrics,
            "val_metrics": val_metrics,
            "val_mae": val_metrics["mae_inr"],
            "val_r2": val_metrics["r2_score"],
            "val_rmse": val_metrics["rmse_inr"],
            "val_mape": val_metrics["mape_percent"],
        }
        results.append(model_summary)

        print(
            f"{name:<28} | "
            f"{val_metrics['r2_score']:<8.4f} | "
            f"INR {val_metrics['mae_inr']:>10,.0f} | "
            f"INR {val_metrics['rmse_inr']:>10,.0f} | "
            f"{val_metrics['mape_percent']:>7.2f}%"
        )

        # Selection criterion: Lowest Validation MAE with high R²
        if val_metrics["mae_inr"] < best_score:
            best_score = val_metrics["mae_inr"]
            best_model_name = name

    print(f"{'='*80}")
    print(f"Selected Optimal Model: {best_model_name} (Validation MAE: INR {best_score:,.2f})")
    print(f"{'='*80}\n")

    # Save best fitted pipeline
    best_pipeline = fitted_pipelines[best_model_name]
    best_model_path = os.path.join(models_dir, "best_model.joblib")
    joblib.dump(best_pipeline, best_model_path)
    logger.info(f"Saved best model pipeline to: {best_model_path}")

    # Generate diagnostic plots for best model
    val_preds_best = best_pipeline.predict(X_val)
    plot_diagnostics(y_val, val_preds_best, best_model_name, reports_dir)

    # Feature Importance (if tree-based model)
    try:
        reg_step = best_pipeline.named_steps["regressor"]
        prep_step = best_pipeline.named_steps["preprocessor"]
        cat_encoder = prep_step.named_transformers_["cat"].named_steps["ohe"]
        cat_feature_names = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
        all_feature_names = NUMERICAL_FEATURES + cat_feature_names

        importances = None
        if hasattr(reg_step, "feature_importances_"):
            importances = reg_step.feature_importances_
        elif hasattr(reg_step, "coef_"):
            importances = np.abs(reg_step.coef_)

        if importances is not None and len(importances) == len(all_feature_names):
            fi_df = pd.DataFrame({
                "feature": all_feature_names,
                "importance": importances,
            }).sort_values(by="importance", ascending=False).head(20)

            fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
            sns.barplot(data=fi_df, x="importance", y="feature", ax=ax, palette="mako")
            ax.set_title(f"Top 20 Feature Importances ({best_model_name})", fontsize=12, fontweight="bold")
            ax.set_xlabel("Relative Importance", fontsize=10)
            ax.set_ylabel("Feature", fontsize=10)
            plt.tight_layout()
            fi_plot_path = os.path.join(reports_dir, "feature_importance.png")
            fig.savefig(fi_plot_path)
            plt.close(fig)
            logger.info(f"Saved feature importance plot to {fi_plot_path}")
    except Exception as e:
        logger.warning(f"Could not generate feature importance plot: {e}")

    # Save model metadata and comparison report
    metadata = {
        "best_model_name": best_model_name,
        "selected_metric": "Validation MAE (₹)",
        "features": {
            "categorical": CATEGORICAL_FEATURES,
            "numerical": NUMERICAL_FEATURES,
            "target": TARGET_COLUMN,
        },
        "dataset": {
            "source": "Kaggle CarDekho v3 Dataset",
            "train_samples": len(train_df),
            "val_samples": len(val_df),
            "reference_year": 2025,
        },
        "best_model_val_metrics": [r for r in results if r["model_name"] == best_model_name][0]["val_metrics"],
        "all_models_compared": results,
    }

    metadata_path = os.path.join(models_dir, "model_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Saved model metadata to {metadata_path}")

    # Save comparison table as CSV
    comp_df = pd.DataFrame([
        {
            "Algorithm": r["model_name"],
            "Val_R2": r["val_metrics"]["r2_score"],
            "Val_MAE_INR": r["val_metrics"]["mae_inr"],
            "Val_RMSE_INR": r["val_metrics"]["rmse_inr"],
            "Val_MAPE_Percent": r["val_metrics"]["mape_percent"],
            "Val_MdAPE_Percent": r["val_metrics"]["mdape_percent"],
        }
        for r in results
    ]).sort_values(by="Val_MAE_INR")
    comp_csv_path = os.path.join(reports_dir, "model_comparison.csv")
    comp_df.to_csv(comp_csv_path, index=False)
    logger.info(f"Saved model comparison table to {comp_csv_path}")

    return metadata


if __name__ == "__main__":
    train_and_compare()
