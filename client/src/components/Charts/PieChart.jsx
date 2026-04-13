import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* =========================
   COLORS FOR ALL ATTACKS
========================= */
const COLORS = {
  "Email Phishing": "#22d3ee",
  "URL-based Phishing": "#f59e0b",
  "SMS Scams": "#ef4444",
  "Fake Login Pages": "#8b5cf6",

  Malware: "#10b981",
  Ransomware: "#f43f5e",
  DDoS: "#eab308",
  "SQL Injection": "#6366f1",
  "Man-in-the-Middle": "#14b8a6",

  Other: "#6b7280",
};

/* =========================
   DETECT ATTACK CATEGORY
========================= */
const getAttackCategory = (item) => {
  const type = item.attack_type?.trim();

  // 🔹 Phishing → detailed split
  if (type === "Email") return "Email Phishing";
  if (type === "URL") return "URL-based Phishing";
  if (type === "SMS") return "SMS Scams";
  if (type === "Fake Login") return "Fake Login Pages";

  // 🔹 Other cyber attacks
  if (
    [
      "Malware",
      "Ransomware",
      "DDoS",
      "SQL Injection",
      "Man-in-the-Middle",
    ].includes(type)
  ) {
    return type;
  }

  return "Other";
};

export default function AttackPie({ data, onSelectType }) {
  /* =========================
     SMART DATA HANDLING
  ========================= */
  const isPreAggregated = Array.isArray(data) && data.length > 0 && data[0].value !== undefined;

  const chartData = isPreAggregated
    ? data.map(item => ({ ...item, color: COLORS[item.name] || COLORS.Other }))
    : Object.entries(
        data.reduce((acc, item) => {
          const category = getAttackCategory(item);
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name] || COLORS.Other,
      }));

  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
            onClick={(slice) =>
              onSelectType && onSelectType(slice.name)
            }
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* =========================
          LEGEND (ALL ATTACKS)
      ========================= */}
      <div className="pie-legend">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="pie-row"
            style={{ cursor: "pointer" }}
            onClick={() =>
              onSelectType && onSelectType(item.name)
            }
          >
            <span
              className="dot"
              style={{ background: item.color }}
            />
            <div>
              <strong>{item.name}</strong>
              <p>{item.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
