import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HourlyAttackChart from "../components/Charts/HourlyAttackChart";
import "../attack-analysis.css";


const AttackAnalysis = () => {
  return (
    <>
      <Navbar />

      <div className="page attack-analysis">

        {/* HEADER */}
        <div className="page-header">
          <h1>Attack Analysis</h1>
          <p>Detailed breakdown of phishing attack patterns and trends</p>
        </div>

        {/* TOP STATS */}
        <div className="analysis-stats">

          <div className="analysis-card">
            <div className="card-icon blue">📈</div>
            <span className="label">Attack Trend</span>
            <h2>+47%</h2>
            <small className="positive">↑ Increase from last week</small>
          </div>

          <div className="analysis-card">
            <div className="card-icon purple">🎯</div>
            <span className="label">Top Target Sector</span>
            <h2>Finance</h2>
            <small className="accent">38% of all attacks</small>
          </div>

          <div className="analysis-card">
            <div className="card-icon orange">⚡</div>
            <span className="label">Peak Activity Time</span>
            <h2>3:00 PM</h2>
            <small className="warning">Average daily peak</small>
          </div>

        </div>

        {/* HOURLY ATTACK PATTERN */}
        <div className="card large">
          <h3>Hourly Attack Pattern</h3>
          <p className="sub">Attack frequency throughout the day</p>
          <HourlyAttackChart />
        </div>

        {/* ATTACK VECTORS */}
        <div className="card attack-vectors">
  <h3>Attack Vectors</h3>
  <p className="muted">Distribution by communication channel</p>

  <div className="vector-row">
    <div className="vector-left">
      <span className="vector-icon email">📧</span>
      <span>Email</span>
    </div>

    <div className="vector-bar">
      <div className="bar-fill email" style={{ width: "85%" }} />
    </div>

    <div className="vector-right">
      <strong>4,247</strong>
      <span className="change up">+18%</span>
    </div>
  </div>

  <div className="vector-row">
    <div className="vector-left">
      <span className="vector-icon sms">📩</span>
      <span>SMS</span>
    </div>

    <div className="vector-bar">
      <div className="bar-fill sms" style={{ width: "55%" }} />
    </div>

    <div className="vector-right">
      <strong>1,592</strong>
      <span className="change up">+34%</span>
    </div>
  </div>

  <div className="vector-row">
    <div className="vector-left">
      <span className="vector-icon social">🌐</span>
      <span>Social Media</span>
    </div>

    <div className="vector-bar">
      <div className="bar-fill social" style={{ width: "35%" }} />
    </div>

    <div className="vector-right">
      <strong>987</strong>
      <span className="change up">+12%</span>
    </div>
  </div>

  <div className="vector-row">
    <div className="vector-left">
      <span className="vector-icon chat">💬</span>
      <span>Messaging Apps</span>
    </div>

    <div className="vector-bar">
      <div className="bar-fill chat" style={{ width: "25%" }} />
    </div>

    <div className="vector-right">
      <strong>634</strong>
      <span className="change up">+67%</span>
    </div>
  </div>
</div>
      </div>

      <Footer />
    </>
  );
};

export default AttackAnalysis;
