import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  Briefcase,
  Layers,
  Clock,
  ChevronRight,
  Filter,
  Bot,
  Cpu,
  Code2,
  Cloud,
  Shield,
  Radio,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  Company,
  Project,
  CompanyCategory,
  DomainType,
  DifficultyLevel,
} from '../types';
import { api } from '../services/api';

interface ExploreProjectsTabProps {
  initialDomainFilter?: string;
  onSelectProjectAndStart: (project: Project, companyId?: string) => void;
  favouriteCompanyIds: string[];
  onToggleFavouriteCompany: (companyId: string) => void;
}

export const ExploreProjectsTab: React.FC<ExploreProjectsTabProps> = ({
  initialDomainFilter,
  onSelectProjectAndStart,
  favouriteCompanyIds,
  onToggleFavouriteCompany,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyCategory, setSelectedCompanyCategory] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomainFilter || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All'); // Software | Hardware | All
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialDomainFilter) {
      setSelectedDomain(initialDomainFilter);
    }
  }, [initialDomainFilter]);

  useEffect(() => {
    async function loadExploreData() {
      try {
        setIsLoading(true);
        const [compRes, projRes] = await Promise.all([
          api.getCompanies(),
          api.getProjects(),
        ]);
        setCompanies(compRes.companies);
        setProjects(projRes.projects);
      } catch (err) {
        console.error('Error loading explore data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExploreData();
  }, []);

  const companyCategories: ('All' | CompanyCategory)[] = [
    'All',
    'Product Company',
    'IT Services',
    'Semiconductor',
    'Robotics',
    'Automotive',
    'Aerospace',
    'Government Technology',
  ];

  const domains: ('All' | DomainType)[] = [
    'All',
    'Robotics',
    'Artificial Intelligence',
    'Machine Learning',
    'Software Development',
    'Cloud Computing',
    'Internet of Things',
    'Embedded Systems',
    'Semiconductor Technology',
  ];

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    if (selectedCompanyCategory !== 'All' && c.category !== selectedCompanyCategory) return false;
    if (selectedType === 'Software' && c.type === 'Hardware') return false;
    if (selectedType === 'Hardware' && c.type === 'Software') return false;
    return true;
  });

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (selectedDomain !== 'All' && p.domain !== selectedDomain) return false;
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
    if (selectedCompanyFilter !== 'All' && !p.recommendedCompanies.includes(selectedCompanyFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = p.title.toLowerCase().includes(q);
      const matchesDesc = p.description.toLowerCase().includes(q);
      const matchesSkill = p.requiredSkills.some((s) => s.toLowerCase().includes(q));
      const matchesCompany = p.recommendedCompanies.some((c) => c.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDesc && !matchesSkill && !matchesCompany) return false;
    }

    return true;
  });

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'Robotics':
        return <Bot className="w-4 h-4 text-blue-600" />;
      case 'Artificial Intelligence':
      case 'Machine Learning':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Software Development':
        return <Code2 className="w-4 h-4 text-emerald-600" />;
      case 'Cloud Computing':
        return <Cloud className="w-4 h-4 text-sky-600" />;
      case 'Cybersecurity':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Radio className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
              Explore Projects & Company Careers
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select your favourite company, discover relevant engineering projects, and begin a guided treasure-hunt learning roadmap.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{projects.length} Engineering Projects</span>
            </span>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-lg border border-purple-200 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              <span>{companies.length} Industry Leaders</span>
            </span>
          </div>
        </div>

        {/* Legal Disclaimer / Scope Notice */}
        <div className="mt-4 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Industry Alignment Notice:</strong> Projects on HIREZONE are independently developed and inspired by real-world industry roles and skill requirements. Explore skills relevant to this industry. (Company names are referenced purely for student career pathway discovery).
          </p>
        </div>
      </div>

      {/* 2. Companies Showcase with Favourite Hearts */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900">
              Favourite & Explore Target Companies
            </h2>
            <p className="text-xs text-slate-500">
              Click the heart icon to add to your favorites. Filter projects by selecting any company.
            </p>
          </div>

          {selectedCompanyFilter !== 'All' && (
            <button
              onClick={() => setSelectedCompanyFilter('All')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Clear Company Filter ({selectedCompanyFilter})</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Company Category Tabs */}
        <div className="flex overflow-x-auto pb-3 space-x-2 no-scrollbar">
          {companyCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCompanyCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCompanyCategory === cat
                  ? 'bg-accent-themed text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Companies Slider / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3">
          {filteredCompanies.slice(0, 14).map((comp) => {
            const isFav = favouriteCompanyIds.includes(comp.id);
            const isSelected = selectedCompanyFilter === comp.name;

            return (
              <div
                key={comp.id}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
                onClick={() =>
                  setSelectedCompanyFilter(selectedCompanyFilter === comp.name ? 'All' : comp.name)
                }
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {comp.type}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavouriteCompany(comp.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title={isFav ? 'Remove from favourites' : 'Mark as favourite'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isFav ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-heading font-bold text-slate-900 leading-tight">
                    {comp.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{comp.category}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-blue-600 font-medium">
                    {isSelected ? 'Filtering' : 'View Projects'}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Projects Discovery Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, skill (e.g. ROS, Python, IR Sensors), or company..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Domains</option>
              {domains.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Hardware / Software Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs">
              {['All', 'Software', 'Hardware'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedType === t
                      ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedDomain !== 'All' || selectedDifficulty !== 'All' || selectedCompanyFilter !== 'All' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-400">Active filters:</span>
            {selectedDomain !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                <span>Domain: {selectedDomain}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDomain('All')} />
              </span>
            )}
            {selectedDifficulty !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                <span>Difficulty: {selectedDifficulty}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty('All')} />
              </span>
            )}
            {selectedCompanyFilter !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                <span>Company: {selectedCompanyFilter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCompanyFilter('All')} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDomain('All');
                setSelectedDifficulty('All');
                setSelectedCompanyFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* 4. Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-accent-themed transition-all p-5 shadow-2xs hover:shadow-xs group"
          >
            <div>
              {/* Card Header: Domain & Difficulty */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="inline-flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {getDomainIcon(project.domain)}
                  <span>{project.domain}</span>
                </span>

                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                    project.difficulty === 'Beginner'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : project.difficulty === 'Intermediate'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}
                >
                  {project.difficulty}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white group-hover:text-accent-themed transition-colors leading-snug mb-2">
                {project.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {project.description}
              </p>

              {/* Project Meta Info */}
              <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.estimatedDuration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.stages.length} Roadmap Stages</span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {project.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Companies */}
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Target Companies: </span>
                <span>{project.recommendedCompanies.join(', ')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => setActiveProjectModal(project)}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>View Roadmap</span>
              </button>

              <button
                onClick={() => onSelectProjectAndStart(project)}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-accent-themed hover:brightness-110 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Start Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Try adjusting your search keywords, clear company category filters, or choose a broader domain.
          </p>
          <button
            onClick={() => {
              setSelectedDomain('All');
              setSelectedDifficulty('All');
              setSelectedCompanyFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* 5. Project Overview & Roadmap Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
                  {getDomainIcon(activeProjectModal.domain)}
                  <span>{activeProjectModal.domain}</span>
                  <span>·</span>
                  <span>{activeProjectModal.difficulty} Level</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-slate-900">
                  {activeProjectModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Expected Output */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Overview
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeProjectModal.description}
              </p>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5">
                <span className="text-xs font-bold text-blue-900 block mb-1">
                  Expected Engineering Output:
                </span>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {activeProjectModal.expectedOutput}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {activeProjectModal.hardwareRequirements && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-2">Hardware Requirements:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {activeProjectModal.hardwareRequirements.map((hw, idx) => (
                      <li key={idx}>{hw}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-2">Software Environment:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {activeProjectModal.softwareRequirements.map((sw, idx) => (
                    <li key={idx}>{sw}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Roadmap Stages Preview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Treasure-Hunt Roadmap ({activeProjectModal.stages.length} Stages)
              </h3>
              <div className="space-y-2">
                {activeProjectModal.stages.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center space-x-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                      {st.stageNumber}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800">{st.title}</span>
                      <p className="text-[11px] text-slate-500">{st.shortDescription}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      +{st.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = activeProjectModal;
                  setActiveProjectModal(null);
                  onSelectProjectAndStart(target);
                }}
                className="inline-flex items-center space-x-2 bg-accent-themed hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Start My Career Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
