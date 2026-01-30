import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../geomap.css";
import GeoThreatMap from "../components/GeoThreatMap";
import usePhishData from "../hooks/usePhishData";

const GeoMap = () => {
  const { data, loading, error } = usePhishData();

  if (loading) return <p style={{ padding: 24 }}>Loading Geo Map...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;

  /* =========================
     COUNTRY-WISE COUNT (REAL)
  ========================= */
  const countryCounts = {};
  data.forEach(d => {
    if (!d.country) return;
    countryCounts[d.country] = (countryCounts[d.country] || 0) + 1;
  });

  const countriesAffected = Object.keys(countryCounts).length;

  /* =========================
     BALANCED RISK LOGIC (REAL)
  ========================= */
  let critical = 0, high = 0, medium = 0, low = 0;

  data.forEach(d => {
    const users = d.affected_users || 0;

    if (users >= 3000) critical++;
    else if (users >= 1500) high++;
    else if (users >= 500) medium++;
    else low++;
  });

  /* =========================
     TOP COUNTRIES (REAL)
  ========================= */
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <>
      <Navbar />

      <div className="geo-page">
        {/* ===== PAGE HEADER ===== */}
        <h1 className="geo-title">Geographic Threat Map</h1>
        <p className="geo-sub">
          Global distribution of phishing attacks and threat origins
        </p>

        {/* ===== HERO SECTION ===== */}
        <div className="geo-hero card">
          {/* LEFT STATS */}
          <div className="geo-hero-left">
            <span className="geo-badge">🌍 Global Impact</span>

            <h2 className="geo-big">{countriesAffected}</h2>
            <p className="geo-desc">Countries Affected Worldwide</p>

            <div className="geo-risk-row">
              <div className="geo-risk critical">
                <span>Critical</span>
                <strong>{critical}</strong>
              </div>

              <div className="geo-risk high">
                <span>High Risk</span>
                <strong>{high}</strong>
              </div>

              <div className="geo-risk medium">
                <span>Medium</span>
                <strong>{medium}</strong>
              </div>

              <div className="geo-risk low">
                <span>Low Risk</span>
                <strong>{low}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT MAP */}
          <div className="geo-hero-right">
            <GeoThreatMap data={countryCounts} />

            {/* MAP LEGEND */}
            <div className="geo-legend">
              <div><span className="dot red"></span> Critical</div>
              <div><span className="dot yellow"></span> High</div>
              <div><span className="dot green"></span> Medium</div>
              <div><span className="dot blue"></span> Low</div>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="card geo-table-card">
          <div className="card-header">
            <div>
              <h3>Top Threat Locations</h3>
              <p className="muted">
                Countries with highest phishing activity
              </p>
            </div>
            <span className="alert-icon">⚠️</span>
          </div>

          <table className="geo-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Country</th>
                <th>Threat Level</th>
                <th className="right">Threats</th>
              </tr>
            </thead>
            <tbody>
  {topCountries.map(([country, count], i) => {
    let level = "Medium";
    if (i === 0) level = "Critical";
    else if (i <= 2) level = "High";

    return (
      <tr key={country}>
        <td>{i + 1}</td>
        <td>{country}</td>
        <td>
          <span className={`risk-text ${level.toLowerCase()}`}>
            {level}
          </span>
        </td>
        <td className="right strong">
          {count.toLocaleString()}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>

        {/* ===== INFO NOTE ===== */}
        <div className="geo-note">
          <strong>About Geographic Data</strong>
          <p>
            Geographic analysis is performed at country level using phishing
            incident records from the dataset. Exact city or IP-level locations
            are not available and are therefore not displayed.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GeoMap;
