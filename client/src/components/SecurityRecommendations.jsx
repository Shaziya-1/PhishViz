const SecurityRecommendations = () => {
  return (
    <div className="security-section card">
      <h3>Security Recommendations</h3>
      <p className="section-subtitle">
        Simple steps to protect yourself from phishing attacks
      </p>

      <div className="security-grid">
        <div className="security-card">
          <div className="sec-icon red">🚫</div>
          <h4>Avoid Unknown Links</h4>
          <p>
            Never click on links from unknown senders or suspicious emails.
            Always verify the sender before interacting.
          </p>
        </div>

        <div className="security-card">
          <div className="sec-icon red">🔒</div>
          <h4>Enable Two-Factor Authentication</h4>
          <p>
            Add an extra layer of security to your accounts by enabling 2FA
            wherever possible.
          </p>
        </div>

        <div className="security-card">
          <div className="sec-icon red">👁️</div>
          <h4>Check URLs Carefully</h4>
          <p>
            Look for typos, unusual domains, or missing HTTPS.
            Legitimate sites use secure connections.
          </p>
        </div>

        <div className="security-card">
          <div className="sec-icon blue">📧</div>
          <h4>Verify Email Addresses</h4>
          <p>
            Check the sender’s email address carefully.
            Phishers often use addresses that look similar to legitimate ones.
          </p>
        </div>

        <div className="security-card">
          <div className="sec-icon blue">📱</div>
          <h4>Be Wary of Urgent Messages</h4>
          <p>
            Phishing attempts often create a sense of urgency.
            Take time to verify before taking action.
          </p>
        </div>

        <div className="security-card">
          <div className="sec-icon blue">🛡️</div>
          <h4>Keep Software Updated</h4>
          <p>
            Regularly update your browser, operating system,
            and security software to protect against new threats.
          </p>
        </div>
      </div>

      <div className="security-note">
        🛡️ <strong>Stay Informed & Protected</strong><br />
        PhishViz continuously monitors and blocks phishing threats in real-time.
        However, your awareness is the first line of defense.
        If something feels suspicious, trust your instincts and verify before clicking.
      </div>
    </div>
  );
};

export default SecurityRecommendations;
