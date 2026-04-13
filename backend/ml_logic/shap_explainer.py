import shap
import pandas as pd
import joblib
import os

# Load the model
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/ml/url_logistic_model.pkl"))
model = joblib.load(model_path)

# Mock background data (Ideally, we use a subset of training data)
# Since we don't have the full training data in memory, we'll create a simple background
# based on the feature schema
def get_shap_explanation(features_dict):
    """
    Generate SHAP values for the input features
    """
    df = pd.DataFrame([features_dict])
    
    # SHAP explainer for linear models
    # Note: For Random Forest, use TreeExplainer
    explainer = shap.LinearExplainer(model, masker=shap.maskers.Independent(data=df))
    shap_values = explainer.shap_values(df)
    
    # Get feature importance contributions
    contributions = []
    for i, col in enumerate(df.columns):
        val = float(shap_values[0][i])
        if abs(val) > 0.001: # Increased sensitivity
            contributions.append({
                "feature": col,
                "importance": val,
                "description": get_feature_description(col)
            })
            
    # Always return at least some features for UI feedback
    if not contributions:
        # Fallback to display common features if SHAP is too quiet
        for col in ["NumDots", "UrlLength", "NoHttps", "NumSensitiveWords"]:
            contributions.append({
                "feature": col,
                "importance": 0.0,
                "description": get_feature_description(col)
            })

    # Sort by importance
    contributions.sort(key=lambda x: abs(x['importance']), reverse=True)
    return contributions[:10] # Return top 10

def get_feature_description(feature_name):
    descriptions = {
        "NumDots": "High number of dots in URL",
        "SubdomainLevel": "Suspicious subdomain layers",
        "UrlLength": "Unusually long URL",
        "NoHttps": "Insecure HTTP connection",
        "IpAddress": "Using hardcoded IP instead of domain",
        "HostnameLength": "Excessive hostname length",
        "NumSensitiveWords": "Phishing keywords detected",
        "EmbeddedBrandName": "Potential brand impersonation",
        "AtSymbol": "Use of @ symbol to obfuscate domain",
        "TildeSymbol": "Use of ~ symbol",
        "NumDash": "Too many hyphens",
        "NumDashInHostname": "Hyphens in main domain name",
    }
    return descriptions.get(feature_name, f"Suspicious pattern: {feature_name}")
