import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { time: "00:00", attacks: 48 },
  { time: "03:00", attacks: 32 },
  { time: "06:00", attacks: 58 },
  { time: "09:00", attacks: 123 },
  { time: "12:00", attacks: 156 },
  { time: "15:00", attacks: 201 },
  { time: "18:00", attacks: 167 },
  { time: "21:00", attacks: 89 }
];

const HourlyAttackChart = () => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="time" stroke="#9aa4bf" />
        <YAxis stroke="#9aa4bf" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="attacks"
          stroke="#22d3ee"
          strokeWidth={3}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyAttackChart;
