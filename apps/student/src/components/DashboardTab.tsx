import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Newspaper,
  BookOpen,
  ArrowRight,
  Users,
  Compass,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  StudentProfile,
  StudentEnrollment,
  Project,
  JobMarketTrend,
  NewsArticle,
  DomainType,
} from '../types';
import { api } from '../services/api';
import { NewspaperReaderModal } from './NewspaperReaderModal';

interface DashboardTabProps {
  profile: StudentProfile | null;
  enrollment: StudentEnrollment | null;
  activeProject: Project | null;
  onNavigateToExplore: (domainFilter?: string) => void;
  onNavigateToJourney: () => void;
  onNavigateToRecruiters: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  enrollment,
  activeProject,
  onNavigateToExplore,
  onNavigateToJourney,
  onNavigateToRecruiters,
}) => {
  const [trends, setTrends] = useState<JobMarketTrend[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('All');
  const [selectedTrendView, setSelectedTrendView] = useState<'domains' | 'skills'>('domains');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [trendsData, newsData] = await Promise.all([
          api.getTrends(),
          api.getNews(),
        ]);
        setTrends(trendsData.trends);
        setNews(newsData.articles);
      } catch (err) {
        console.error('Error fetching dashboard feed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const newsCategories = [
    'All',
    'Robotics',
    'Artificial Intelligence',
    'Semiconductor Technology',
    'Cloud Computing',
    'Cybersecurity',
    'Internet of Things',
  ];

  const filteredNews =
    selectedNewsCategory === 'All'
      ? news
      : news.filter((n) => n.relatedDomain === selectedNewsCategory);

  const studentName = profile?.name || 'Sarveswaran K.';
  const asScore = profile?.asScore || 84;
  const completedProjects = profile?.completedProjectCount || 1;
  const skillsCount = profile?.skills?.length || 8;
  const badgesCount = enrollment?.earnedBadgeIds?.length || 3;
  const journeyProgress = enrollment?.completionPercentage || 80;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden transition-all"
        style={{ background: 'linear-gradient(135deg, var(--color-accent, #2563eb) 0%, #4338ca 60%, #7c3aed 100%)' }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>DAYLIGHT LEARNING SYSTEM · SMART CAREER ACCELERATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-white mb-2">
            Welcome back, {studentName}!
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
            Discover opportunities, build industry-relevant skills, and become career ready through hands-on company-inspired projects.
          </p>

          <div className="flex flex-wrap gap-3">
            {activeProject ? (
              <button
                onClick={onNavigateToJourney}
                className="inline-flex items-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Resume Active Project: {activeProject.title.slice(0, 24)}...</span>
                <ArrowRight className="w-4 h-4 text-accent-themed" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateToExplore()}
                className="inline-flex items-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Projects & Choose Company</span>
                <Compass className="w-4 h-4 text-accent-themed" />
              </button>
            )}

            <button
              onClick={() => onNavigateToExplore()}
              className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              <span>View All 28+ Companies</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* AS Score */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">AS Score</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">{asScore}</span>
            <span className="text-xs text-slate-500 font-medium">/100</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Verified Skill Index</p>
        </div>

        {/* Projects Completed */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Projects</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">{completedProjects}</span>
            <span className="text-xs text-slate-500 font-medium">finished</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">1 active journey</p>
        </div>

        {/* Skills Completed */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Skills</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">{skillsCount}</span>
            <span className="text-xs text-slate-500 font-medium">verified</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Hardware & Software</p>
        </div>

        {/* Badges Earned */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Badges</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">{badgesCount}</span>
            <span className="text-xs text-slate-500 font-medium">earned</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">On public profile</p>
        </div>

        {/* Career Journey Progress */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Progress</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">{journeyProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${journeyProgress}%` }}
            />
          </div>
        </div>

        {/* Recruiter Connections */}
        <div
          onClick={onNavigateToRecruiters}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Recruiters</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading text-slate-900">1</span>
            <span className="text-xs text-slate-500 font-medium">connected</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center space-x-0.5">
            <span>1 pending invitation</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 3. Section 5.1: Job-Market Trends */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900">
                Job-Market Demand & Industry Trends
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time engineering skill demand, year-over-year growth, and national hiring benchmarks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium">
              <button
                onClick={() => setSelectedTrendView('domains')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedTrendView === 'domains'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Domain Demand
              </button>
              <button
                onClick={() => setSelectedTrendView('skills')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedTrendView === 'skills'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skill Demand
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample market data</span>
            </div>
          </div>
        </div>

        {/* Demand Bars & Cards */}
        {selectedTrendView === 'domains' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {trends.map((trend) => (
              <div
                key={trend.domain}
                className="bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all shadow-2xs group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {trend.domain}
                    </h3>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${
                        trend.demandLevel === 'Very High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {trend.demandLevel} Demand
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 flex items-center justify-end">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      +{trend.growthPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400">YoY Growth</span>
                  </div>
                </div>

                {/* Progress bar representing relative demand */}
                <div className="w-full bg-slate-200/70 rounded-full h-2 my-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, trend.growthPercentage * 2.5)}%` }}
                  />
                </div>

                {/* Top demanded skills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-500">Most Demanded Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {trend.topDemandedSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onNavigateToExplore(trend.domain)}
                  className="mt-4 w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-semibold text-accent-themed bg-accent-subtle hover:brightness-95 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explore {trend.domain} Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'Python', demand: '98%', domain: 'AI & Data', growth: '+36%' },
                { name: 'Embedded C', demand: '89%', domain: 'Robotics & IoT', growth: '+28%' },
                { name: 'ROS / ROS2', demand: '84%', domain: 'Autonomous Systems', growth: '+32%' },
                { name: 'React / TypeScript', demand: '94%', domain: 'Software Dev', growth: '+22%' },
                { name: 'Docker / Kubernetes', demand: '91%', domain: 'Cloud & DevOps', growth: '+29%' },
                { name: 'Verilog / VLSI', demand: '88%', domain: 'Semiconductor', growth: '+34%' },
                { name: 'AWS / Azure', demand: '92%', domain: 'Cloud Computing', growth: '+27%' },
                { name: 'Computer Vision', demand: '86%', domain: 'Robotics & AI', growth: '+31%' },
                { name: 'SQL & Data Modeling', demand: '90%', domain: 'Data Engineering', growth: '+21%' },
                { name: 'Microcontrollers', demand: '83%', domain: 'Embedded Systems', growth: '+24%' },
                { name: 'Cybersecurity / SIEM', demand: '87%', domain: 'Security', growth: '+30%' },
                { name: 'PyTorch / ML', demand: '95%', domain: 'Machine Learning', growth: '+38%' },
              ].map((s) => (
                <div
                  key={s.name}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-750 hover:border-accent-themed transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 dark:text-white">{s.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">{s.growth}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{s.domain}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent-themed h-full rounded-full" style={{ width: s.demand }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Source: National Technical Skills & Employment Outlook (Sample Data Model)</span>
          <span className="font-medium text-slate-700">Backend API endpoint: GET /api/trends</span>
        </div>
      </section>

      {/* 4. Section 5.2: Current News and Newspaper Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white">
                Current Technology & Employment News
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated headlines from reputable Indian newspapers and global industry registries connected directly to project skill requirements.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Sources Active</span>
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto py-4 space-x-2 no-scrollbar border-b border-slate-100 dark:border-slate-800">
          {newsCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedNewsCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedNewsCategory === cat
                  ? 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              className="flex flex-col justify-between bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-500 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-100 dark:border-purple-800">
                    {article.sourceName}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">{article.publicationDate}</span>
                </div>

                <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug mb-2">
                  {article.headline}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3" onClick={(e) => e.stopPropagation()}>
                {/* Related Domain & Skills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Skills:</span>
                  {article.relevantSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Actions: Read Article & Explore Related Projects */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onNavigateToExplore(article.relatedDomain)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Explore Projects</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In-App Newspaper Reader Modal */}
      <NewspaperReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onNavigateToExplore={onNavigateToExplore}
      />
    </div>
  );
};
