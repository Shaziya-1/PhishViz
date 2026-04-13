from flask import Blueprint, jsonify, request
import json
import os

stats_bp = Blueprint('stats', __name__)

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/processed/phishviz_master_dataset.json"))

@stats_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        with open(DATA_PATH, 'r') as f:
            data = json.load(f)
            
        # Unified Stats Logic
        total_threats = len(data)
        high_risk = [d for d in data if d.get('url_type') in ['phishing', 'malicious']]

        # Include raw data only if ?full=true
        include_full = request.args.get('full', 'false').lower() == 'true'
        
        # Distributions for Charts (Backend Aggregation for Performance)
        timeline = {}
        attack_types = {}
        geo_counts = {}
        
        for d in data:
            # 1. Timeline (Group by Year)
            year = str(d.get('year', 'Unknown'))
            if year not in timeline:
                timeline[year] = {"year": year, "threats": 0, "blocked": 0}
            timeline[year]["threats"] += 1
            if d.get('defense_mechanism') and d.get('defense_mechanism') != 'None':
                timeline[year]["blocked"] += 1
            
            # 2. Attack Types
            a_type = d.get('attack_type', 'Other')
            attack_types[a_type] = attack_types.get(a_type, 0) + 1
            
            # 3. Geo Distribution
            country = d.get('country')
            if country:
                geo_counts[country] = geo_counts.get(country, 0) + 1
        
        sorted_timeline = sorted(timeline.values(), key=lambda x: x['year'])
        blocked_attempts = sum(t['blocked'] for t in timeline.values())
        
        # 4. Recent Threats (for BlockedThreats component)
        recent_threats = [d for d in data if d.get('url_type') in ['phishing', 'malicious']][:10]
        
        response_data = {
            "totalThreats": total_threats,
            "highRiskURLs": len(high_risk),
            "blockedAttempts": blocked_attempts,
            "activeAlerts": len([d for d in high_risk if not d.get('resolution_time_hr') or d['resolution_time_hr'] > 48]),
            "timelineData": sorted_timeline,
            "attackDistribution": [{"name": k, "value": v} for k, v in attack_types.items()],
            "geoDistribution": geo_counts,
            "recentThreats": recent_threats
        }

        if include_full:
            response_data["raw_data"] = data
            
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
