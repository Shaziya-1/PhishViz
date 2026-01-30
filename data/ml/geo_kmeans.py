import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

print("✅ Geo K-Means started")

# ===============================
# LOAD MASTER DATASET
# ===============================
df = pd.read_csv("../processed/phishviz_master_dataset.csv")

print("Rows:", len(df))

# ===============================
# COUNTRY LEVEL AGGREGATION
# ===============================
country_df = df.groupby("country").agg({
    "affected_users": "mean",
    "financial_loss_million": "mean",
    "resolution_time_hr": "mean"
}).reset_index()

print("Countries:", len(country_df))

# ===============================
# FEATURES FOR CLUSTERING
# ===============================
X = country_df[
    ["affected_users", "financial_loss_million", "resolution_time_hr"]
]

# ===============================
# SCALE FEATURES
# ===============================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ===============================
# APPLY K-MEANS
# ===============================
kmeans = KMeans(n_clusters=3, random_state=42)
country_df["cluster"] = kmeans.fit_predict(X_scaled)

# ===============================
# MAP CLUSTERS → RISK LABELS
# ===============================
cluster_means = country_df.groupby("cluster")[
    ["affected_users", "financial_loss_million"]
].mean()

# sort clusters by severity
severity_order = cluster_means.sum(axis=1).sort_values().index.tolist()

risk_map = {
    severity_order[0]: "Low Risk",
    severity_order[1]: "Medium Risk",
    severity_order[2]: "High Risk"
}

country_df["risk_level"] = country_df["cluster"].map(risk_map)

# ===============================
# SAVE OUTPUT
# ===============================
output = country_df[[
    "country",
    "affected_users",
    "financial_loss_million",
    "resolution_time_hr",
    "risk_level"
]]

output.to_json(
    "../processed/geo_clustered.json",
    orient="records",
    indent=2
)

print("✅ geo_clustered.json generated")
print(output.head())
