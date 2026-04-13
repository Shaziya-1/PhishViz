import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

def setup_ml():
    save_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "ml"))
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "raw", "phishing_urls_raw.csv"))

    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Skipping RF training.")
        return

    print("Training Random Forest for URLs...")
    df = pd.read_csv(dataset_path)
    X = df.drop(columns=["id", "CLASS_LABEL"])
    y = df["CLASS_LABEL"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X_train, y_train)
    
    rf_path = os.path.join(save_dir, "url_random_forest_model.pkl")
    joblib.dump(rf, rf_path)
    print(f"Saved Random Forest to {rf_path}")

if __name__ == "__main__":
    setup_ml()
