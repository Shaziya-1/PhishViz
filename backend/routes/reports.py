from flask import Blueprint, request, send_file, jsonify
from fpdf import FPDF
import os
import uuid

reports_bp = Blueprint('reports', __name__)

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'CyberPhish AI - Threat Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

@reports_bp.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    url = data.get('url', 'Unknown')
    risk_score = data.get('risk_score', 'N/A')
    risk_level = data.get('risk_level', 'Unknown')
    details = data.get('details', {})
    model_comparison = data.get('model_comparison', {})
    
    try:
        pdf = PDF()
        pdf.add_page()
        pdf.set_font("helvetica", size=12)
        
        # Summary Section
        pdf.set_font("helvetica", 'B', 16)
        pdf.cell(200, 10, txt="Hybrid Threat Summary", ln=True)
        pdf.set_font("helvetica", size=12)
        pdf.cell(200, 10, txt=f"Analysis URL/Source: {url}", ln=True)
        pdf.cell(200, 10, txt=f"Hybrid Risk Score: {risk_score}/100", ln=True)
        pdf.cell(200, 10, txt=f"Risk Level: {risk_level.upper()}", ln=True)
        pdf.ln(5)

        # Model Comparison Section (NEW)
        pdf.set_font("helvetica", 'B', 14)
        pdf.cell(200, 10, txt="Model Comparison Results", ln=True)
        pdf.set_font("helvetica", size=11)
        for model in ['Logistic Regression', 'Random Forest', 'ANN (Neural Network)']:
            if model in model_comparison:
                prob = model_comparison[model]
                pdf.cell(200, 8, txt=f"- {model}: {prob}% confidence", ln=True)
        pdf.cell(200, 8, txt=f"Best Performer: {model_comparison.get('Best Performer', 'N/A')}", ln=True)
        pdf.ln(5)
        
        # ML Explanation
        pdf.set_font("helvetica", 'B', 14)
        pdf.cell(200, 10, txt="AI Feature Importance", ln=True)
        pdf.set_font("helvetica", size=11)
        for detail in details.get('ml_explanation', [])[:10]:
            pdf.multi_cell(0, 8, txt=f"- {detail['description']} (Impact: {detail['importance']:.2f})")
            
        # WHOIS & Intelligence
        pdf.ln(5)
        pdf.set_font("helvetica", 'B', 14)
        pdf.cell(200, 10, txt="Security Intelligence", ln=True)
        pdf.set_font("helvetica", size=11)
        whois = details.get('whois', {})
        ssl = details.get('ssl', {})
        pdf.cell(200, 8, txt=f"Registrar: {whois.get('registrar', 'Unknown')}", ln=True)
        pdf.cell(200, 8, txt=f"Domain Age: {whois.get('age_days', 0)} days", ln=True)
        pdf.cell(200, 8, txt=f"SSL Certificate: {'Valid' if ssl.get('valid') else 'Invalid/Missing'}", ln=True)
        pdf.cell(200, 8, txt=f"SSL Issuer: {ssl.get('issuer', 'Unknown')}", ln=True)
        
        # Save locally and send
        if not os.path.exists("tmp"): os.makedirs("tmp")
        filename = f"report_{uuid.uuid4().hex[:8]}.pdf"
        output_path = os.path.join(os.getcwd(), "tmp", filename)
        
        pdf.output(output_path)
        return send_file(output_path, as_attachment=True)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
