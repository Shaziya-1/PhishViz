import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../urlchecker.css";

const URLChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const analyzeURL = () => {
    let score = 0;
    let reasons = [];

    if (!url.startsWith("https://")) {
      score += 20;
      reasons.push("Website does not use HTTPS (secure connection missing)");
    }

    if (url.length > 75) {
      score += 15;
      reasons.push("URL length is unusually long");
    }

    if (/[<>{}%$]/.test(url)) {
      score += 15;
      reasons.push("Suspicious special characters detected");
    }

    if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
      score += 25;
      reasons.push("IP-based URL instead of domain name");
    }

    if ((url.match(/-/g) || []).length > 4) {
      score += 10;
      reasons.push("Too many hyphens in domain name");
    }

    if (/login|verify|secure|account|update|payment|free|bonus/i.test(url)) {
      score += 15;
      reasons.push("Phishing-related keywords found in URL");
    }

    score = Math.min(score, 100);

    let status = "Safe";
    if (score >= 70) status = "Dangerous";
    else if (score >= 35) status = "Suspicious";

    setResult({
      score,
      status,
      reasons,
      masked: url.replace(/https?:\/\/([^/]+)/, "https://***"),
    });
  };

  return (
    <>
      <Navbar />

      <div className="url-page">
        {/* HEADER */}
        <div className="url-header">
          <div className="shield">🛡️</div>
          <h1>URL Safety Checker</h1>
          <p>Analyze a link and understand how risky it may be</p>
        </div>

        {/* INPUT */}
        <div className="url-input-card">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL (https://example.com)"
          />
          <button onClick={analyzeURL}>Check URL</button>
        </div>

        {/* RESULT */}
        {result && (
          <>
            {/* STATUS */}
            <div className={`result-card ${result.status.toLowerCase()}`}>
              <h3>Overall Result</h3>
              <p className="status">{result.status}</p>
              <p className="score">Risk Score: {result.score}/100</p>
            </div>

            {/* RISK BAR */}
            <div className="risk-card">
              <h3>Risk Level</h3>
              <div className="risk-bar">
                <div
                  className="risk-fill"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* WHY FLAGGED */}
            <div className="flagged-section">
              <h3>🚨 Why was this link flagged?</h3>

              <div className="flagged-grid">
                {result.reasons.length === 0 ? (
                  <div className="flag-card safe">
                    <span>✅</span>
                    <p>No suspicious patterns detected</p>
                  </div>
                ) : (
                  result.reasons.map((r, i) => (
                    <div key={i} className="flag-card danger">
                      <span>⚠️</span>
                      <p>{r}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECURITY ADVICE */}
            <div className="security-section">
              <h3>🛡️ Security Recommendations</h3>

              <div className="security-grid">
                <div className="security-card danger">
                  <span>❌</span>
                  <h4>Avoid entering passwords</h4>
                  <p>Do not enter OTPs, passwords, or card details.</p>
                </div>

                <div className="security-card danger">
                  <span>❌</span>
                  <h4>Avoid login & payments</h4>
                  <p>Do not submit login or payment forms.</p>
                </div>

                <div className="security-card safe">
                  <span>✅</span>
                  <h4>Verify official source</h4>
                  <p>Open the website via the official company page.</p>
                </div>

                <div className="security-card safe">
                  <span>🔐</span>
                  <h4>Enable two-factor authentication</h4>
                  <p>Add an extra layer of protection to accounts.</p>
                </div>

                <div className="security-card safe">
                  <span>🛡️</span>
                  <h4>Use browser protection</h4>
                  <p>Turn on phishing protection in your browser.</p>
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
