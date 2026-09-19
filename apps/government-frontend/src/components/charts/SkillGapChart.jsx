import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { EmptyState } from "../ui/States";

const SkillGapChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No skill-gap data available"
        description="A comparison of available vs. demanded skills will appear here once data is returned by the backend."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#E6E9F2" vertical={false} />
        <XAxis
          dataKey="skill_name"
          tick={{ fontSize: 12, fill: "#5B6472" }}
          axisLine={{ stroke: "#E6E9F2" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#5B6472" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E6E9F2",
            boxShadow: "0 8px 24px -12px rgba(15,31,61,0.18)",
          }}
        />
        <Bar dataKey="gap" fill="#B3413C" radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SkillGapChart;
