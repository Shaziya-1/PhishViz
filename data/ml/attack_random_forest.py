import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

print("🌲 Random Forest – Attack Type Prediction")

# ===============================
# LOAD DATA
# ===============================
df = pd.read_csv("../processed/phishviz_master_dataset.csv")

# ===============================
# SELECT FEATURES
# ===============================
features = [
    "target_industry",
    "attack_source",
    "vulnerability",
    "defense_mechanism"
]

target = "attack_type"

df = df[features + [target]].dropna()

# ===============================
# ENCODE CATEGORICAL DATA
# ===============================
encoders = {}
for col in features + [target]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

X = df[features]
y = df[target]

# ===============================
# TRAIN / TEST SPLIT
# ===============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===============================
# TRAIN MODEL
# ===============================
model = RandomForestClassifier(
    n_estimators=120,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# ===============================
# EVALUATION
# ===============================
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print("🎯 Accuracy:", round(acc * 100, 2), "%")

# ===============================
# SAVE MODEL
# ===============================
joblib.dump(model, "attack_rf_model.pkl")
joblib.dump(encoders, "attack_rf_encoders.pkl")

print("✅ Model saved")
