import pandas as pd
import random
import zipfile
import io


print("📂 Loading datasets from ZIP...")

def read_csv_from_zip(zip_path, file_name):
    with zipfile.ZipFile(zip_path, 'r') as z:
        with z.open(file_name) as f:
            return pd.read_csv(io.BytesIO(f.read()))

ZIP_PATH = "../raw/data_raw.zip"

# =====================
# LOAD DATASETS
# =====================
geo_df = read_csv_from_zip(ZIP_PATH, "global_cyber_attacks_raw.csv")
url_df = read_csv_from_zip(ZIP_PATH, "malicious_urls_raw.csv")
phish_df = read_csv_from_zip(ZIP_PATH, "phishing_urls_raw.csv")
site_df = read_csv_from_zip(ZIP_PATH, "phishing_site_urls.csv")


# =====================
# CLEAN DATA
# =====================
geo_df.dropna(inplace=True)
url_df.dropna(inplace=True)
phish_df.dropna(inplace=True)
site_df.dropna(inplace=True)

# =====================
# PRE-SAMPLE DATA (FAST + SAFE)
# =====================
geo_sample = geo_df.sample(n=10000, replace=True, random_state=42).reset_index(drop=True)
url_sample = url_df.sample(n=10000, replace=True, random_state=42).reset_index(drop=True)
site_sample = site_df.sample(n=10000, replace=True, random_state=42).reset_index(drop=True)

# =====================
# BUILD MASTER DATASET
# =====================
master_rows = []

for i in range(10000):
    geo = geo_sample.iloc[i]
    url = url_sample.iloc[i]
    site = site_sample.iloc[i]

    master_rows.append({
        "country": geo["Country"],
        "year": geo["Year"],
        "attack_type": geo["Attack Type"],
        "target_industry": geo["Target Industry"],
        "financial_loss_million": geo["Financial Loss (in Million $)"],
        "affected_users": geo["Number of Affected Users"],
        "attack_source": geo["Attack Source"],
        "vulnerability": geo["Security Vulnerability Type"],
        "defense_mechanism": geo["Defense Mechanism Used"],
        "resolution_time_hr": geo["Incident Resolution Time (in Hours)"],
        "url": url["url"],
        "url_type": url["type"],
        "site_label": site["Label"]
    })

# =====================
# SAVE OUTPUT
# =====================
master_df = pd.DataFrame(master_rows)

output_path = "../processed/phishviz_master_dataset.csv"
master_df.to_csv(output_path, index=False)

print("✅ phishviz_master_dataset.csv CREATED SUCCESSFULLY")
print("📊 Rows:", len(master_df))
