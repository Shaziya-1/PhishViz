const getRiskLevel = (count) => {
  if (count > 1500) return "high";
  if (count > 700) return "medium";
  return "low";
};

const GeoSnapshot = ({ data }) => {
  /* =========================
     AGGREGATE BY COUNTRY
  ========================= */
  const countryCounts = data.reduce((acc, item) => {
    const country = item.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const total = data.length;

  const geoData = Object.entries(countryCounts)
    .map(([country, count]) => ({
      country,
      count,
      percent: `${((count / total) * 100).toFixed(1)}%`,
      risk: getRiskLevel(count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <div className="card geo-card">
      <h3>Geographic Threat Snapshot</h3>
      <div className="card-icon pink">📍</div>

      <small>Highest regional phishing activity</small>

      <div className="geo-list">
        {geoData.map((item, i) => (
          <div key={i} className="geo-row">
            <div className="geo-left">
              <strong>{item.country}</strong>
              <span>{item.percent}</span>
            </div>

            <div className="geo-right">
              <strong>{item.count.toLocaleString()}</strong>
              <span className={`risk-text ${item.risk}`}>
                {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)} Risk
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="geo-note">
        Note: Geographic data based on IP addresses of detected phishing attempts.
        Actual attacker location may vary.
      </div>
    </div>
  );
};

export default GeoSnapshot;
