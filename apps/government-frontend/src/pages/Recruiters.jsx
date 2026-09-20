import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getRecruiters } from "../services/governmentApi";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");

        const res = await getRecruiters();

        setRecruiters(
          Array.isArray(res.data) ? res.data : []
        );
      } catch (err) {
        console.error("Recruiters fetch error:", err);
        setError("Failed to load recruiters.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Industry Engagement"
        title="Recruiters Directory"
        description="Monitor verified corporate partners, hiring activity, and industrial workforce demand."
        icon={Users}
      />

      {/* Hero Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Users size={26} />
            </div>

            <h2 className="text-2xl font-extrabold">
              Recruiters Intelligence
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Track active hiring partners, corporate skill demands,
              hiring participation, and workforce requirements across
              industries.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5">
            <p className="text-xs text-white/80">
              Module Status
            </p>

            <Badge
              tone="success"
              className="mt-2 bg-white text-[#176B3A]"
            >
              Active & Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link to="/demand-skills">
          <InfoCard
            icon={<Building2 size={21} />}
            title="Industry Partners"
            description="Review registered corporate employers and recruitment agencies."
          />
        </Link>

        <Link to="/hiring-activity">
          <InfoCard
            icon={<BriefcaseBusiness size={21} />}
            title="Hiring Activity"
            description="Monitor real-time candidate connections and placement drives."
          />
        </Link>

        <Link to="/recruitment-trends">
          <InfoCard
            icon={<ChartNoAxesCombined size={21} />}
            title="Industry Demand"
            description="Explore skill demand trends and required competencies."
          />
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Recruiter Table */}
      <div className="surface-card overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b border-[#D5E8DA] px-6 py-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#176B3A]">
                Registered Recruiters
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Verified companies and organizations participating in
                the recruitment ecosystem.
              </p>
            </div>

            {!loading && (
              <div className="rounded-full bg-[#9AD9B1]/30 px-4 py-2 text-xs font-bold text-[#176B3A]">
                {recruiters.length}{" "}
                {recruiters.length === 1
                  ? "Recruiter"
                  : "Recruiters"}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-[#F3F8F4]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Company
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Industry
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Location
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    Loading recruiters...
                  </td>
                </tr>
              ) : recruiters.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No recruiters found.
                  </td>
                </tr>
              ) : (
                recruiters.map((r, index) => (
                  <tr
                    key={
                      r.recruiter_id ||
                      r.id ||
                      index
                    }
                    className="border-t border-[#E5EEE7] transition-colors hover:bg-[#F8FBF9]"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-[#176B3A]">
                      {r.company_name ||
                        r.company ||
                        r.organization_name ||
                        "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4B5563]">
                      {r.industry || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4B5563]">
                      {r.location ||
                        r.city ||
                        r.region ||
                        "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoCard = ({ icon, title, description }) => (
  <div className="card-hover-elevation surface-card rounded-2xl border border-[#D5E8DA] bg-white p-6 transition-all duration-200 hover:shadow-lg">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
      {icon}
    </div>

    <h3 className="text-base font-bold text-[#176B3A]">
      {title}
    </h3>

    <p className="mt-2 text-xs leading-5 text-[#6B7280]">
      {description}
    </p>

    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#176B3A]">
      Explore <ArrowUpRight size={14} />
    </div>
  </div>
);

export default Recruiters;
