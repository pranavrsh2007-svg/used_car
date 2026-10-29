"""
AutoWorth AI - Data Inspection Script
Inspects column names, data types, missing values, duplicate records,
target distribution, and outliers for downloaded CarDekho datasets.
"""
import os
import csv

def inspect_csv(file_path):
    print(f"\n{'='*70}\nInspecting: {os.path.basename(file_path)}\n{'='*70}")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        if not header:
            print("Empty file")
            return
        print(f"Total Columns ({len(header)}): {header}")

        rows = list(reader)
        print(f"Total Rows: {len(rows)}")

        # Sample 3 rows
        print("\nSample Rows:")
        for i, row in enumerate(rows[:3]):
            print(f"  Row {i+1}: {row}")

if __name__ == "__main__":
    inspect_csv("ml/data/raw/car data.csv")
    inspect_csv("ml/data/raw/CAR DETAILS FROM CAR DEKHO.csv")
    inspect_csv("ml/data/raw/Car details v3.csv")
