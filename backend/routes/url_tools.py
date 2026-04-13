from flask import Blueprint, request, jsonify
import requests
import Levenshtein
from urllib.parse import urlparse
import tldextract

url_tools_bp = Blueprint('url_tools', __name__)

@url_tools_bp.route('/check-redirects', methods=['POST'])
def check_redirects():
    """
    Check for redirect chains
    """
    data = request.json
    url = data.get('url')
    
    if not url: return jsonify({"error": "URL required"}), 400
    
    try:
        response = requests.get(url, allow_redirects=True, timeout=5)
        chain = []
        for r in response.history:
            chain.append({"url": r.url, "status": r.status_code})
            
        # Add final
        chain.append({"url": response.url, "status": response.status_code})
        
        return jsonify({
            "chain_length": len(chain),
            "redirect_chain": chain,
            "final_url": response.url,
            "is_suspicious": len(chain) > 3
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@url_tools_bp.route('/domain-similarity', methods=['POST'])
def domain_similarity():
    """
    Detect spoofed domains
    """
    data = request.json
    url = data.get('url')
    target_brands = ["paypal", "google", "amazon", "apple", "facebook", "microsoft", "netflix"]
    
    if not url: return jsonify({"error": "URL required"}), 400
    
    try:
        domain = tldextract.extract(url).domain
        similarity_results = []
        
        for brand in target_brands:
            score = Levenshtein.ratio(domain, brand)
            if 0.7 < score < 1.0: # High similarity but not exact
                similarity_results.append({
                    "brand": brand,
                    "similarity_score": round(score * 100, 2),
                    "status": "Potential Spoofing"
                })
                
        return jsonify({
            "domain": domain,
            "spoofing_detected": len(similarity_results) > 0,
            "results": similarity_results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
