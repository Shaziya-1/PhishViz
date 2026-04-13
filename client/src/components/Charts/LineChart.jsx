import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TimelineChart({ data = [] }) {
  /* =========================
     SMART DATA HANDLING
  ========================= */
  // If data already looks like {year, threats, blocked}, use it directly
  const isPreAggregated = data.length > 0 && data[0].threats !== undefined;

  const timelineData = isPreAggregated
    ? data
    : Object.values(
        data.reduce((acc, item) => {
          const year = item.year || "Unknown";
          if (!acc[year]) acc[year] = { year, threats: 0, blocked: 0 };
          acc[year].threats += 1;
          if (item.defense_mechanism && item.defense_mechanism !== "None") {
            acc[year].blocked += 1;
          }
          return acc;
        }, {})
      ).sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={timelineData}>
        <CartesianGrid stroke="#1f2a44" strokeDasharray="3 3" />

        <XAxis dataKey="year" stroke="#9aa4bf" />
        <YAxis stroke="#9aa4bf" />

        <Tooltip
          contentStyle={{
            background: "#020617",
            border: "1px solid #1f2a44",
            borderRadius: "10px",
            color: "#fff",
          }}
          labelStyle={{ color: "#fff" }}
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ color: "#9aa4bf" }}
        />

        <Line
          type="monotone"
          dataKey="threats"
          stroke="#ff5252"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Threats Detected"
        />

        <Line
          type="monotone"
          dataKey="blocked"
          stroke="#22d3ee"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Blocked"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
