import {
  Users,
  Building2,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ArrowUpRight,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";

const Recruiters = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Industry Engagement"
        title="Recruiters Directory"
        description="Monitor verified corporate partners, hiring activity, and industrial workforce demand."
        icon={Users}
      />

      <div className="mb-8 overflow-hidden rounded-2xl bg-[#176B3A] p-7 text-white shadow-lg md:p-9 border border-[#9AD9B1]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Users size={26} />
            </div>

            <h2 className="text-2xl font-extrabold">Recruiters Intelligence</h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Track active hiring partners, corporate skill demands, and national drive participation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5">
            <p className="text-xs text-white/80">Module Status</p>
            <Badge tone="success" className="mt-2 bg-white text-[#176B3A]">
              Active & Verified
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <InfoCard
          icon={<Building2 size={21} />}
          title="Industry Partners"
          description="Review registered corporate employers and recruitment agencies."
        />

        <InfoCard
          icon={<BriefcaseBusiness size={21} />}
          title="Hiring Activity"
          description="Monitor real-time candidate connections and placement drives."
        />

        <InfoCard
          icon={<ChartNoAxesCombined size={21} />}
          title="Industry Demand"
          description="Explore skill demand trends and required competencies."
        />
      </div>
    </DashboardLayout>
  );
};

const InfoCard = ({ icon, title, description }) => (
  <div className="card-hover-elevation surface-card rounded-2xl border border-[#D5E8DA] bg-white p-6">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
      {icon}
    </div>

    <h3 className="text-base font-bold text-[#176B3A]">{title}</h3>

    <p className="mt-2 text-xs leading-5 text-[#6B7280]">{description}</p>

    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#176B3A]">
      Explore <ArrowUpRight size={14} />
    </div>
  </div>
);

export default Recruiters;