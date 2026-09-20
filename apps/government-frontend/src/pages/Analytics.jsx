import { useEffect, useState } from "react";
import { BarChart3, RefreshCw, TrendingUp, Activity } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import MetricCard from "../components/cards/MetricCard";
import AnalyticsCard from "../components/cards/AnalyticsCard";
import SectorDemandChart from "../components/charts/SectorDemandChart";
import SkillGapChart from "../components/charts/SkillGapChart";
import { LoadingState } from "../components/ui/States";

import {
  getHighestSkilledSectors,
  getSkillGap,
} from "../services/governmentApi";

const Analytics = () => {
  const [sectors, setSectors] = useState([]);
  const [skillGap, setSkillGap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);

    try {
      const sectorsData = await getHighestSkilledSectors();
      const gapData = await getSkillGap();

      setSectors(Array.isArray(sectorsData.data) ? sectorsData.data : []);
      setSkillGap(Array.isArray(gapData.data) ? gapData.data : []);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Data Intelligence"
        title="Government Analytics"
        description="Explore sector-level skill distribution and identify gaps between available candidate skills and industry demand."
        icon={BarChart3}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={loadAnalytics}>
            Refresh Analytics
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={BarChart3}
          title="Sector Records"
          value={sectors.length}
          loading={loading}
          tooltipText="Total evaluated industry sectors."
        />
        <MetricCard
          icon={Activity}
          title="Skill Records"
          value={skillGap.length}
          loading={loading}
          tooltipText="Individual tracked skill gap entries."
        />
        <MetricCard
          icon={TrendingUp}
          title="Data Status"
          value={loading ? "Syncing" : "Updated"}
          loading={false}
          tooltipText="Backend database connection status."
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AnalyticsCard
          label="Sector Intelligence"
          title="Highest Skilled Sectors"
          description="Distribution of skilled workforce across different economic sectors."
          tooltipText="Sectors with highest student certification and project participation."
          expandableDetails="This sector distribution provides guidance for targeted government skill development grants."
        >
          {loading ? <LoadingState /> : <SectorDemandChart data={sectors} />}
        </AnalyticsCard>

        <AnalyticsCard
          label="Workforce Analysis"
          title="Skill Gap Analysis"
          description="Comparison between available talent supply and corporate recruitment demand."
          tooltipText="Positive gap indicates industry shortage; negative indicates surplus."
          expandableDetails="Identified skill gaps allow educational institutions to align curriculum directly with industry demand."
        >
          {loading ? <LoadingState /> : <SkillGapChart data={skillGap} />}
        </AnalyticsCard>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;