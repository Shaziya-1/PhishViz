from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

login_detector_bp = Blueprint('login_detector', __name__)

@login_detector_bp.route('/detect-login', methods=['POST'])
def detect_login():
    """
    Scrapes a page to see if it's a fake login page
    """
    data = request.json
    url = data.get('url')
    
    if not url: return jsonify({"error": "URL required"}), 400
    
    try:
        response = requests.get(url, timeout=5, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. Look for password fields
        password_fields = soup.find_all('input', {'type': 'password'})
        has_login = len(password_fields) > 0
        
        # 2. Look for brand keywords in text but not in domain
        brands = ["paypal", "google", "apple", "microsoft", "amazon", "netflix", "facebook"]
        domain = urlparse(url).netloc.lower()
        found_brands = []
        for brand in brands:
            if brand in soup.text.lower() and brand not in domain:
                found_brands.append(brand)
                
        # 3. Form action check
        forms = soup.find_all('form')
        suspicious_action = False
        for form in forms:
            action = form.get('action', '')
            if action.startswith('http') and urlparse(action).netloc != domain:
                suspicious_action = True
                
        risk_score = 0
        if has_login: risk_score += 40
        if found_brands: risk_score += 40
        if suspicious_action: risk_score += 20
        
        return jsonify({
            "url": url,
            "has_login_form": has_login,
            "login_fields": len(password_fields),
            "impersonated_brands": found_brands,
            "suspicious_form_action": suspicious_action,
            "login_risk_score": risk_score,
            "is_fake_login": risk_score >= 80
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
