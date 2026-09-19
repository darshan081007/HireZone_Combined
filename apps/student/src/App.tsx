import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { ExploreProjectsTab } from './components/ExploreProjectsTab';
import { CareerJourneyTab } from './components/CareerJourneyTab';
import { RecruiterConnectionsTab } from './components/RecruiterConnectionsTab';
import { ProfileTab } from './components/ProfileTab';
import { LoginPage } from './components/LoginPage';
import { SettingsModal } from './components/SettingsModal';
import { MCQTestPage } from './components/MCQTestPage';

import {
  StudentProfile,
  StudentEnrollment,
  Project,
  Badge,
  AuthUser,
  AppSettings,
} from './types';
import { api } from './services/api';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_STUDENT_ENROLLMENT,
  SEED_PROJECTS,
  SEED_BADGES,
} from './data/seedData';
import { Bot, CheckCircle2 } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accentColor: 'blue',
  density: 'comfortable',
  emailNotifications: true,
  recruiterDiscovery: true,
  autoSaveProgress: true,
};

export function App() {
  if (window.location.pathname === '/mcq-test') return <MCQTestPage />;
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('hirezone_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('hirezone_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [enrollment, setEnrollment] = useState<StudentEnrollment>(INITIAL_STUDENT_ENROLLMENT);
  const [activeProject, setActiveProject] = useState<Project | null>(SEED_PROJECTS[0]);
  const [favouriteCompanyIds, setFavouriteCompanyIds] = useState<string[]>(
    INITIAL_STUDENT_PROFILE.favouriteCompanyIds
  );
  const [badges, setBadges] = useState<{ earned: Badge[]; available: Badge[] }>({
    earned: SEED_BADGES.slice(0, 3),
    available: SEED_BADGES.slice(3),
  });

  const [initialDomainFilter, setInitialDomainFilter] = useState<string>('All');
  const [dbStatus, setDbStatus] = useState<{
    isConfigured: boolean;
    isConnected: boolean;
    provider: string;
    tablesVerified: string[];
    message: string;
  } | null>(null);

  // Apply theme & accent settings to HTML element
  useEffect(() => {
    localStorage.setItem('hirezone_settings', JSON.stringify(settings));
    const root = document.documentElement;

    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }

    // Set accent color data attribute on root HTML element
    root.setAttribute('data-accent', settings.accentColor || 'blue');
  }, [settings]);

  // Load data whenever user is logged in
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const refreshDbStatus = async () => {
    const health = await api.getHealth();
    if (!health?.dbStatus) {
      throw new Error('The server did not return database status information.');
    }
    setDbStatus(health.dbStatus);
    return health.dbStatus;
  };

  const loadDashboardData = async () => {
    try {
      // 1. Health check & database verification
      await refreshDbStatus();

      // 2. Fetch live profile from Supabase
      const profRes = await api.getProfile();
      if (profRes?.profile) {
        setProfile(profRes.profile);
        setFavouriteCompanyIds(profRes.profile.favouriteCompanyIds || []);
      }

      // 3. Fetch active journey & project from live Supabase
      const journeyRes = await api.getActiveJourney();
      if (journeyRes?.activeJourney) {
        setEnrollment(journeyRes.activeJourney);
      }
      if (journeyRes?.project) {
        setActiveProject(journeyRes.project);
      }

      // 4. Fetch live badges from Supabase
      const badgeRes = await api.getBadges();
      if (badgeRes?.earned && badgeRes?.available) {
        setBadges({
          earned: badgeRes.earned,
          available: badgeRes.available,
        });
      }
    } catch (err) {
      console.warn('Dashboard initialization notice:', err);
    }
  };

  const handleLoginSuccess = (user: AuthUser, userProfile: StudentProfile) => {
    setCurrentUser(user);
    setProfile(userProfile);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('hirezone_user');
    localStorage.removeItem('hirezone_token');
    setCurrentUser(null);
  };

  // Navigations with domain filters
  const handleNavigateToExplore = (domain?: string) => {
    if (domain) setInitialDomainFilter(domain);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToJourney = () => {
    setActiveTab('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRecruiters = () => {
    setActiveTab('recruiters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProfile = () => {
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enrolling in project from Explore tab
  const handleSelectProjectAndStart = async (project: Project, companyId?: string) => {
    try {
      const res = await api.enrollInProject(project.id, companyId);
      setActiveProject(project);
      setEnrollment(res.enrollment);
      setActiveTab('journey');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to enroll in project:', err);
      setActiveProject(project);
      setActiveTab('journey');
    }
  };

  // Favourites toggle
  const handleToggleFavouriteCompany = async (companyId: string) => {
    const isCurrentlyFav = favouriteCompanyIds.includes(companyId);
    const updated = isCurrentlyFav
      ? favouriteCompanyIds.filter((id) => id !== companyId)
      : [...favouriteCompanyIds, companyId];

    setFavouriteCompanyIds(updated);
    setProfile((prev) => ({ ...prev, favouriteCompanyIds: updated }));

    try {
      await api.toggleFavouriteCompany(companyId, isCurrentlyFav);
    } catch (err) {
      console.error('Failed to update favourite company:', err);
    }
  };

  // If user is not authenticated, show the Login / Register screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 ${
      settings.density === 'compact' ? 'text-xs' : ''
    }`}>
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        totalXp={profile.totalXp}
        asScore={profile.asScore}
        currentUser={currentUser}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        isDarkMode={settings.theme === 'dark'}
        onToggleDarkMode={() => {
          const next = settings.theme === 'dark' ? 'light' : 'dark';
          setSettings((prev) => ({ ...prev, theme: next }));
        }}
        dbStatus={dbStatus}
      />

      {/* Main Tab Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            profile={profile}
            enrollment={enrollment}
            activeProject={activeProject}
            onNavigateToExplore={handleNavigateToExplore}
            onNavigateToJourney={handleNavigateToJourney}
            onNavigateToRecruiters={handleNavigateToRecruiters}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreProjectsTab
            initialDomainFilter={initialDomainFilter}
            onSelectProjectAndStart={handleSelectProjectAndStart}
            favouriteCompanyIds={favouriteCompanyIds}
            onToggleFavouriteCompany={handleToggleFavouriteCompany}
          />
        )}

        {activeTab === 'journey' && (
          <CareerJourneyTab
            project={activeProject}
            enrollment={enrollment}
            profile={profile}
            onRefreshJourney={loadDashboardData}
            onNavigateToExplore={() => setActiveTab('explore')}
            onNavigateToProfile={handleNavigateToProfile}
          />
        )}

        {activeTab === 'recruiters' && (
          <RecruiterConnectionsTab
            profile={profile}
            onUpdateProfile={(updates) => setProfile((prev) => ({ ...prev, ...updates }))}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            enrollment={enrollment}
            activeProject={activeProject}
            badges={badges}
            onUpdateProfile={(updates) => setProfile((prev) => ({ ...prev, ...updates }))}
          />
        )}
      </main>

      {/* Application Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        currentUser={currentUser}
        profile={profile}
        onProfileUpdate={(updated) => setProfile(updated)}
        dbStatus={dbStatus}
        onRefreshDbStatus={refreshDbStatus}
      />

      {/* Clean, Simple Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              HZ
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                HIREZONE — Student Career Development Platform
              </span>
              <p className="text-[11px] text-slate-400">
                Connected to Supabase PostgreSQL & Gemini AI
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{dbStatus?.isConnected ? 'Live Database Sync' : 'Database status unavailable'}</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-md font-medium">
              <Bot className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Gemini AI Active</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
