import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Video,
  Award,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { LearningResource } from '../types';
import { playLevelUpSound, playCheckboxTickSound } from '../lib/celebrationEffects';

interface ResourceStudyModalProps {
  resource: LearningResource | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkCompleted?: (resourceId: string) => void;
  isCompleted?: boolean;
}

export const ResourceStudyModal: React.FC<ResourceStudyModalProps> = ({
  resource,
  isOpen,
  onClose,
  onMarkCompleted,
  isCompleted = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'links'>('syllabus');

  if (!isOpen || !resource) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.url);
    setCopied(true);
    playCheckboxTickSound(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    playLevelUpSound();
    if (onMarkCompleted) {
      onMarkCompleted(resource.id);
    }
  };

  // Determine institution from course title or defaults
  const institution =
    resource.institution ||
    (resource.provider === 'NPTEL'
      ? 'Indian Institute of Technology (IIT)'
      : resource.provider === 'Coursera'
      ? 'Top University / Industry Partner'
      : 'Official Engineering Consortium');

  // Generate realistic syllabus highlights if not provided
  const syllabus = resource.syllabusHighlights || [
    `Module 1: Foundations of ${resource.topic} & Architectural Principles`,
    `Module 2: Practical Implementation, Data Models & Pipeline Integration`,
    `Module 3: Concurrency, Performance Tuning & Benchmarking`,
    `Module 4: Industry Capstone Project, Case Studies & Edge Case Resilience`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{resource.provider}</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{resource.estimatedDuration}</span>
              </span>
              {isCompleted && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Completed (+50 XP)</span>
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white leading-snug">
              {resource.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Offered by <span className="font-semibold text-slate-700 dark:text-slate-200">{institution}</span> • Target Skill: <span className="font-semibold text-blue-600 dark:text-blue-400">{resource.skillCovered}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'syllabus'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Syllabus & Modules
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Key Notes & Formulas
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'links'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Portals & Mirrors
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'syllabus' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                <span>
                  This coursework directly addresses the skill checkpoints required for your active milestone. Studying these modules enhances your problem-solving score on the automated capstone evaluation!
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recommended Course Progression
                </h4>
                <div className="space-y-2">
                  {syllabus.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Key Takeaways for {resource.skillCovered}
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Understand end-to-end memory safety and operational constraints before scaling.
                  </li>
                  <li>
                    Ensure high test coverage: Unit tests must validate both normal operation and fault injection scenarios.
                  </li>
                  <li>
                    Apply asynchronous non-blocking patterns to eliminate latency bottlenecks in enterprise production pipelines.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access official portals and reliable mirror resources:
              </p>

              <div className="space-y-2">
                {/* Official Course Link */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 transition-colors text-xs group"
                >
                  <div className="flex items-center space-x-2.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold text-blue-900 dark:text-blue-200">
                        Primary {resource.provider} Course URL
                      </div>
                      <div className="text-[11px] text-blue-700 dark:text-blue-400 truncate max-w-sm">
                        {resource.url}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Swayam Mirror / Archive */}
                <a
                  href={`https://swayam.gov.in/explorer?searchText=${encodeURIComponent(resource.topic)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 transition-colors text-xs group"
                >
                  <div className="flex items-center space-x-2.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Swayam Government Portal Search
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Search verified active semesters on national Swayam repository
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </a>

                {/* YouTube Lecture Mirror */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent('NPTEL ' + resource.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 transition-colors text-xs group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Video className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Official IIT YouTube Lecture Mirror
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Watch uninterrupted high-resolution video playlists directly
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Course Link'}</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <span>Open Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {!isCompleted ? (
              <button
                onClick={handleComplete}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Mark Studied (+50 XP)</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Studied</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
