import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Award,
  Trophy,
  Github,
  Linkedin,
  FileText,
  Globe,
  Edit3,
  Save,
  CheckCircle2,
  Download,
  Loader2,
  ExternalLink,
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  Layers,
  Zap,
  X,
  Plus,
  ShieldCheck,
  Eye,
  Camera,
} from 'lucide-react';
import { StudentProfile, StudentEnrollment, Project, Badge } from '../types';
import { api } from '../services/api';
import { generateStudentPortalZip, triggerDownload } from '../lib/zipExport';

interface ProfileTabProps {
  profile: StudentProfile | null;
  enrollment: StudentEnrollment | null;
  activeProject: Project | null;
  badges: { earned: Badge[]; available: Badge[] };
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  enrollment,
  activeProject,
  badges,
  onUpdateProfile,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState({
    name: profile?.name || 'Sarveswaran K.',
    college: profile?.college || 'SSN College of Engineering',
    degree: profile?.degree || 'B.E. Electrical & Electronics Engineering',
    graduationYear: profile?.graduationYear || 2026,
    bio: profile?.bio || 'Passionate about Robotics, Firmware, and Embedded Systems.',
    avatarUrl: profile?.avatarUrl || PRESET_AVATARS[0],
    skills: profile?.skills || ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'System Design'],
    githubUrl: profile?.githubUrl || 'https://github.com/sarveswaran-student',
    linkedinUrl: profile?.linkedinUrl || 'https://linkedin.com/in/sarveswaran-student',
    resumeUrl: profile?.resumeUrl || 'https://drive.google.com/sample-resume',
    portfolioUrl: profile?.portfolioUrl || 'https://sarveswaran.dev',
    permitRecruiterVisibility: profile?.permitRecruiterVisibility ?? true,
    permitGovtVerification: profile?.permitGovtVerification ?? true,
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  // Keep form data synchronized when profile prop updates
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || 'Sarveswaran K.',
        college: profile.college || 'SSN College of Engineering',
        degree: profile.degree || 'B.E. Electrical & Electronics Engineering',
        graduationYear: profile.graduationYear || 2026,
        bio: profile.bio || 'Passionate about Robotics, Firmware, and Embedded Systems.',
        avatarUrl: profile.avatarUrl || PRESET_AVATARS[0],
        skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'System Design'],
        githubUrl: profile.githubUrl || 'https://github.com/sarveswaran-student',
        linkedinUrl: profile.linkedinUrl || 'https://linkedin.com/in/sarveswaran-student',
        resumeUrl: profile.resumeUrl || 'https://drive.google.com/sample-resume',
        portfolioUrl: profile.portfolioUrl || 'https://sarveswaran.dev',
        permitRecruiterVisibility: profile.permitRecruiterVisibility ?? true,
        permitGovtVerification: profile.permitGovtVerification ?? true,
      });
    }
  }, [profile]);

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.updateProfile(formData);
      onUpdateProfile(formData);
      setIsEditModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateStudentPortalZip();
      triggerDownload(blob, 'HireZone_Student_Final.zip');
    } catch (err) {
      console.error('Failed to download project zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const asScore = profile?.asScore || 85;
  const currentLevel = Math.max(1, Math.floor((profile?.totalXp || 1200) / 500) + 1);

  return (
    <div className="space-y-8 pb-12">
      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">Profile successfully saved and synced to Supabase!</span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="relative group">
              <img
                src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={formData.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500/30 shadow-md shrink-0"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                  {formData.name}
                </h1>
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                  Level {currentLevel} Engineer
                </span>
                {formData.permitGovtVerification && (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Govt Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{formData.degree}</span>
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.college}</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Batch of {formData.graduationYear}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-accent-themed hover:brightness-110 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              id="btn-edit-profile-open"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              title="Download full project repository as ZIP"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export ZIP</span>
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {formData.bio}
          </p>
        </div>

        {/* Social / Portfolio Links Row */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {formData.githubUrl && (
            <a
              href={formData.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}

          {formData.linkedinUrl && (
            <a
              href={formData.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}

          {formData.portfolioUrl && (
            <a
              href={formData.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}

          {formData.resumeUrl && (
            <a
              href={formData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Skills & AS Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic & Skill (AS) Score Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AS Profile Score
            </span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>

          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
              {asScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Benchmark calculated from verified Supabase roadmap milestones, AI code reviews, and MCQ accuracy.
          </p>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full"
              style={{ width: `${asScore}%` }}
            />
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Verified Technical Skills
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Manage</span>
              <Edit3 className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Skills are matched against recruiter hiring queries across Google, Microsoft, Amazon, and NVIDIA.
          </p>
        </div>
      </div>

      {/* 3. Earned Badges Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
              Earned Badges & Verifiable Credentials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cryptographically timestamped milestones verified in Supabase live database
            </p>
          </div>
          <Trophy className="w-6 h-6 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.earned.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold shrink-0">
                {badge.icon || '🏆'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {badge.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {badge.description}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-semibold">
                  +{badge.xpReward} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Comprehensive Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                    Edit Student Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Updates sync instantly to Supabase live database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Profile Avatar
                </label>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        formData.avatarUrl === url
                          ? 'border-blue-600 ring-2 ring-blue-400 scale-105'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or enter custom avatar image URL..."
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year *
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map((year) => (
                      <option key={year} value={year}>
                        Class of {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree & Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Bio / Technical Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your engineering focus, project achievements, and target roles..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Skills
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Docker, ROS, PyTorch)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-accent-themed hover:brightness-110 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resume Link (Drive / Cloud)
                  </label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-accent-themed hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                  id="btn-save-profile"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
