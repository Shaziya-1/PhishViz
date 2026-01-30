const StatCard = ({ title, value, change, icon, color }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>

      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{change}</span>
      </div>
    </div>
  );
};

export default StatCard;
