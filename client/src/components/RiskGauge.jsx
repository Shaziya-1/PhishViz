const RiskGauge = ({ score }) => {
  const angle = (score / 100) * 180;

  return (
    <div className="gauge">
      <div className="semi-circle">
        <div
          className="needle"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
      </div>
      <p>{score}/100</p>
    </div>
  );
};

export default RiskGauge;
