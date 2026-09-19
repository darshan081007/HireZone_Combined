import {
  LayoutDashboard,
  Users,
  Code2,
  FolderKanban,
  ShieldCheck,
  BrainCircuit,
  Building2,
  Activity,
  TrendingUp,
  Trophy,
  Briefcase,
  Target,
  Flame,
  BarChart3,
  MapPin,
  Megaphone,
  FileText,
} from "lucide-react";

// Single source of truth for the application's navigation. Every path
// here corresponds to an existing route in App.jsx — nothing here is
// invented or speculative.
export const navigationGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", path: "/", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Talent",
    items: [
      { name: "Students", path: "/students", icon: Users },
      { name: "Skills", path: "/skills", icon: Code2 },
      { name: "Projects", path: "/projects", icon: FolderKanban },
      { name: "Proof of Work", path: "/proof-of-work", icon: ShieldCheck },
      { name: "AI Evaluations", path: "/ai-evaluations", icon: BrainCircuit },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { name: "Recruiters", path: "/recruiters", icon: Building2 },
      { name: "Hiring Activity", path: "/hiring-activity", icon: Activity },
      {
        name: "Recruitment Trends",
        path: "/recruitment-trends",
        icon: TrendingUp,
      },
      { name: "Government Jobs", path: "/jobs", icon: Briefcase },
    ],
  },
  {
    label: "Skill Intelligence",
    items: [
      { name: "Analytics", path: "/analytics", icon: BarChart3 },
      { name: "Skill Gap", path: "/skill-gap", icon: Target },
      { name: "Demand Skills", path: "/demand-skills", icon: Flame },
      { name: "Sector Strength", path: "/sectors", icon: BarChart3 },
      {
        name: "Low-Pursued Sectors",
        path: "/low-pursued-sectors",
        icon: TrendingUp,
      },
      {
        name: "Regional Distribution",
        path: "/regional-distribution",
        icon: MapPin,
      },
    ],
  },
  {
    label: "Programs",
    items: [
      { name: "Challenges", path: "/challenges", icon: Trophy },
      { name: "Campaigns", path: "/campaigns", icon: Megaphone },
      { name: "Reports", path: "/reports", icon: FileText },
    ],
  },
];

export const flatNavigation = navigationGroups.flatMap((group) => group.items);
