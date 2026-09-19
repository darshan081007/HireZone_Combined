import React, { useState } from 'react';
import {
  Compass,
  Briefcase,
  Map,
  Users,
  User,
  Sparkles,
  Zap,
  CheckCircle2,
  Database,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { StudentProfile, AuthUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile | null;
  totalXp: number;
  asScore: number;
  currentUser?: AuthUser | null;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  dbStatus?: {
    isConnected: boolean;
    isConfigured: boolean;
    provider: string;
    tablesVerified: string[];
    message: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  totalXp,
  asScore,
  currentUser,
  onOpenSettings,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode,
  dbStatus,
}) => {
  const [showDbInfo, setShowDbInfo] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'explore', label: 'Explore Projects', icon: Briefcase },
    { id: 'journey', label: 'My Career Journey', icon: Map },
    { id: 'recruiters', label: 'Recruiter Connections', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-accent-themed flex items-center justify-center text-white shadow-xs font-bold text-lg tracking-tight">
              HZ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  HIREZONE
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-accent-subtle text-accent-subtle px-2 py-0.5 rounded-full border border-accent-subtle">
                  Student
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                LEARN · BUILD · GROW
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent-subtle text-accent-subtle font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-accent-themed' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* AS Score Badge */}
            <div
              className="hidden sm:flex items-center space-x-1.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-xl text-xs cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              onClick={() => setActiveTab('profile')}
              title="Academic & Skill (AS) Score"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">AS Score:</span>
              <span className="font-bold text-purple-700 dark:text-purple-300">{asScore}/100</span>
            </div>

            {/* XP Chip */}
            <div
              className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl text-xs"
              title="Total Accumulated Experience Points"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-800 dark:text-amber-300">{totalXp.toLocaleString()} XP</span>
            </div>

            {/* Dark Mode Quick Switcher Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                id="btn-theme-toggle"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}

            {/* Database Sync Status Badge */}
            <div className="relative">
              <button
                onClick={() => setShowDbInfo(!showDbInfo)}
                className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  dbStatus?.isConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Click to inspect Database & Supabase sync state"
              >
                <Database
                  className={`w-3.5 h-3.5 ${
                    dbStatus?.isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span className="font-semibold">
                  {dbStatus?.isConnected ? 'Supabase Live' : 'DB Ready'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dbStatus?.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
              </button>

              {/* DB Status Popover Dialog */}
              {showDbInfo && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>PostgreSQL Database Status</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dbStatus?.isConnected
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {dbStatus?.isConnected ? 'Connected' : 'Standalone'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2 text-slate-600 dark:text-slate-300">
                    <p className="leading-relaxed">
                      {dbStatus?.message ||
                        'Connected to PostgreSQL via Supabase client with real-time student persistence.'}
                    </p>

                    {dbStatus?.tablesVerified && dbStatus.tablesVerified.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                          Verified Tables:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dbStatus.tablesVerified.map((tbl) => (
                            <span
                              key={tbl}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            >
                              {tbl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Sync: Instant Read/Write
                    </span>
                    <button
                      onClick={() => setShowDbInfo(false)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center space-x-1 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Application Settings & App Appearance"
                id="btn-settings"
              >
                <SettingsIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden lg:inline text-xs font-medium text-slate-700 dark:text-slate-300">Settings</span>
              </button>
            )}

            {/* Student Avatar / Profile Link */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2 pl-1 cursor-pointer group"
              title="View Profile"
            >
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={profile?.name || 'Student'}
                className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-blue-500 transition-colors object-cover"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {profile?.name?.split(' ')[0] || currentUser?.name?.split(' ')[0] || 'Student'}
              </span>
            </div>

            {/* Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
                id="btn-logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-accent-subtle text-accent-subtle font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent-themed' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
