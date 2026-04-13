from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import sys

# Add root project path to import ML models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.routes.phish_analyzer import phish_analyzer_bp
from backend.routes.email_analyzer import email_analyzer_bp
from backend.routes.qr_analyzer import qr_analyzer_bp
from backend.routes.url_tools import url_tools_bp
from backend.routes.reports import reports_bp
from backend.routes.login_detector import login_detector_bp
from backend.routes.chatbot import chatbot_bp
from backend.routes.stats import stats_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cyberphish_secret!'
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Register Blueprints
app.register_blueprint(phish_analyzer_bp, url_prefix='/api')
app.register_blueprint(email_analyzer_bp, url_prefix='/api')
app.register_blueprint(qr_analyzer_bp, url_prefix='/api')
app.register_blueprint(url_tools_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')
app.register_blueprint(login_detector_bp, url_prefix='/api')
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(stats_bp, url_prefix='/api')

@app.route("/")
def home():
    return jsonify({"status": "CyberPhish AI Backend Running", "version": "2.0.0"})

@app.route("/api/health")
def health():
    return jsonify({"status": "healthy"})

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    print('Client connected to Socket.IO')
    emit('server_status', {'message': 'Connected to PhishViz Real-Time Engine'})

@socketio.on('ping_threat')
def handle_ping(data):
    # This will be used to simulate or report live threats
    emit('new_alert', data, broadcast=True)

if __name__ == "__main__":
    # Running on port 5001 to avoid conflict with existing Node.js on 5000
    # or we can stop Node.js later
    socketio.run(app, debug=True, port=5001)
