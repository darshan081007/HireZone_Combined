import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Zap, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { playLevelUpSound, createConfettiCannon } from '../lib/celebrationEffects';

interface TaskCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  xpAwarded: number;
  totalXp: number;
  stageName?: string;
  isStageClear?: boolean;
}

export const TaskCelebrationModal: React.FC<TaskCelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  xpAwarded,
  totalXp,
  stageName,
  isStageClear = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      playLevelUpSound();
      if (canvasRef.current) {
        const cancel = createConfettiCannon(canvasRef.current);
        return cancel;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Level calculation: Every 500 XP is a level
  const currentLevel = Math.max(1, Math.floor(totalXp / 500) + 1);
  const currentLevelBase = (currentLevel - 1) * 500;
  const nextLevelXp = currentLevel * 500;
  const progressInLevel = Math.min(100, Math.round(((totalXp - currentLevelBase) / 500) * 100));

  const levelTitles: { [lvl: number]: string } = {
    1: 'Novice Pioneer',
    2: 'Code Apprentice',
    3: 'Systems Builder',
    4: 'Enterprise Architect',
    5: 'Principal Engineer',
    6: 'Legendary Innovator',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      />

      <div className="relative z-20 w-full max-w-md bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden animate-in zoom-in-95 duration-250">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Trophy / Badge Icon */}
        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl rotate-6 animate-pulse opacity-80" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg text-white">
            {isStageClear ? (
              <Trophy className="w-10 h-10 animate-bounce" />
            ) : (
              <Zap className="w-10 h-10 animate-pulse text-white" />
            )}
          </div>
          {/* Sparkles around */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-spin" />
        </div>

        {/* Header Titles */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center space-x-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 px-3 py-1 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{isStageClear ? 'STAGE COMPLETED!' : 'QUEST TASK COMPLETE!'}</span>
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>
          {stageName && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {stageName}
            </p>
          )}
        </div>

        {/* XP Loot Card */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-amber-200 dark:border-slate-700">
          <div className="flex items-center justify-center space-x-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-heading">
            <span>+{xpAwarded}</span>
            <span className="text-xl text-amber-700 dark:text-amber-300">XP</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {subtitle || 'Awesome work! Your skills and portfolio rank just leveled up.'}
          </p>

          {/* Level Progress Bar */}
          <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-slate-700/60 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Level {currentLevel}: {levelTitles[currentLevel] || 'Elite Candidate'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {totalXp} / {nextLevelXp} XP
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${progressInLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
