import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

print("✅ Script started")

# ===============================
# LOAD DATASET (FEATURE-BASED)
# ===============================
df = pd.read_csv("../raw/phishing_urls_raw.csv")

print("✅ Dataset loaded")
print("Rows:", len(df))
print("Columns:", df.columns.tolist())

# ===============================
# FEATURES & LABEL
# ===============================
X = df.drop(columns=["id", "CLASS_LABEL"])
y = df["CLASS_LABEL"]   # 1 = phishing, 0 = legitimate

print("✅ Features & labels separated")

# ===============================
# TRAIN TEST SPLIT
# ===============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("✅ Data split")

# ===============================
# TRAIN MODEL
# ===============================
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

print("✅ Model trained")

# ===============================
# EVALUATION
# ===============================
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)

print("🎯 Accuracy:", round(acc * 100, 2), "%")

# ===============================
# SAVE MODEL
# ===============================
joblib.dump(model, "url_logistic_model.pkl")
print("💾 Model saved successfully")
