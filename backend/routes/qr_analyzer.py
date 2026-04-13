from flask import Blueprint, request, jsonify
import numpy as np
import cv2
import base64

try:
    from pyzbar.pyzbar import decode
    ZBAR_AVAILABLE = True
except Exception:
    ZBAR_AVAILABLE = False

qr_analyzer_bp = Blueprint('qr_analyzer', __name__)

@qr_analyzer_bp.route('/analyze-qr', methods=['POST'])
def analyze_qr():
    """
    Receives base64 image, extracts URL, and analyzes it
    """
    if not ZBAR_AVAILABLE:
        return jsonify({
            "status": "partial",
            "url": "https://google.com", 
            "message": "QR analysis (ZBar) is not available in this environment. Returning mock URL for demo."
        })

    data = request.json
    image_b64 = data.get('image')
    
    if not image_b64:
        return jsonify({"error": "Base64 image is required"}), 400
        
    try:
        # Decode base64
        image_data = base64.b64decode(image_b64.split(',')[1] if ',' in image_b64 else image_b64)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # QR extraction
        qrs = decode(img)
        if not qrs:
            return jsonify({"error": "No QR code found in image"}), 404
            
        url = qrs[0].data.decode('utf-8')
        
        # Return URL so frontend can call analyze-url
        return jsonify({
            "status": "success",
            "url": url,
            "qr_type": qrs[0].type,
            "message": f"Extracted URL: {url}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
