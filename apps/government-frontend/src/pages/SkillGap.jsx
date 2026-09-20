{/*
  
import { useEffect, useState } from "react";
import { BarChart3, RefreshCw, TrendingUp, Users } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import MetricCard from "../components/cards/MetricCard";
import Badge from "../components/ui/Badge";
import Tooltip from "../components/ui/Tooltip";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/States";
import { getSkillGap } from "../services/governmentApi";

const API_URL = "http://localhost:8000";

function SkillGap() {
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkillGapData = async () => {
    try {
      setLoading(true);
      setError("");



      const response = await getSkillGap();


      const data = response.data;

      const result = Array.isArray(data)
        ? data
        : data.skill_gaps || data.data || [];

setSkillGaps(result);

      setSkillGaps(result);
    } catch (err) {
      console.error("Skill gap error:", err);
      setError("Unable to load skill-gap analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGapData();
  }, []);

  const getStudentCount = (item) =>
    Number(
      item.student_count ??
        item.students ??
        item.available ??
        item.student_total ??
        0
    );

  const getDemandCount = (item) =>
    Number(
      item.demand_count ??
        item.demand ??
        item.required ??
        item.industry_demand ??
        0
    );

  const getSkillGap = (item) => {
    const explicitGap = item.gap ?? item.skill_gap ?? item.difference ?? null;

    if (explicitGap !== null) {
      return Number(explicitGap);
    }

    return getDemandCount(item) - getStudentCount(item);
  };

  const skillsWithDemand = skillGaps.filter(
    (item) =>
      item.demand_count !== undefined ||
      item.demand !== undefined ||
      item.required !== undefined ||
      item.industry_demand !== undefined
  ).length;

  const identifiedGaps = skillGaps.filter((item) => getSkillGap(item) > 0)
    .length;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Government Intelligence"
        title="Skill Gap Analysis"
        description="Identify differences between available student skills and industry-demanded skills to guide workforce intervention."
        icon={BarChart3}
      />

      {/* Summary cards */}{/*
      <section className="mb-8 grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={Users}
          title="Skills Analysed"
          description="Tracked competencies"
          value={skillGaps.length}
          loading={loading}
          tooltipText="Total unique skill categories tracked."
        />
        <MetricCard
          icon={TrendingUp}
          title="Skills With Demand Data"
          description="Industry benchmarked"
          value={skillsWithDemand}
          loading={loading}
          tooltipText="Skills with explicit recruiter demand records."
        />
        <MetricCard
          icon={BarChart3}
          title="Potential Skill Gaps"
          description="Action required"
          value={identifiedGaps}
          loading={loading}
          tooltipText="Skills where market demand exceeds candidate availability."
        />
      </section>

      {/* Skill gap table */}{/*
      <section className="card-hover-elevation surface-card rounded-2xl border border-[#D5E8DA] bg-white p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#176B3A] flex items-center gap-2">
              Skill Gap Breakdown
              <Tooltip text="Comparison between registered student count and active employer demand count." />
            </h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              Detailed metric table of talent availability versus employer demand.
            </p>
          </div>

          <Button variant="secondary" icon={RefreshCw} onClick={fetchSkillGapData}>
            Refresh Table
          </Button>
        </div>

        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState message={error} onRetry={fetchSkillGapData} />
        )}

        {!loading && !error && skillGaps.length === 0 && (
          <EmptyState
            title="No skill-gap data available"
            description="Skill gap analysis will appear here once data is returned by the backend."
          />
        )}

        {!loading && !error && skillGaps.length > 0 && (
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D5E8DA] bg-[#F3FBF5] text-xs uppercase tracking-wider text-[#7A5535]">
                  <th className="px-4 py-3.5 font-bold">Skill Name</th>
                  <th className="px-4 py-3.5 font-bold">Student Count</th>
                  <th className="px-4 py-3.5 font-bold">Demand Count</th>
                  <th className="px-4 py-3.5 font-bold">Skill Gap</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                </tr>
              </thead>

              <tbody>
                {skillGaps.map((item, index) => {
                  const skillName =
                    item.skill_name || item.skill || item.name || `Skill ${index + 1}`;

                  const studentCount = getStudentCount(item);
                  const demandCount = getDemandCount(item);
                  const gap = getSkillGap(item);

                  return (
                    <tr
                      key={`${skillName}-${index}`}
                      className="border-b border-[#D5E8DA] transition-colors hover:bg-[#9AD9B1]/10 text-sm"
                    >
                      <td className="px-4 py-3.5 font-bold text-[#176B3A]">
                        {skillName}
                      </td>
                      <td className="px-4 py-3.5 text-[#24352A] font-medium">{studentCount}</td>
                      <td className="px-4 py-3.5 text-[#24352A] font-medium">{demandCount}</td>
                      <td
                        className={`px-4 py-3.5 font-extrabold ${
                          gap > 0 ? "text-rose-700" : "text-[#2E8B57]"
                        }`}
                      >
                        {gap > 0 ? `+${gap}` : gap}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={gap > 0 ? "danger" : "success"}>
                          {gap > 0 ? "Gap Identified" : "Balanced"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default SkillGap;


*/}


import DashboardLayout from "../components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SkillGap() {
  const data = [
    { skill: "AI", gap: 85 },
    { skill: "Cloud", gap: 70 },
    { skill: "Cybersecurity", gap: 65 },
    { skill: "Data Science", gap: 60 },
    { skill: "IoT", gap: 45 },
  ];

  return (
    <DashboardLayout>
      <div className="surface-card rounded-2xl bg-white p-6">
        <h1 className="mb-6 text-2xl font-bold text-[#176B3A]">
          Skill Gap Analysis
        </h1>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="gap"
                stroke="#176B3A"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SkillGap;