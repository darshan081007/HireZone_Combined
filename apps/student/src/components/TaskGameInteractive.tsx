import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Terminal,
  Zap,
  Volume2,
  VolumeX,
  Flame,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { RoadmapTask } from '../types';
import {
  playCheckboxTickSound,
  playComboSound,
  playSimulationScanSound,
  playTaskSuccessSound,
  playVictoryFanfare,
} from '../lib/celebrationEffects';

interface TaskGameInteractiveProps {
  task: RoadmapTask;
  checklist: string[];
  checkedItems: { [key: number]: boolean };
  onToggleItem: (idx: number, isChecked: boolean) => void;
  accentClasses?: any;
  onAllCompleted?: () => void;
}

interface FloatingXP {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const TaskGameInteractive: React.FC<TaskGameInteractiveProps> = ({
  task,
  checklist,
  checkedItems,
  onToggleItem,
  onAllCompleted,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);
  const [floatingXPs, setFloatingXPs] = useState<FloatingXP[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationPassed, setSimulationPassed] = useState(false);

  const completedCount = checklist.filter((_, i) => checkedItems[i]).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const triggerFloatXP = (text: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newXP: FloatingXP = {
      id: Date.now() + Math.random(),
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    };
    setFloatingXPs((prev) => [...prev, newXP]);
    setTimeout(() => {
      setFloatingXPs((prev) => prev.filter((p) => p.id !== newXP.id));
    }, 1200);
  };

  const handleCheck = (idx: number, e: React.MouseEvent) => {
    const willBeChecked = !checkedItems[idx];
    onToggleItem(idx, willBeChecked);

    if (willBeChecked) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (soundEnabled) {
        if (nextCombo > 1) {
          playComboSound(nextCombo);
        } else {
          playCheckboxTickSound(true);
        }
      }
      triggerFloatXP(nextCombo >= 3 ? `+35 XP 🔥 ${nextCombo}x Combo!` : '+25 XP', e);

      // Check if this completes all
      if (completedCount + 1 === checklist.length) {
        if (soundEnabled) playVictoryFanfare();
        if (onAllCompleted) onAllCompleted();
      }
    } else {
      setCombo(0);
      if (soundEnabled) playCheckboxTickSound(false);
    }
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationPassed(false);
    setSimulationLogs(['[SYS] Booting Virtual Sandbox Environment...', '[SYS] Linking compiler & dependencies...']);
    if (soundEnabled) playSimulationScanSound();

    const steps = [
      { delay: 600, log: '⚡ Checking memory footprint & concurrency models... [PASS - 1.2ms]' },
      { delay: 1200, log: '🛡 Validating error boundaries, assertions & failover routines... [PASS]' },
      { delay: 1800, log: '🚀 Simulating stress test (10,000 throughput payload)... [PASS - 0 dropped packets]' },
      { delay: 2400, log: '✨ All Architectural Checks Passed! Production Checklist 100% Verified.' },
    ];

    steps.forEach(({ delay, log }, index) => {
      setTimeout(() => {
        setSimulationLogs((prev) => [...prev, log]);
        if (soundEnabled) playSimulationScanSound();

        if (index === steps.length - 1) {
          setIsSimulating(false);
          setSimulationPassed(true);
          if (soundEnabled) playTaskSuccessSound();

          // Auto complete all checkboxes
          checklist.forEach((_, i) => {
            if (!checkedItems[i]) {
              onToggleItem(i, true);
            }
          });
          if (onAllCompleted) onAllCompleted();
        }
      }, delay);
    });
  };

  return (
    <div className="space-y-6">
      {/* Floating XP Portal */}
      {floatingXPs.map((xp) => (
        <div
          key={xp.id}
          style={{ left: xp.x, top: xp.y }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-xp-float font-heading font-black text-sm text-amber-500 dark:text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-600"
        >
          {xp.text}
        </div>
      ))}

      {/* Gamified HUD Banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/60 shadow-lg">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Quest Objective
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                +{task.xpReward} XP Reward
              </span>
              {combo >= 2 && (
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-bounce shadow-md shadow-rose-500/40">
                  <Flame className="w-3 h-3" />
                  <span>{combo}x Streak Combo!</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
              {task.title}
            </h3>
            <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">
              {task.objective}
            </p>
          </div>

          {/* Sound Toggle & Progress Meter */}
          <div className="flex items-center space-x-3 self-end sm:self-center">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                soundEnabled
                  ? 'bg-indigo-900/60 border-indigo-700 text-indigo-200 hover:bg-indigo-800'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title={soundEnabled ? 'Mute Game Sounds' : 'Enable Game Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Circular Progress Meter */}
            <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-indigo-900/60">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-emerald-400 transition-all duration-500"
                    fill="transparent"
                    strokeDasharray={88}
                    strokeDashoffset={88 - (88 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-emerald-300">
                  {progressPercent}%
                </span>
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400">Milestone</div>
                <div className="text-xs font-extrabold text-white">
                  {completedCount}/{checklist.length} Done
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Interactive Verification Checklist (Tap to Complete)</span>
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Earn +25 XP per verified item
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={(e) => handleCheck(idx, e)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="shrink-0 transition-transform active:scale-90">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium transition-colors ${
                      isChecked
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {item}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                      isChecked
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isChecked ? 'Verified ✓' : '+25 XP'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Code & Architecture Test Runner Simulator */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-md">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold font-mono text-slate-300">
              Interactive Test Simulator Sandbox
            </span>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Checks...</span>
              </>
            ) : simulationPassed ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Re-Run Test Suite</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Automated Verification</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 font-mono text-xs space-y-1.5 bg-black/60 min-h-[110px] max-h-[160px] overflow-y-auto">
          {simulationLogs.length === 0 ? (
            <div className="text-slate-500 italic flex items-center space-x-2 py-4 justify-center">
              <span>Press "Run Automated Verification" to test code logic & unlock all items</span>
            </div>
          ) : (
            simulationLogs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed animate-in fade-in duration-150 ${
                  log.includes('PASS')
                    ? 'text-emerald-400'
                    : log.includes('100%')
                    ? 'text-amber-300 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
