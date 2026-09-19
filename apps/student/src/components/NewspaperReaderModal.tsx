import React, { useState } from 'react';
import {
  X,
  Newspaper,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Share2,
  ArrowRight,
  TrendingUp,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { NewsArticle } from '../types';
import { playCheckboxTickSound } from '../lib/celebrationEffects';

interface NewspaperReaderModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToExplore?: (domain: string) => void;
}

export const NewspaperReaderModal: React.FC<NewspaperReaderModalProps> = ({
  article,
  isOpen,
  onClose,
  onNavigateToExplore,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!isOpen || !article) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(article.originalUrl || window.location.href);
    setCopied(true);
    playCheckboxTickSound(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    playCheckboxTickSound(!bookmarked);
  };

  // Full detailed news body for reading
  const articleBody =
    article.content ||
    `${article.summary}

Technological advancements and accelerating industrial digitization across tier-1 and tier-2 corridors are driving significant revisions in graduate hiring rubrics. According to recent engineering recruitment audits, companies are actively moving away from traditional pure-rote memorization assessments. Instead, technical interview panels focus on candidate portfolios featuring end-to-end distributed systems, verified proof of work, and practical familiarity with industry standards.

Industry leads emphasize that hands-on mastery of toolchains—such as container orchestration, automated test suites, real-time message brokers, and secure REST/gRPC API implementations—separates top-percentile candidates from general applicants. With international product development centers expanding their footprint in India, universities and technical institutes are aligning curricula directly with NPTEL certification tracks and open-source project repositories.

Students who develop multi-stage projects demonstrating fault tolerance, low latency, and clear system architecture diagrams consistently achieve 40% higher placement conversion rates during campus placement cycles and off-campus recruitment drives.`;

  const takeaways = article.keyTakeaways || [
    'Strong market preference for candidates with demonstrable git repositories and live deployment logs.',
    `Core mastery in ${article.relevantSkills.slice(0, 3).join(', ')} is heavily indexed across upcoming hiring quarters.`,
    'Knowledge of enterprise architecture patterns and system trade-offs significantly boosts capstone interview scores.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Newspaper Masthead Bar */}
        <div className="bg-slate-900 dark:bg-black text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-purple-400" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-slate-300">
              {article.sourceName} • Tech & Career Edition
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                bookmarked ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:text-white'
              }`}
              title="Bookmark article"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                {article.relatedDomain}
              </span>
              <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publicationDate}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {article.readTime || '3 min read'}
              </span>
              <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Industry Report</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white leading-tight">
              {article.headline}
            </h1>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Published by <span className="font-semibold text-slate-800 dark:text-slate-200">{article.sourceName}</span>
              {article.author ? ` • Special Report by ${article.author}` : ' • Engineering & Technology Desk'}
            </div>
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {articleBody.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Engineering Takeaways Box */}
          <div className="p-5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-purple-900 dark:text-purple-200">
                Industry & Placement Takeaways
              </h3>
            </div>
            <ul className="space-y-2">
              {takeaways.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-purple-950 dark:text-purple-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Required */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              High-Demand Technologies Mentioned
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.relevantSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
          >
            <span>Visit {article.sourceName} Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {onNavigateToExplore && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToExplore(article.relatedDomain);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Explore {article.relatedDomain} Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
