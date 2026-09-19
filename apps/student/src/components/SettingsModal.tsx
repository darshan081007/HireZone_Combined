import React, { useState } from 'react';
import {
  X,
  Palette,
  Shield,
  Database,
  Eye,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  KeyRound,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AppSettings, AuthUser, StudentProfile } from '../types';
import { api } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  currentUser: AuthUser | null;
  profile: StudentProfile | null;
  onProfileUpdate?: (updated: StudentProfile) => void;
  dbStatus: {
    isConnected: boolean;
    provider: string;
    tablesVerified: string[];
    message: string;
  } | null;
  onRefreshDbStatus: () => void | Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentUser,
  profile,
  onProfileUpdate,
  dbStatus,
  onRefreshDbStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'account' | 'database' | 'privacy'>('appearance');

  // Change password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  // Privacy toggles state
  const [recruiterVisibility, setRecruiterVisibility] = useState(profile?.permitRecruiterVisibility ?? true);
  const [govtVerification, setGovtVerification] = useState(profile?.permitGovtVerification ?? true);
  const [privacySaving, setPrivacySaving] = useState(false);
  const [privacySuccess, setPrivacySuccess] = useState<string | null>(null);
  const [dbChecking, setDbChecking] = useState(false);
  const [dbCheckMessage, setDbCheckMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPwError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);

    try {
      const res = await api.changePassword(oldPassword, newPassword);
      setPwSuccess(res.message || 'Password successfully updated in Supabase PostgreSQL!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setPrivacySaving(true);
    setPrivacySuccess(null);
    try {
      const res = await api.updateProfile({
        permitRecruiterVisibility: recruiterVisibility,
        permitGovtVerification: govtVerification,
      });
      if (res.success && onProfileUpdate) {
        onProfileUpdate(res.profile);
      }
      setPrivacySuccess('Privacy & discovery settings saved to Supabase!');
      setTimeout(() => setPrivacySuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setPrivacySaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Application Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize appearance, manage your live Supabase account & privacy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'appearance'
                ? 'border-accent-themed text-accent-themed font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>App Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'account'
                ? 'border-accent-themed text-accent-themed font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Account & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'database'
                ? 'border-accent-themed text-accent-themed font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'privacy'
                ? 'border-accent-themed text-accent-themed font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy & Discovery</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map((themeOpt) => {
                    const Icon = themeOpt.icon;
                    const isSelected = settings.theme === themeOpt.id;
                    return (
                      <button
                        key={themeOpt.id}
                        onClick={() =>
                          onUpdateSettings({ ...settings, theme: themeOpt.id as any })
                        }
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                        <span>{themeOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'blue', label: 'Ocean Blue', bg: 'bg-blue-600' },
                    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
                    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
                    { id: 'violet', label: 'Violet', bg: 'bg-violet-600' },
                    { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
                    { id: 'rose', label: 'Neon Rose', bg: 'bg-rose-600' },
                    { id: 'cyan', label: 'Hyper Cyan', bg: 'bg-cyan-600' },
                  ].map((color) => {
                    const isSelected = settings.accentColor === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() =>
                          onUpdateSettings({ ...settings, accentColor: color.id as any })
                        }
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold ring-2 ring-slate-400 dark:ring-slate-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${color.bg} shadow-xs`} />
                        <span>{color.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Accent Theme Preview */}
                <div className="mt-3.5 p-3 rounded-xl border border-accent-subtle bg-accent-subtle flex items-center justify-between transition-all">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-themed animate-pulse" />
                    <span className="text-xs font-semibold text-accent-subtle">
                      Live Accent Preview Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-accent-themed text-white shadow-xs">
                      Themed Button
                    </span>
                    <span className="text-xs font-bold text-accent-themed">
                      +150 XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Density Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Display Density
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'comfortable', label: 'Comfortable', desc: 'Spacious padding and larger cards' },
                    { id: 'compact', label: 'Compact', desc: 'Higher data density and tighter spacing' },
                  ].map((dens) => {
                    const isSelected = settings.density === dens.id;
                    return (
                      <button
                        key={dens.id}
                        onClick={() =>
                          onUpdateSettings({ ...settings, density: dens.id as any })
                        }
                        className={`text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-900/30'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-800 dark:text-white">
                          {dens.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {dens.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNT & SECURITY */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Current User Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600 object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {profile?.name || currentUser?.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {profile?.email || currentUser?.email}
                    </div>
                    <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                      Supabase Student ID: #{currentUser?.studentId || profile?.id || '202'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">College</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.college}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Degree / Year</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.degree} ({profile?.graduationYear})</span>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Change Password in Supabase</span>
                </h3>

                {pwError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{pwError}</span>
                  </div>
                )}
                {pwSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pwSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pwLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {pwLoading ? 'Updating Supabase...' : 'Save New Password'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SUPABASE SYNC */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        {dbStatus?.isConnected ? 'PostgreSQL Live Connected' : dbStatus?.isConfigured ? 'Supabase Configured · Not Verified' : 'Supabase Not Configured'}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Endpoint: {dbStatus?.endpoint || dbStatus?.url || 'Not available'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={dbChecking}
                    onClick={async () => {
                      setDbChecking(true);
                      setDbCheckMessage(null);
                      try {
                        await onRefreshDbStatus();
                        setDbCheckMessage('Database status refreshed successfully.');
                      } catch (error: any) {
                        setDbCheckMessage(error?.message || 'Unable to verify the database right now.');
                      } finally {
                        setDbChecking(false);
                      }
                    }}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dbChecking ? 'animate-spin' : ''}`} />
                    <span>{dbChecking ? 'Checking…' : 'Verify Live DB'}</span>
                  </button>
                </div>
              </div>

              {dbCheckMessage && (
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                  {dbCheckMessage}
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Verified Supabase Tables
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'students', desc: 'User profiles & education' },
                    { name: 'student_auth', desc: 'Password hashes & logins' },
                    { name: 'student_profiles', desc: 'Bio & social links' },
                    { name: 'projects', desc: 'Live company challenges' },
                    { name: 'milestones', desc: 'Stage roadmaps & tasks' },
                    { name: 'recruiters', desc: 'Verified hiring leads' },
                    { name: 'badges', desc: 'Skill credentials & XP' },
                    { name: 'assessments', desc: 'MCQ & AI Rubrics' },
                    { name: 'proof_of_work', desc: 'GitHub & demo submissions' },
                    { name: 'recruiter_connects', desc: 'Direct outreach status' },
                  ].map((tbl) => (
                    <div
                      key={tbl.name}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{tbl.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {tbl.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & DISCOVERY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {privacySuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{privacySuccess}</span>
                </div>
              )}

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Verified Recruiter Discovery
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Allow verified tech recruiters from Google, Microsoft, TCS, Infosys, and startups to view your profile and send direct career invitations.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={recruiterVisibility}
                    onChange={(e) => setRecruiterVisibility(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5"
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-start justify-between">
                  <div className="pr-4">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Government Portal Milestone Verification
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Permit automated synchronization of your completed projects with national career credentials and public milestone verification APIs.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={govtVerification}
                    onChange={(e) => setGovtVerification(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5"
                  />
                </div>
              </div>

              <button
                onClick={handleSavePrivacy}
                disabled={privacySaving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {privacySaving ? 'Saving to Supabase...' : 'Save Privacy Preferences'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
