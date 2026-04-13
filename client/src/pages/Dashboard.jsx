import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner";
import StatCard from "../components/StatCard";
import TimelineChart from "../components/Charts/LineChart";
import AttackPie from "../components/Charts/PieChart";
import BlockedThreats from "../components/Charts/BlockedThreats";
import GeoSnapshot from "../components/Charts/GeoSnapshot";
import SecurityRecommendations from "../components/SecurityRecommendations";

import usePhishData from "../hooks/usePhishData";

const Dashboard = () => {
  const { data: stats, loading, error } = usePhishData();
  const [selectedType, setSelectedType] = useState("ALL");

  if (loading) return <p style={{ padding: "2rem" }}>Loading Dashboard...</p>;
  if (error) return <p style={{ padding: "2rem" }}>{error}</p>;

  const totalThreats = stats?.totalThreats || 0;
  const highRiskURLs = stats?.highRiskURLs || 0;
  const blockedAttempts = stats?.blockedAttempts || 0;
  const activeAlerts = stats?.activeAlerts || 0;

  /* =========================
     CHARTS DATA (FROM BACKEND)
  ========================= */
  const timelineData = stats?.timelineData || [];
  const attackDistribution = stats?.attackDistribution || [];
  
  // URL Heatmap Logic (Static sample or from stats if added later)
  const heatmapData = [
    { url: "phish-login-verify.com", attempts: 1420, risk: "critical", label: "Critical 9.5/10" },
    { url: "secure-bank-update.net", attempts: 980, risk: "high", label: "High 8.2/10" },
    { url: "account-support-portal.org", attempts: 450, risk: "medium", label: "Medium 5.4/10" },
  ];

  return (
    <>
      <Navbar />
      <AlertBanner />

      <div className="dashboard">

        {/* =========================
            STATS CARDS
        ========================= */}
        <div className="stats-grid">
          <StatCard
            title="Total Phishing Threats"
            value={totalThreats}
            change="+ live"
            icon="🛡️"
            color="blue"
          />
          <StatCard
            title="High Risk URLs"
            value={highRiskURLs}
            change="+ live"
            icon="🚨"
            color="red"
          />
          <StatCard
            title="Blocked Attempts"
            value={blockedAttempts}
            change="+ live"
            icon="⛔"
            color="orange"
          />
          <StatCard
            title="Active Alerts"
            value={activeAlerts}
            change="+ live"
            icon="🔔"
            color="yellow"
          />
        </div>

        {/* =========================
            CHARTS
        ========================= */}
        <div className="grid-2">
          <div className="card">
            <h3>Phishing Activity Timeline</h3>
            <TimelineChart data={timelineData} />
          </div>

          <div className="card">
            <h3>Attack Type Distribution</h3>
            <AttackPie
              data={attackDistribution}
              onSelectType={setSelectedType}
            />

            {/* OPTIONAL RESET */}
            {selectedType !== "ALL" && (
              <button
                style={{
                  marginTop: "10px",
                  background: "transparent",
                  border: "1px solid #22d3ee",
                  color: "#22d3ee",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedType("ALL")}
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* =========================
            URL RISK HEATMAP
        ========================= */}
        <div className="card">
          <h3>URL Risk Heatmap</h3>
          <small>Visual representation of malicious URL patterns</small>

          {heatmapData.map((item, i) => (
            <div key={i} className={`heat-row ${item.risk}`}>
              <div className="heat-left">
                <div className={`risk-box ${item.risk}`} />
                <div>
                  <strong>{item.url}</strong>
                  <p>{item.attempts} attempts detected</p>
                </div>
              </div>

              <div className={`risk-badge ${item.risk}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            BOTTOM SECTION
        ========================= */}
        <div className="grid-2">
          <BlockedThreats data={stats?.recentThreats || []} />
          <GeoSnapshot data={stats?.geoDistribution || {}} />
        </div>

        <SecurityRecommendations />
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
