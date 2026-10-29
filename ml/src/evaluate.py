"""
AutoWorth AI - Model Evaluation Script
Evaluates the final persisted model pipeline on the untouched test set.
Generates comprehensive performance metrics and test reports.
"""
import os
import json
import logging
from typing import Dict, Any
import pandas as pd
import numpy as np
import joblib

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from preprocessing import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    TARGET_COLUMN,
)
from train import calculate_metrics

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def evaluate_test_set(
    model_path: str = "ml/models/best_model.joblib",
    test_path: str = "ml/data/processed/test.csv",
    reports_dir: str = "ml/reports",
) -> Dict[str, Any]:
    """Evaluates the saved pipeline on the holdout test set."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model artifact not found: {model_path}")
    if not os.path.exists(test_path):
        raise FileNotFoundError(f"Test split not found: {test_path}")

    logger.info(f"Loading best model from {model_path}...")
    pipeline = joblib.load(model_path)

    logger.info(f"Loading holdout test data from {test_path}...")
    test_df = pd.read_csv(test_path)

    feature_cols = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
    X_test = test_df[feature_cols]
    y_test = test_df[TARGET_COLUMN]

    logger.info(f"Running predictions on {len(test_df):,} test records...")
    test_preds = pipeline.predict(X_test)
    test_preds = np.clip(test_preds, 15000, None)

    metrics = calculate_metrics(y_test, test_preds)

    # Detailed performance across price brackets
    brackets = [
        ("Budget (< 4 Lakhs)", y_test < 400000),
        ("Mid-Market (4 - 10 Lakhs)", (y_test >= 400000) & (y_test < 1000000)),
        ("Executive (10 - 25 Lakhs)", (y_test >= 1000000) & (y_test < 2500000)),
        ("Luxury (>= 25 Lakhs)", y_test >= 2500000),
    ]

    bracket_eval = {}
    for label, mask in brackets:
        if mask.sum() > 0:
            bracket_eval[label] = {
                "sample_count": int(mask.sum()),
                "mae_inr": round(float(np.mean(np.abs(y_test[mask] - test_preds[mask]))), 2),
                "mdape_percent": round(float(np.median(np.abs((y_test[mask] - test_preds[mask]) / y_test[mask])) * 100), 2),
            }

    report = {
        "test_sample_count": len(test_df),
        "overall_test_metrics": metrics,
        "price_bracket_breakdown": bracket_eval,
    }

    print(f"\n{'='*70}")
    print(f"{'FINAL HOLDOUT TEST EVALUATION REPORT':^70}")
    print(f"{'='*70}")
    print(f"Total Test Samples:   {len(test_df):,}")
    print(f"Test R2 Score:        {metrics['r2_score']:.4f}")
    print(f"Test MAE:             INR {metrics['mae_inr']:,.2f}")
    print(f"Test RMSE:            INR {metrics['rmse_inr']:,.2f}")
    print(f"Test MAPE:            {metrics['mape_percent']:.2f}%")
    print(f"Test Median APE:      {metrics['mdape_percent']:.2f}%")
    print(f"{'-'*70}")
    print("Performance by Price Tier:")
    for b_name, b_data in bracket_eval.items():
        print(f"  * {b_name:<26} (N={b_data['sample_count']:>3}): MAE INR {b_data['mae_inr']:>10,.0f} | Median Error: {b_data['mdape_percent']:.1f}%")
    print(f"{'='*70}\n")

    os.makedirs(reports_dir, exist_ok=True)
    report_path = os.path.join(reports_dir, "test_evaluation.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    logger.info(f"Saved test evaluation report to {report_path}")

    return report


if __name__ == "__main__":
    evaluate_test_set()
