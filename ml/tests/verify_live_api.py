"""
AutoWorth AI - Live API Integration Verifier
Validates live HTTP communication against running FastAPI server (http://127.0.0.1:8000).
"""
import urllib.request
import urllib.error
import json

API_URL = "http://127.0.0.1:8000"

def test_endpoint(name, method, path, data=None):
    url = f"{API_URL}{path}"
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"}, method=method)
    if data:
        req.data = json.dumps(data).encode("utf-8")
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            print(f"[PASS] {name}: HTTP {resp.status}")
            return resp.status, body
    except urllib.error.HTTPError as e:
        err_body = json.loads(e.read().decode("utf-8"))
        print(f"[EXPECTED_ERR] {name}: HTTP {e.code} -> {err_body}")
        return e.code, err_body
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return None, str(e)

if __name__ == "__main__":
    print("=== 1. Valid End-to-End Prediction ===")
    spec = {
        "make": "Hyundai",
        "model": "Creta",
        "variant": "SX (O) 1.5 CRDi AT",
        "year": 2021,
        "kilometers": 38000,
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "ownership": "1st Owner",
        "rtoCity": "pune"
    }
    s, res = test_endpoint("Valid Creta Prediction", "POST", "/predict", spec)
    assert s == 200
    print(f"   Predicted Price: INR {res['predicted_price']:,}")
    print(f"   Range: INR {res['min_price']:,} - INR {res['max_price']:,}")
    print(f"   Model: {res['model_name']} (v{res['model_version']})")
    assert res['predicted_price'] > 500000
    assert res['currency'] == "INR"

    print("\n=== 2. Invalid Negative Kilometers ===")
    s, err = test_endpoint("Negative KM", "POST", "/predict", {"make": "Hyundai", "model": "Creta", "year": 2021, "kilometers": -5000})
    assert s == 422

    print("\n=== 3. Invalid Future Year ===")
    s, err = test_endpoint("Future Year", "POST", "/predict", {"make": "Hyundai", "model": "Creta", "year": 2035, "kilometers": 20000})
    assert s == 422

    print("\n=== 4. Missing Model Field ===")
    s, err = test_endpoint("Missing Model", "POST", "/predict", {"make": "Hyundai", "year": 2021, "kilometers": 20000})
    assert s == 422

    print("\n=== 5. Unsupported Categorical Values Sanitization ===")
    s, res = test_endpoint("Unknown Category", "POST", "/predict", {
        "make": "Tata", "model": "Nexon", "year": 2022, "kilometers": 25000,
        "fuelType": "Plasma", "ownership": "Ambassador"
    })
    assert s == 200
    print(f"   Predicted Price for Tata Nexon with exotic values: INR {res['predicted_price']:,}")

    print("\nAll API integration scenarios verified successfully!")
