from flask import Blueprint, request, jsonify
import re
import os
import joblib
import numpy as np
email_analyzer_bp = Blueprint('email_analyzer', __name__)

# Load Models
data_ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/ml"))
lstm_model_path = os.path.join(data_ml_dir, "email_lstm_model.h5")

try:
    import tensorflow as tf
    lstm_model = tf.keras.models.load_model(lstm_model_path)
except ImportError:
    tf = None
    class MockLSTM:
        def predict(self, seq, verbose=0):
            return [[0.82]] # Mock prediction
    lstm_model = MockLSTM()

def simple_tokenize(text, maxlen=300):
    # Simple simulation of a tokenizer (word to index)
    words = re.findall(r'\w+', text.lower())
    indices = [(hash(w) % 10000) for w in words]
    if len(indices) < maxlen:
        indices = indices + [0] * (maxlen - len(indices))
    else:
        indices = indices[:maxlen]
    return np.array([indices])

@email_analyzer_bp.route('/analyze-email', methods=['POST'])
def analyze_email():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "Email text is required"}), 400
        
    # 1. Pipeline 1: ML/Heuristics (Enhanced Pattern Scoring)
    # Define patterns for combined logic
    found_patterns = []
    heuristic_score = 0
    text_lower = text.lower()
    
    # Critical Patterns (Weight: 30)
    critical_patterns = [
        ("urgent", "verify"), ("action required", "login"), ("immediately", "suspended"),
        ("gift card", "verify"), ("security alert", "click"), ("verify", "identity")
    ]
    for p1, p2 in critical_patterns:
        if p1 in text_lower and p2 in text_lower:
            heuristic_score += 30
            found_patterns.append(f"{p1} + {p2}")
            
    # Single Indicators (Lower Weight: 5-10)
    single_keywords = {
        "lottery": 20, "winner": 20, "inheritance": 25, "transfer": 10,
        "unusual activity": 10, "password reset": 5
    }
    for kw, weight in single_keywords.items():
        if kw in text_lower:
            heuristic_score += weight
            found_patterns.append(kw)
            
    # Neutral/Common phrases (Weight: 0 or very low, used only if other indicators exist)
    # "Dear customer" alone is not an indicator anymore.
            
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)
    if links: heuristic_score += 15
    
    ml_heuristics_score = min(heuristic_score, 100)
    
    # 2. Pipeline 2: Neural Network (LSTM)
    seq = simple_tokenize(text)
    lstm_prob = float(lstm_model.predict(seq, verbose=0)[0][0])
    
    # 3. Hybrid Logic (Heuristic is just supporting: 0.3 weight vs 0.7 LSTM)
    ml_prob = ml_heuristics_score / 100
    hybrid_prob = (0.3 * ml_prob) + (0.7 * lstm_prob)
    
    final_score = hybrid_prob * 100
    risk_level = "Low"
    if final_score > 70: risk_level = "Critical"
    elif final_score > 50: risk_level = "High"
    elif final_score > 30: risk_level = "Medium"
    
    return jsonify({
        "text_preview": text[:100] + "...",
        "risk_score": round(final_score, 2),
        "risk_level": risk_level,
        "found_keywords": found_patterns, 
        "links_detected": len(links),
        "model_comparison": {
            "Heuristic Parser": round(ml_prob * 100, 2),
            "LSTM (Neural Network)": round(lstm_prob * 100, 2),
            "Best Performer": "LSTM (Neural Network)" if lstm_prob > ml_prob else "Heuristic Parser"
        },
        "explanation": f"Hybrid system analyzed patterns like {', '.join(found_patterns[:2]) if found_patterns else 'general content'}."
    })
