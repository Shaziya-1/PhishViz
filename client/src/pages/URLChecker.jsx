import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { checkURL, downloadReport } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import "../urlchecker.css";

const URLChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const analyzeURL = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setShowComparison(false);
    try {
      const { data } = await checkURL(url);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing URL. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await downloadReport({
        url: result.url,
        risk_score: result.final_score,
        risk_level: result.risk_level,
        details: result.details
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CyberPhish_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = [
    { name: 'Logistic Regression', score: result?.model_comparison['Logistic Regression'] },
    { name: 'Random Forest', score: result?.model_comparison['Random Forest'] },
    { name: 'ANN (Neural Network)', score: result?.model_comparison['ANN (Neural Network)'] }
  ];

  return (
    <>
      <Navbar />

      <div className="url-page">
        {/* HEADER */}
        <div className="url-header">
          <div className="shield">🛡️</div>
          <h1>Advanced URL Intelligence</h1>
          <p>AI-Powered Real-Time Phishing Detection & Explainability</p>
        </div>

        {/* INPUT */}
        <div className="url-input-card">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL to analyze (e.g., https://paypal-secure-verify.com)"
          />
          <button onClick={analyzeURL} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Now"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <>
            <div className={`result-card ${result.risk_level.toLowerCase()}`}>
              <div className="result-main">
                <div>
                  <h3>Overall Risk: {result.risk_level}</h3>
                  <p className="score">Aggregated Risk Score: {result.final_score}/100</p>
                  {showComparison && <p className="confidence pulse">Confidence (ML+NN): {result.confidence}%</p>}
                </div>
                <div className="result-actions">
                  <button className="compare-btn" onClick={() => setShowComparison(!showComparison)}>
                    {showComparison ? "Hide Comparison" : "📊 View Model Comparison"}
                  </button>
                  <button className="report-btn" onClick={handleDownloadReport}>
                    📥 Download PDF Report
                  </button>
                </div>
              </div>

              {/* MODEL COMPARISON VIEW */}
              {showComparison && (
                <div className="comparison-overlay">
                  <h4>Hybrid Model Comparison</h4>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={12} stroke="#fff" />
                        <YAxis stroke="#fff" fontSize={12} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        />
                        <Bar dataKey="score" radius={[5, 5, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 2 ? "#6366f1" : "#3b82f6"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="best-performer">
                    <span>🏆 Best Performer: </span>
                    <strong>{result.model_comparison['Best Performer']}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="details-grid">
              {/* SHAP EXPLANATION */}
              <div className="card explain-card">
                <h3>🧠 Why was this flagged? (AI Explainability)</h3>
                <div className="explain-list">
                  {result.details.ml_explanation.map((ex, i) => (
                    <div key={i} className="explain-item">
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${Math.min(Math.abs(ex.importance) * 500, 100)}%`,
                            backgroundColor: ex.importance > 0 ? "#ef4444" : "#22c55e"
                          }}
                        />
                      </div>
                      <p><strong>{ex.description}</strong></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTEL CARDS */}
              <div className="card intel-card">
                <h3>🌐 Domain Intelligence</h3>
                <div className="intel-grid">
                  <div className="intel-item">
                    <span>📅</span>
                    <div>
                      <p>Domain Age</p>
                      <strong>{result.details.whois.age_days} Days</strong>
                    </div>
                  </div>
                  <div className="intel-item">
                    <span>🔒</span>
                    <div>
                      <p>SSL Status</p>
                      <strong>{result.details.ssl.valid ? "Valid (HTTPS)" : "Insecure (No SSL)"}</strong>
                    </div>
                  </div>
                  <div className="intel-item">
                    <span>🏢</span>
                    <div>
                      <p>Registrar</p>
                      <strong>{result.details.whois.registrar || "Unknown"}</strong>
                    </div>
                  </div>
                  <div className="intel-item">
                    <span>📡</span>
                    <div>
                      <p>Google Safe Browsing</p>
                      <strong style={{ color: result.details.threat_intel.google_safe_browsing === 'Safe' ? '#22c55e' : '#ef4444' }}>
                        {result.details.threat_intel.google_safe_browsing}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default URLChecker;
