const tips = [
  { title: "Avoid Unknown Links", icon: "🚫" },
  { title: "Enable Two-Factor Authentication", icon: "🔐" },
  { title: "Check URLs Carefully", icon: "🔍" },
  { title: "Verify Email Address", icon: "📧" },
  { title: "Be Wary of Urgent Messages", icon: "⚠️" },
  { title: "Keep Software Updated", icon: "🔄" }
];

const SecurityTips = () => (
  <div className="tips-grid">
    {tips.map((t, i) => (
      <div key={i} className="tip-card">
        <span>{t.icon}</span>
        <p>{t.title}</p>
      </div>
    ))}
  </div>
);

export default SecurityTips;
