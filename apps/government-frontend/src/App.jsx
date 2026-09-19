import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Recruiters from "./pages/Recruiters";
import Analytics from "./pages/Analytics";
import GovernmentJobs from "./pages/GovernmentJobs";
import SkillGap from "./pages/SkillGap";

import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import ProofOfWork from "./pages/ProofOfWork";
import AIEvaluations from "./pages/AIEvaluations";

import HiringActivity from "./pages/HiringActivity";
import DemandSkills from "./pages/DemandSkills";
import Challenges from "./pages/Challenges";
import RecruitmentTrends from "./pages/RecruitmentTrends";

import Sectors from "./pages/Sectors";
import LowPursuedSectors from "./pages/LowPursuedSectors";
import Campaigns from "./pages/Campaigns";
import Reports from "./pages/Reports";
import RegionalDistribution from "./pages/RegionalDistribution";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Student Intelligence */}
        <Route path="/students" element={<Students />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/proof-of-work" element={<ProofOfWork />} />
        <Route path="/ai-evaluations" element={<AIEvaluations />} />

        {/* Recruiter Intelligence */}
        <Route path="/recruiters" element={<Recruiters />} />
        <Route path="/hiring-activity" element={<HiringActivity />} />
        <Route path="/demand-skills" element={<DemandSkills />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/recruitment-trends" element={<RecruitmentTrends />} />

        {/* Government Intelligence */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route
          path="/low-pursued-sectors"
          element={<LowPursuedSectors />}
        />
        <Route
          path="/regional-distribution"
          element={<RegionalDistribution />}
        />
        <Route path="/jobs" element={<GovernmentJobs />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/reports" element={<Reports />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;