import { useEffect, useState } from "react";
import { ChartNoAxesCombined, TrendingUp } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import { getRecruiterTopSkills } from "../services/governmentApi";

function DemandSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getRecruiterTopSkills();
        setSkills(res.data || []);
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
        title="Demand Skills"
        description="Analyse the skills currently requested by recruiters and industries."
        icon={ChartNoAxesCombined}
      />

      <div className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg md:p-9">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <TrendingUp size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              Recruiter Skill Demand
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Explore the skills most frequently requested by recruiters
              across participating industries.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b border-[#D5E8DA] px-6 py-5">
          <h2 className="text-lg font-bold text-[#176B3A]">
            Top In-Demand Skills
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            Skills ranked by the number of recruiter requests.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead className="bg-[#F3F8F4]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Skill
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Recruiter Requests
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
                    Loading skill demand...
                  </td>
                </tr>
              ) : skills.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No skill demand data found.
                  </td>
                </tr>
              ) : (
                skills.map((skill, index) => (
                  <tr
                    key={`${skill.skill_name}-${index}`}
                    className="border-t border-[#E5EEE7] transition-colors hover:bg-[#F8FBF9]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9AD9B1]/30 text-sm font-bold text-[#176B3A]">
                          {index + 1}
                        </div>

                        <span className="text-sm font-semibold text-[#176B3A]">
                          {skill.skill_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#9AD9B1]/30 px-3 py-1.5 text-sm font-bold text-[#176B3A]">
                        {skill.count}
                      </span>
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
}

export default DemandSkills;
