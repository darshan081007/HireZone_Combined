import { BriefcaseBusiness, Building2, MapPin, ArrowUpRight } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";

const GovernmentJobs = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Employment Opportunities"
        title="Government Jobs"
        description="Explore government employment listings and public-sector recruitment information."
        icon={BriefcaseBusiness}
      />

      <div className="mb-8 overflow-hidden rounded-2xl bg-[#176B3A] p-7 text-white shadow-lg md:p-9 border border-[#9AD9B1]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <BriefcaseBusiness size={26} />
            </div>

            <h2 className="text-2xl font-extrabold">Government Jobs Module</h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Manage and monitor employment listings published by government departments, public sector undertakings, and national skill schemes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5">
            <p className="text-xs text-white/80">Module Status</p>
            <Badge tone="success" className="mt-2 bg-white text-[#176B3A]">
              Active & Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <InfoCard
          icon={<Building2 size={21} />}
          title="Departments"
          description="View participating public sector ministries and departments."
        />

        <InfoCard
          icon={<MapPin size={21} />}
          title="Locations"
          description="Filter open opportunities across states and regional hubs."
        />

        <InfoCard
          icon={<BriefcaseBusiness size={21} />}
          title="Job Listings"
          description="Access live government position circulars and notifications."
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

export default GovernmentJobs;