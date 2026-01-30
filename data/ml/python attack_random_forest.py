import pandas as pd
import joblib
import json

print("🌲 Random Forest Prediction Started")

# ===============================
# LOAD DATA + MODEL
# ===============================
df = pd.read_csv("../processed/phishviz_master_dataset.csv")

model = joblib.load("attack_rf_model.pkl")
encoders = joblib.load("attack_rf_encoders.pkl")

features = [
    "target_industry",
    "attack_source",
    "vulnerability",
    "defense_mechanism"
]

target = "attack_type"

df = df[features + [target]].dropna()

# ===============================
# ENCODE INPUT FEATURES
# ===============================
for col in features:
    df[col] = encoders[col].transform(df[col])

# ===============================
# PREDICT ATTACK TYPES
# ===============================
predicted = model.predict(df[features])
df["predicted_attack"] = encoders[target].inverse_transform(predicted)

# ===============================
# AGGREGATE COUNTS
# ===============================
attack_counts = df["predicted_attack"].value_counts().to_dict()

output = [
    {
        "attack_type": k,
        "count": int(v)
    }
    for k, v in attack_counts.items()
]

# ===============================
# SAVE JSON
# ===============================
with open("../processed/attack_rf_output.json", "w") as f:
    json.dump(output, f, indent=2)

print("✅ attack_rf_output.json generated")
print(output)
