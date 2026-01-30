import pandas as pd
import os

base_dir = os.path.dirname(__file__)

csv_path = os.path.abspath(
    os.path.join(base_dir, "../processed/phishviz_master_dataset.csv")
)
json_path = os.path.abspath(
    os.path.join(base_dir, "../processed/phishviz_master_dataset.json")
)

print("📄 Reading:", csv_path)

df = pd.read_csv(csv_path)

print("📊 Total records:", len(df))

df.to_json(json_path, orient="records")

print("✅ JSON file created successfully")
