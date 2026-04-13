import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./live_alerts.css";

const LiveAlerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
        const socket = io(API_URL);


        socket.on("connect", () => {
            console.log("📡 Connected to PhishViz Real-Time Engine");
        });

        socket.on("new_alert", (alert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 5));
            // Auto-remove alert after 5 seconds
            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a.id !== alert.id));
            }, 5000);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="alerts-container">
            {alerts.map((alert, i) => (
                <div key={alert.id || i} className={`alert-toast ${alert.type || 'critical'}`}>
                    <div className="alert-header">
                        <span>🚨 REAL-TIME THREAT DETECTED</span>
                        <button onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}>✖</button>
                    </div>
                    <div className="alert-body">
                        <p><strong>Target:</strong> {alert.url || "Unknown Link"}</p>
                        <p><strong>Risk:</strong> {alert.level || "Critical"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LiveAlerts;
