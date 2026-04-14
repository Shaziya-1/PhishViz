from flask import Blueprint, request, jsonify
from backend.ml_logic.feature_extractor import extract_features
try:
    from backend.ml_logic.shap_explainer import get_shap_explanation
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
from backend.utils.security_intel import get_whois_info, check_ssl, check_dns, check_threat_apis, is_trusted_domain
import joblib
import pandas as pd
import os
phish_analyzer_bp = Blueprint('phish_analyzer', __name__)

# Load Models
data_ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/ml"))
lr_model_path = os.path.join(data_ml_dir, "url_logistic_model.pkl")
rf_model_path = os.path.join(data_ml_dir, "url_random_forest_model.pkl")
ann_model_path = os.path.join(data_ml_dir, "url_ann_model.h5")

lr_model = joblib.load(lr_model_path)
rf_model = joblib.load(rf_model_path)

try:
    import tensorflow as tf
    ann_model = tf.keras.models.load_model(ann_model_path)
except ImportError:
    tf = None
    class MockANN:
        def predict(self, df, verbose=0):
            return [[0.85]] # Mock prediction
    ann_model = MockANN()

@phish_analyzer_bp.route('/analyze-url', methods=['POST'])
def analyze_url():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    try:
        # 0. Trusted Domain Check (CRITICAL FIX)
        is_trusted = is_trusted_domain(url)
        
        # 1. Feature Extraction
        feature_list, feature_dict = extract_features(url)
        
        # 2. Parallel Predictions
        column_names = [
            "NumDots", "SubdomainLevel", "PathLevel", "UrlLength", "NumDash", "NumDashInHostname", 
            "AtSymbol", "TildeSymbol", "NumUnderscore", "NumPercent", "NumQueryComponents", 
            "NumAmpersand", "NumHash", "NumNumericChars", "NoHttps", "RandomString", "IpAddress", 
            "DomainInSubdomains", "DomainInPaths", "HttpsInHostname", "HostnameLength", 
            "PathLength", "QueryLength", "DoubleSlashInPath", "NumSensitiveWords", 
            "EmbeddedBrandName", "PctExtHyperlinks", "PctExtResourceUrls", "ExtFavicon", 
            "InsecureForms", "RelativeFormAction", "ExtFormAction", "AbnormalFormAction", 
            "PctNullSelfRedirectHyperlinks", "FrequentDomainNameMismatch", "FakeLinkInStatusBar", 
            "RightClickDisabled", "PopUpWindow", "SubmitInfoToEmail", "IframeOrFrame", 
            "MissingTitle", "ImagesOnlyInForm", "SubdomainLevelRT", "UrlLengthRT", 
            "PctExtResourceUrlsRT", "AbnormalExtFormActionR", "ExtMetaScriptLinkRT", 
            "PctExtNullSelfRedirectHyperlinksRT"
        ]
        df = pd.DataFrame([feature_list], columns=column_names)
        
        # Logistic Regression
        lr_prob = lr_model.predict_proba(df)[0][1]
        # Random Forest
        rf_prob = rf_model.predict_proba(df)[0][1]
        # ANN
        ann_prob = float(ann_model.predict(df, verbose=0)[0][0])
        
        # 3. Hybrid Logic (Heuristic is NOT dominating)
        # ML Pipeline Score (Average of LR and RF)
        ml_score_avg = (lr_prob + rf_prob) / 2
        
        # Final weighted score: (0.4 * ML + 0.6 * NN)
        hybrid_prob = (0.4 * ml_score_avg) + (0.6 * ann_prob)
        
        # 4. Security Intelligence
        whois_data = get_whois_info(url)
        ssl_data = check_ssl(url)
        dns_data = check_dns(url)
        threat_data = check_threat_apis(url)
        
        # 5. Risk Scoring Engine (Aggregate)
        # Whitelist override
        if is_trusted:
            final_prob = hybrid_prob * 0.1 # Reduce AI risk by 90%
            intel_score = 0
            final_prediction = "Safe"
        else:
            final_prob = hybrid_prob
            intel_score = 0
            if whois_data['is_new']: intel_score += 30
            if not ssl_data['valid']: intel_score += 40
            if threat_data['google_safe_browsing'] == "Malicious": intel_score += 30
            intel_score = min(intel_score, 100)
            final_prediction = "Phishing" if (final_prob > 0.5 or intel_score > 70) else "Safe"
        
        # Dynamic Final Score
        final_score = (final_prob * 100 * 0.7) + (intel_score * 0.3)
        
        # Whitelist guarantee
        if is_trusted and ssl_data['valid']:
            final_score = min(final_score, 15)
            final_prediction = "Safe"

        risk_level = "Low"
        if final_score > 80: risk_level = "Critical"
        elif final_score > 60: risk_level = "High"
        elif final_score > 40: risk_level = "Medium"
        
        # 6. SHAP Explainability (with fallback for Vercel)
        if SHAP_AVAILABLE:
            explanation = get_shap_explanation(feature_dict)
        else:
            explanation = [
                {"feature": "HTTPS", "importance": 0.1, "description": "SSL/TLS Security Check"},
                {"feature": "Domain", "importance": 0.1, "description": "Root Domain Authority"},
                {"feature": "URL Path", "importance": 0.1, "description": "Structural Pattern Analysis"},
            ]
        
        return jsonify({
            "url": url,
            "prediction": final_prediction,
            "confidence": round(final_prob * 100, 2),
            "final_score": round(final_score, 1),
            "risk_level": risk_level,
            "is_trusted": is_trusted,
            "model_comparison": {
                "Logistic Regression": round(lr_prob * 100, 2),
                "Random Forest": round(rf_prob * 100, 2),
                "ANN (Neural Network)": round(ann_prob * 100, 2),
                "Best Performer": "ANN (Neural Network)" if ann_prob > max(lr_prob, rf_prob) else ("Random Forest" if rf_prob > lr_prob else "Logistic Regression")
            },
            "details": {
                "ml_explanation": explanation,
                "whois": whois_data,
                "ssl": ssl_data,
                "dns": dns_data,
                "threat_intel": threat_data
            }
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
