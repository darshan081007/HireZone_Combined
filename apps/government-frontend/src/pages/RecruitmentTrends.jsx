import { useEffect, useState } from "react";
import { ChartNoAxesCombined, Factory } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import { getIndustryDemand } from "../services/governmentApi";

function RecruitmentTrends() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getIndustryDemand();
        setIndustries(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Industry Intelligence"
        title="Recruitment Trends"
        description="Analyse recruitment patterns and changes in hiring activity."
        icon={ChartNoAxesCombined}
      />

      <div className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg md:p-9">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ChartNoAxesCombined size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              Industry Recruitment Demand
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Compare recruitment demand across industries based on current
              hiring activity.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#D5E8DA] bg-white px-6 py-12 text-center text-sm text-[#6B7280] shadow-sm">
          Loading recruitment trends...
        </div>
      ) : industries.length === 0 ? (
        <div className="rounded-2xl border border-[#D5E8DA] bg-white px-6 py-12 text-center text-sm text-[#6B7280] shadow-sm">
          No industry demand data found.
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {industries.slice(0, 3).map((item, index) => {
              const industry =
                item.industry ||
                item.industry_name ||
                item.name ||
                "Unknown Industry";

              const count =
                item.count ??
                item.challenge_count ??
                item.demand_count ??
                0;

              return (
                <div
                  key={`${industry}-${index}`}
                  className="rounded-2xl border border-[#D5E8DA] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
                    <Factory size={21} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Industry
                  </p>

                  <h3 className="mt-2 text-base font-bold text-[#176B3A]">
                    {industry}
                  </h3>

                  <p className="mt-4 text-2xl font-extrabold text-[#176B3A]">
                    {count}
                  </p>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    Recruitment demand
                  </p>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
            <div className="border-b border-[#D5E8DA] px-6 py-5">
              <h2 className="text-lg font-bold text-[#176B3A]">
                Industry Demand
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Recruitment demand grouped by industry.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left">
                <thead className="bg-[#F3F8F4]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                      Industry
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                      Count
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {industries.map((item, index) => {
                    const industry =
                      item.industry ||
                      item.industry_name ||
                      item.name ||
                      "Unknown Industry";

                    const count =
                      item.count ??
                      item.challenge_count ??
                      item.demand_count ??
                      0;

                    return (
                      <tr
                        key={`${industry}-${index}`}
                        className="border-t border-[#E5EEE7] transition-colors hover:bg-[#F8FBF9]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9AD9B1]/30 text-sm font-bold text-[#176B3A]">
                              {index + 1}
                            </div>

                            <span className="text-sm font-semibold text-[#176B3A]">
                              {industry}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-[#9AD9B1]/30 px-3 py-1.5 text-sm font-bold text-[#176B3A]">
                            {count}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default RecruitmentTrends;
