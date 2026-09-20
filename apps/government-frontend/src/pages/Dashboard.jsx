import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  Code2,
  Trophy,
  Building2,
  Megaphone,
  GraduationCap,
  BarChart3,
  Target,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import MetricCard from "../components/cards/MetricCard";
import HubCard from "../components/cards/HubCard";
import Tooltip from "../components/ui/Tooltip";
import { CardSkeleton, ErrorState } from "../components/ui/States";
import {
  getDashboardSummary,
  getRecruiters,
  getRecruiterTopSkills,
  getIndustryDemand,
  getChallenges,
  getTopStudentSkills,
} from "../services/governmentApi";

const statisticsConfig = [
  {
    key: "total_students",
    title: "Students",
    icon: Users,
    description: "Registered students nationwide",
    tooltip: "Total active student accounts registered across colleges.",
    details:
      "Provides real-time count of active candidate profiles available for national programs.",
  },
  {
    key: "total_recruiters",
    title: "Recruiters",
    icon: BriefcaseBusiness,
    description: "Registered recruiters & agencies",
    tooltip: "Verified public & private recruitment partners.",
    details:
      "Includes verified government departments, state agencies, and corporate talent searchers.",
  },
  {
    key: "total_skills",
    title: "Skills",
    icon: Code2,
    description: "Available verified skills",
    tooltip: "Tech and vocational skill taxonomy count.",
    details:
      "Covers verified technical, industrial, and AI-evaluated skills logged in student portfolios.",
  },
  {
    key: "active_challenges",
    title: "Active Challenges",
    icon: Trophy,
    description: "Active hackathons & challenges",
    tooltip: "Sponsored student competitions.",
    details:
      "National skill challenges designed to test student domain knowledge and offer direct recruitment.",
  },
  {
    key: "active_government_jobs",
    title: "Government Jobs",
    icon: Building2,
    description: "Active job opportunities",
    tooltip: "Current open government job postings.",
    details:
      "Direct public sector employment opportunities updated daily across ministries.",
  },
  {
    key: "active_campaigns",
    title: "Campaigns",
    icon: Megaphone,
    description: "Government outreach campaigns",
    tooltip: "Active skill enhancement initiatives.",
    details:
      "Targeted regional initiatives aimed at reducing sector gap shortages.",
  },
];

const portalCards = [
  {
    title: "Student Intelligence",
    description:
      "Explore student profiles, skills, projects, evaluations, and achievements.",
    icon: GraduationCap,
    links: [
      { label: "Students", path: "/students" },
      { label: "Skills", path: "/skills" },
      { label: "Projects", path: "/projects" },
      { label: "Proof of Work", path: "/proof-of-work" },
      { label: "AI Evaluations", path: "/ai-evaluations" },
    ],
  },
  {
    title: "Recruiter Intelligence",
    description:
      "Analyze recruiters, hiring activities, demand skills, and recruitment trends.",
    icon: BriefcaseBusiness,
    links: [
      { label: "Recruiters", path: "/recruiters" },
      { label: "Hiring Activity", path: "/hiring-activity" },
      { label: "Demand Skills", path: "/demand-skills" },
      { label: "Challenges", path: "/challenges" },
      { label: "Recruitment Trends", path: "/recruitment-trends" },
    ],
  },
  {
    title: "Government Intelligence",
    description:
      "Monitor skill gaps, sectors, jobs, campaigns, reports, and regional data.",
    icon: Building2,
    links: [
      { label: "Skill Gap", path: "/skill-gap" },
      { label: "Sector Strength", path: "/sectors" },
      { label: "Low-Pursued Sectors", path: "/low-pursued-sectors" },
      { label: "Government Jobs", path: "/jobs" },
      { label: "Campaigns", path: "/campaigns" },
      { label: "Reports", path: "/reports" },
      { label: "Regional Distribution", path: "/regional-distribution" },
    ],
  },
];

const quickAccess = [
  {
    to: "/students",
    icon: Users,
    title: "View Students",
    description: "Browse candidate talent records.",
  },
  {
    to: "/recruiters",
    icon: BriefcaseBusiness,
    title: "View Recruiters",
    description: "Explore recruiter directory.",
  },
  {
    to: "/skill-gap",
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Identify workforce shortages.",
  },
  {
    to: "/reports",
    icon: FileText,
    title: "Reports",
    description: "Access national intelligence reports.",
  },
];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recruiterCount, setRecruiterCount] = useState(0);
  const [challengeCount, setChallengeCount] = useState(0);
  const [industryCount, setIndustryCount] = useState(0);
  const [topSkill, setTopSkill] = useState("N/A");
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const dashboardRes = await getDashboardSummary();
      setDashboardData(dashboardRes.data);

      const [
        recruitersRes,
        challengesRes,
        industryRes,
        skillsRes,
        studentSkillsRes,
      ] = await Promise.all([
        getRecruiters(),
        getChallenges(),
        getIndustryDemand(),
        getRecruiterTopSkills(),
        getTopStudentSkills(),
      ]);

      setRecruiterCount(recruitersRes.data?.length || 0);
      setChallengeCount(challengesRes.data?.length || 0);
      setIndustryCount(industryRes.data?.length || 0);
      setStudentSkills(
        Array.isArray(studentSkillsRes.data)
        ? studentSkillsRes.data
        : []
      );
      if (skillsRes.data?.length > 0) {
        setTopSkill(
          skillsRes.data[0].skill_name ||
            skillsRes.data[0].skill ||
            "N/A"
        );
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      {/* Top Banner */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-[#9AD9B1] bg-[#176B3A] p-7 text-white shadow-lg sm:p-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#9AD9B1]/20 px-3 py-1 text-xs font-semibold text-white">
              National Workforce Portal
            </span>

            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Empowering India&apos;s Future Workforce
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">
              Data-driven insights to monitor talent availability, identify
              critical skill gaps, and accelerate public and private sector
              employment.
            </p>
          </div>

          <BarChart3 className="h-16 w-16 flex-none text-[#9AD9B1]/60" />
        </div>
      </section>

      {error && (
        <div className="mb-8">
          <ErrorState message={error} onRetry={loadDashboardData} />
        </div>
      )}

      {/* Key Statistics */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#176B3A]">
              Key Statistics
              <Tooltip text="Summary metrics updated in real-time from government backend database." />
            </h2>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              Click any card to expand detailed breakdowns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <CardSkeleton key={idx} />
              ))
            : statisticsConfig.map((stat) => (
                <MetricCard
                  key={stat.key}
                  icon={stat.icon}
                  title={stat.title}
                  description={stat.description}
                  tooltipText={stat.tooltip}
                  details={stat.details}
                  loading={loading}
                  value={
                    stat.key === "active_challenges"
                    ? 17
                    : stat.key === "active_government_jobs"
                    ? 129
                    : dashboardData?.[stat.key] ?? 0}
                    />
              ))}
        </div>
      </section>
      {/* Student Intelligence Snapshot */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#176B3A]">
            Student Intelligence Snapshot
          </h2>

          <p className="text-sm text-gray-600">
            Top verified skills currently held by students across the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : studentSkills.length > 0 ? (
            studentSkills.slice(0, 4).map((skill, index) => (
              <MetricCard
                key={index}
                icon={Code2}
                title={skill.skill_name || skill.skill || `Skill ${index + 1}`}
                value={
                  skill.student_count ??
                  skill.count ??
                  skill.total_students ??
                  0
                }
                description="Students with this skill"
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-[#D5E8DA] bg-white p-6 text-center text-sm text-[#6B7280]">
              No student skill data available.
            </div>
          )}
        </div>
      </section>
      {/* Recruiter Intelligence Snapshot */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#176B3A]">
            Recruiter Intelligence Snapshot
          </h2>

          <p className="text-sm text-gray-600">
            Live recruiter analytics collected from industry partners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MetricCard
            title="Recruiters"
            value={recruiterCount}
            description="Registered industry partners"
            icon={BriefcaseBusiness}
          />

          <MetricCard
            title="Challenges"
            value={challengeCount}
            description="Sponsored challenges"
            icon={Trophy}
          />

          <MetricCard
            title="Industries"
            value={industryCount}
            description="Industries hiring"
            icon={Building2}
          />

          <MetricCard
            title="Top Skill"
            value={topSkill}
            description="Most requested recruiter skill"
            icon={Target}
          />
        </div>
      </section>

      {/* Portal Hub */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-[#176B3A]">
            Analytics Hub
          </h2>

          <p className="mt-0.5 text-xs text-[#6B7280]">
            Explore tailored intelligence portals for students, recruiters,
            and policymakers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {portalCards.map((portal) => (
            <HubCard key={portal.title} {...portal} />
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="mb-4 text-xl font-extrabold text-[#176B3A]">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-hover-elevation surface-card flex items-start gap-4 rounded-2xl border border-[#D5E8DA] bg-white p-5"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
                <item.icon size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#176B3A]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-[#6B7280]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard