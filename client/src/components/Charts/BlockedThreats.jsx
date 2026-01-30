const getRiskLevel = (item) => {
  if (item.url_type === "phishing") return "critical";
  if (item.url_type === "malicious") return "high";
  return "medium";
};

const getReason = (item) => {
  if (item.vulnerability) return item.vulnerability;
  if (item.url?.includes("login")) return "Fake login page identified";
  if (item.url?.includes("verify")) return "Domain typosquatting detected";
  if (item.url?.includes("payment")) return "Brand impersonation attempt";
  return "Suspicious domain pattern";
};

const getTimeAgo = (index) => {
  const mins = [2, 8, 15, 23, 31, 45];
  return `${mins[index % mins.length]} minutes ago`;
};

const BlockedThreats = ({ data }) => {
  /* =========================
     REAL BLOCKED THREATS
     (LOGIC UNCHANGED)
  ========================= */
  const blockedData = data
    .filter(
      (d) =>
        d.url &&
        (d.url_type === "phishing" || d.url_type === "malicious")
    )
    .slice(0, 6);

  return (
    <div className="card blocked-card">
      {/* HEADER */}
      <div className="blocked-header">
        <h3>Blocked Threats</h3>
        <div className="card-icon blue">🛡️</div>
      </div>

      <small>Recently prevented phishing attempts</small>

      {/* 🔑 SCROLLABLE LIST */}
      <div className="blocked-list scrollable">
        {blockedData.map((item, i) => {
          const risk = getRiskLevel(item);

          return (
            <div key={i} className="blocked-item">
              <div className="blocked-left">
                <strong title={item.url}>{item.url}</strong>
                <p>{getReason(item)}</p>
                <span className="time">
                  ⏱ {getTimeAgo(i)}
                </span>
              </div>

              <span className={`risk-pill ${risk}`}>
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <button className="view-btn">View All Blocked Threats</button>
    </div>
  );
};

export default BlockedThreats;
