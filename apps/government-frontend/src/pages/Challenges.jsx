import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Trophy,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import { getChallenges } from "../services/governmentApi";

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getChallenges();
        setChallenges(res.data || []);
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
        title="Sponsored Challenges"
        description="Explore industry-sponsored challenges and participation activity."
        icon={Trophy}
      />

      <div className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg md:p-9">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Trophy size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              Industry-Sponsored Challenges
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Explore active and completed challenges sponsored by recruiters
              and industry partners.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b border-[#D5E8DA] px-6 py-5">
          <h2 className="text-lg font-bold text-[#176B3A]">
            Sponsored Challenges
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            View challenge details, sponsoring recruiters, dates, and current
            status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#F3F8F4]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Challenge
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Recruiter ID
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Start Date
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  End Date
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#176B3A]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    Loading challenges...
                  </td>
                </tr>
              ) : challenges.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No sponsored challenges found.
                  </td>
                </tr>
              ) : (
                challenges.map((challenge, index) => {
                  const challengeName =
                    challenge.challenge_name ||
                    challenge.name ||
                    "Unnamed Challenge";

                  const recruiterId =
                    challenge.recruiter_id ??
                    challenge.recruiterId ??
                    "-";

                  const startDate =
                    challenge.start_date ||
                    challenge.startDate ||
                    "-";

                  const endDate =
                    challenge.end_date ||
                    challenge.endDate ||
                    "-";

                  const status = challenge.status || "Unknown";

                  return (
                    <tr
                      key={challenge.challenge_id || challenge.id || index}
                      className="border-t border-[#E5EEE7] transition-colors hover:bg-[#F8FBF9]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9AD9B1]/30 text-[#176B3A]">
                            <Trophy size={17} />
                          </div>

                          <span className="text-sm font-semibold text-[#176B3A]">
                            {challengeName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-[#4B5563]">
                        {recruiterId}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                          <CalendarDays size={16} className="text-[#176B3A]" />
                          {startDate}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                          <CalendarDays size={16} className="text-[#176B3A]" />
                          {endDate}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            status.toLowerCase() === "active"
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : status.toLowerCase() === "completed"
                                ? "bg-[#E0E7FF] text-[#3730A3]"
                                : "bg-[#F3F4F6] text-[#4B5563]"
                          }`}
                        >
                          {status.toLowerCase() === "active" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <CircleDot size={14} />
                          )}

                          {status}
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

export default Challenges;
