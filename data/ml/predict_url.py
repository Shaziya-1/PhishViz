import pandas as pd
import joblib
import json
import sys

model = joblib.load("url_logistic_model.pkl")

# Load same dataset structure
df = pd.read_csv("../raw/phishing_urls_raw.csv")

# Remove id & label
X = df.drop(columns=["id", "CLASS_LABEL"])

# Pick ONE sample row as demo prediction
sample = X.sample(1, random_state=42)

prediction = model.predict(sample)[0]
prob = model.predict_proba(sample).max()

output = {
    "prediction": "Phishing" if prediction == 1 else "Legitimate",
    "confidence": round(prob * 100, 2)
}

print(json.dumps(output))
