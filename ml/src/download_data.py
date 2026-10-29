"""
AutoWorth AI - Dataset Downloader
Downloads genuine Kaggle CarDekho vehicle datasets into ml/data/raw/
"""
import os
import sys
import urllib.request
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATASETS = {
    "CAR DETAILS FROM CAR DEKHO.csv": "https://raw.githubusercontent.com/IMvision12/Car-Price_prediction/main/CAR%20DETAILS%20FROM%20CAR%20DEKHO.csv",
    "car data.csv": "https://raw.githubusercontent.com/roshancyriacmathew/Car-price-prediction-using-Linear-regression-Machine-Learning-Project/main/car%20data.csv",
    "Car details v3.csv": "https://raw.githubusercontent.com/Rishabh-Gup12/Car-price-Prediction/main/Car%20details%20v3.csv",
}

def download_datasets(target_dir: str = "ml/data/raw"):
    os.makedirs(target_dir, exist_ok=True)
    downloaded = []
    for filename, url in DATASETS.items():
        dest_path = os.path.join(target_dir, filename)
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1024:
            logger.info(f"Dataset already exists: {dest_path} ({os.path.getsize(dest_path):,} bytes)")
            downloaded.append(dest_path)
            continue
        logger.info(f"Downloading {filename} from verified repository...")
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            )
            with urllib.request.urlopen(req, timeout=30) as response, open(dest_path, "wb") as out_file:
                out_file.write(response.read())
            size = os.path.getsize(dest_path)
            logger.info(f"Successfully saved {filename} ({size:,} bytes) to {dest_path}")
            downloaded.append(dest_path)
        except Exception as e:
            logger.warning(f"Failed to download {filename} from {url}: {e}")
            if os.path.exists(dest_path) and os.path.getsize(dest_path) == 0:
                os.remove(dest_path)
    return downloaded

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "ml/data/raw"
    download_datasets(target)
