import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import { getCompanyDemand } from "../services/governmentApi";

function HiringActivity() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCompanyDemand();
        setCompanies(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Recruitment Intelligence"
        title="Hiring Activity"
        description="Monitor recruiter activity, candidate connections, and hiring trends."
        icon={BriefcaseBusiness}
      />

      <div className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg md:p-9">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <BriefcaseBusiness size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              Company Hiring Demand
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Track company-level recruitment demand and identify employers
              with active hiring requirements.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b border-[#D5E8DA] px-6 py-5">
          <h2 className="text-lg font-bold text-[#176B3A]">
            Company Demand
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            Companies grouped by their current recruitment demand.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left">
            <thead className="bg-[#F3F8F4]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Company
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Challenge Count
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    Loading hiring activity...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No company demand data found.
                  </td>
                </tr>
              ) : (
                companies.map((company, index) => {
                  const companyName =
                    company.company_name ||
                    company.name ||
                    company.company ||
                    "Unknown Company";

                  const challengeCount =
                    company.challenge_count ??
                    company.count ??
                    company.challenges ??
                    company.demand_count ??
                    0;

                  return (
                    <tr
                      key={`${companyName}-${index}`}
                      className="border-t border-[#E5EEE7] transition-colors hover:bg-[#F8FBF9]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
                            <Building2 size={18} />
                          </div>

                          <span className="text-sm font-semibold text-[#176B3A]">
                            {companyName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-[#9AD9B1]/30 px-3 py-1.5 text-sm font-bold text-[#176B3A]">
                          {challengeCount}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default HiringActivity;
