import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  ExternalLink,
  BookOpen,
  Wrench,
  HelpCircle,
  FileText,
  Send,
  Loader2,
  ChevronRight,
  AlertCircle,
  Award,
  Zap,
  RotateCcw,
  Check,
  Code2,
  Link as LinkIcon,
  Bot,
  ArrowRight,
  ShieldCheck,
  Flame,
  Camera,
  Mic,
  Video,
  ShieldAlert,
  CircleStop,
} from 'lucide-react';
import {
  Project,
  StudentEnrollment,
  StudentProfile,
  RoadmapStage,
  AIEvaluation,
  LearningResource,
} from '../types';
import { api } from '../services/api';
import { TaskCelebrationModal } from './TaskCelebrationModal';
import { TaskGameInteractive } from './TaskGameInteractive';
import { ResourceStudyModal } from './ResourceStudyModal';
import { playTaskSuccessSound, playLevelUpSound } from '../lib/celebrationEffects';

interface CareerJourneyTabProps {
  project: Project | null;
  enrollment: StudentEnrollment | null;
  profile: StudentProfile | null;
  onRefreshJourney: () => void;
  onNavigateToExplore: () => void;
  onNavigateToProfile: () => void;
}

export const CareerJourneyTab: React.FC<CareerJourneyTabProps> = ({
  project,
  enrollment,
  profile,
  onRefreshJourney,
  onNavigateToExplore,
  onNavigateToProfile,
}) => {
  // If no project is enrolled, show explore invitation
  if (!project || !enrollment) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto my-12 shadow-2xs">
        <div className="w-16 h-16 rounded-2xl bg-accent-subtle text-accent-themed flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
          No Active Career Journey Enrolled
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Select your target company and enroll in an industry-inspired project to unlock your interactive treasure-hunt roadmap.
        </p>
        <button
          onClick={onNavigateToExplore}
          className="inline-flex items-center space-x-2 bg-accent-themed hover:brightness-110 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
        >
          <span>Explore Projects & Choose Company</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Active stage management
  const [selectedStageId, setSelectedStageId] = useState<string>(
    enrollment.currentStageId || project.stages[0]?.id || ''
  );

  // Guided task checklist state
  const [checkedTaskItems, setCheckedTaskItems] = useState<{ [key: string]: boolean }>({
    'Power verified with common ground': true,
    'Digital inputs wired to Pin 2 and 3': true,
  });
  const [interactiveTaskChecks, setInteractiveTaskChecks] = useState<{ [key: number]: boolean }>({
    0: true,
  });
  const [isTaskCompleting, setIsTaskCompleting] = useState(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  // NPTEL / Coursera Resource Study Modal state
  const [activeResourceModal, setActiveResourceModal] = useState<LearningResource | null>(null);
  const [studiedResources, setStudiedResources] = useState<{ [id: string]: boolean }>({});

  const handleMarkResourceStudied = async (resourceId: string) => {
    setStudiedResources((prev) => ({ ...prev, [resourceId]: true }));
    try {
      await api.completeTask(resourceId, 50);
      playLevelUpSound();
      setCelebration({
        isOpen: true,
        title: 'NPTEL Module Studied!',
        subtitle: 'You completed this verified academic course module and mastered target engineering principles.',
        xpAwarded: 50,
        stageName: 'Academic Resource Mastery',
        isStageClear: false,
      });
      onRefreshJourney();
    } catch (err) {
      console.error('Error completing resource:', err);
    }
  };

  // Gamification celebration modal state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    xpAwarded: number;
    stageName?: string;
    isStageClear?: boolean;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    xpAwarded: 0,
    stageName: '',
    isStageClear: false,
  });

  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<{ [qId: string]: number }>({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqResult, setMcqResult] = useState<{ score: number; total: number; xp: number } | null>(
    null
  );

  // Final Descriptive Reflection state
  const [descriptiveText, setDescriptiveText] = useState(
    'In my Line Following Robot build, the dual TCRT5000 IR sensor modules detect line boundaries using infrared reflectance differentials between the matte black electrical tape (which absorbs IR light) and the white vinyl poster surface (which reflects light back to the phototransistor). The comparator outputs digital states to microcontroller pins 2 and 3.\n\nDuring testing, our primary calibration challenge was ambient room lighting and specular reflection from glossy tape causing false-white readings. We resolved this by recalibrating onboard potentiometers for the ambient indoor lux and setting a 5mm fixed sensor-to-ground offset.\n\nTo improve the robot for high-speed turns or dashed tracks, I would implement a 5-sensor array with a PID closed-loop control algorithm. This would calculate proportional error from line center and modulate motor PWM smoothly via an H-Bridge, eliminating aggressive oscillations.'
  );
  const [githubUrl, setGithubUrl] = useState('https://github.com/sarveswaran-student/line-follower-robot');
  const [demoUrl, setDemoUrl] = useState('https://youtu.be/sample-lfr-demo');
  const [techNotes, setTechNotes] = useState('Tested with 7.4V Li-ion battery pack and L298N driver.');
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null);
  const [assessmentSuccess, setAssessmentSuccess] = useState(false);

  // Browser-based exam integrity support. This requests permission for a live
  // camera/microphone preview only; it does not record, upload, or identify the
  // student. A real proctored exam would need explicit consent, policy review,
  // secure storage, and a dedicated proctoring provider.
  const [proctoringStarted, setProctoringStarted] = useState(false);
  const [proctoringError, setProctoringError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [integrityWarnings, setIntegrityWarnings] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [integrityPaused, setIntegrityPaused] = useState(false);
  const [integrityPauseReason, setIntegrityPauseReason] = useState('');
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const previewVideoRef = React.useRef<HTMLVideoElement | null>(null);

  const assessmentMcqs = React.useMemo(() => {
    const all = (project?.stages || []).flatMap((stage) => stage.mcqs || []);
    const unique = Array.from(new Map(all.map((q) => [q.id, q])).values());
    return unique.slice(0, 20);
  }, [project]);

  const addIntegrityWarning = (message: string) => {
    setIntegrityWarnings((previous) => [...previous, `${new Date().toLocaleTimeString()} — ${message}`].slice(-12));
  };

  const pauseForIntegrityViolation = (reason: string) => {
    addIntegrityWarning(reason);
    setIntegrityPauseReason(reason);
    setIntegrityPaused(true);
  };

  const resumeAfterIntegrityCheck = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      }
    } catch {
      addIntegrityWarning('Fullscreen could not be restored.');
    }
    setIsFullscreen(Boolean(document.fullscreenElement));
    setIntegrityPaused(false);
    setIntegrityPauseReason('');
  };

  // Attach the stream after React mounts the video element. Previously the
  // stream was assigned before the conditional <video> existed, which caused
  // a black preview even when permission was granted.
  useEffect(() => {
    if (proctoringStarted && previewVideoRef.current && mediaStreamRef.current) {
      previewVideoRef.current.srcObject = mediaStreamRef.current;
      previewVideoRef.current.play().catch(() => undefined);
    }
  }, [proctoringStarted]);

  const startProctoredTest = async () => {
    setProctoringError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setProctoringError('Camera and microphone access is not supported by this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
      setCameraReady(stream.getVideoTracks().some((track) => track.readyState === 'live'));
      setMicReady(stream.getAudioTracks().some((track) => track.readyState === 'live'));
      try {
        await document.documentElement.requestFullscreen?.();
      } catch {
        addIntegrityWarning('Fullscreen permission was not granted.');
      }
      setIsFullscreen(Boolean(document.fullscreenElement));
      setIntegrityWarnings([]);
      setProctoringStarted(true);
    } catch (error) {
      console.error('Media permission error:', error);
      setProctoringError('Permission was denied or the camera/microphone is unavailable. Allow access and try again.');
      setProctoringStarted(false);
    }
  };

  const stopProctoredTest = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (previewVideoRef.current) previewVideoRef.current.srcObject = null;
    setProctoringStarted(false);
    setCameraReady(false);
    setMicReady(false);
    setIsFullscreen(false);
  };

  useEffect(() => () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  // Client-side exam integrity safeguards. These are deterrents and audit signals,
  // not a guarantee against cheating and not a replacement for human proctoring.
  useEffect(() => {
    if (!proctoringStarted) return;

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') addIntegrityWarning('The test tab was hidden or another tab was opened.');
    };
    const onBlur = () => addIntegrityWarning('The test window lost focus.');
    const onFullscreen = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) pauseForIntegrityViolation('Fullscreen mode was exited. The assessment was paused.');
    };
    const blockClipboard = (event: ClipboardEvent) => {
      event.preventDefault();
      pauseForIntegrityViolation(`${event.type.toUpperCase()} was blocked. The assessment was paused to protect test integrity.`);
    };
    const blockContext = (event: MouseEvent) => {
      event.preventDefault();
      pauseForIntegrityViolation('The context menu was blocked. The assessment was paused.');
    };
    const blockSelection = (event: Event) => {
      event.preventDefault();
      pauseForIntegrityViolation('Text selection or dragging was blocked. The assessment was paused.');
    };
    const blockShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x', 'a', 'p', 's'].includes(key)) {
        event.preventDefault();
        pauseForIntegrityViolation(`Keyboard shortcut Ctrl/Cmd+${key.toUpperCase()} was blocked. The assessment was paused.`);
      }
      if (event.key === 'PrintScreen' || event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key))) {
        event.preventDefault();
        pauseForIntegrityViolation('A restricted browser shortcut was pressed. The assessment was paused.');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('copy', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', blockShortcuts);
    document.addEventListener('selectstart', blockSelection);
    document.addEventListener('dragstart', blockSelection);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockShortcuts);
      document.removeEventListener('selectstart', blockSelection);
      document.removeEventListener('dragstart', blockSelection);
    };
  }, [proctoringStarted]);

  // Sync active stage when enrollment changes
  useEffect(() => {
    if (enrollment?.currentStageId) {
      setSelectedStageId(enrollment.currentStageId);
    }
  }, [enrollment?.currentStageId]);

  const stages = project.stages;
  const currentStageIndex = stages.findIndex((s) => s.id === selectedStageId);
  const selectedStage = stages[currentStageIndex] || stages[0];

  const isStageCompleted = (stageId: string) => enrollment.completedStageIds.includes(stageId);
  const isStageUnlocked = (stageIndex: number) => {
    if (stageIndex === 0) return true;
    const prevStage = stages[stageIndex - 1];
    return enrollment.completedStageIds.includes(prevStage.id) || enrollment.currentStageId === stages[stageIndex].id;
  };

  // 1. Handle advancing to next stage
  const handleNextStage = async () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      try {
        await api.updateJourneyProgress(enrollment.id, {
          stageId: selectedStage.id,
          nextStageId: nextStage.id,
        });
        setSelectedStageId(nextStage.id);
        playLevelUpSound();
        setCelebration({
          isOpen: true,
          title: 'Checkpoint Cleared!',
          subtitle: `Unlocked next checkpoint: "${nextStage.title}". Keep up the learning momentum!`,
          xpAwarded: selectedStage.xpReward || 250,
          stageName: nextStage.title,
          isStageClear: true,
        });
        onRefreshJourney();
      } catch (err) {
        console.error('Failed to advance stage:', err);
      }
    }
  };

  // 2. Handle Task Item Toggle & Completion
  const toggleTaskItem = (itemText: string) => {
    setCheckedTaskItems((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const handleCompleteTask = async (taskId: string, xpReward: number) => {
    try {
      setIsTaskCompleting(true);
      await api.completeTask(taskId, xpReward);
      playTaskSuccessSound();
      setCelebration({
        isOpen: true,
        title: 'Task Successfully Completed!',
        subtitle: `You verified all requirements for "${selectedStage.task?.title || selectedStage.title}" with clean engineering standards.`,
        xpAwarded: xpReward,
        stageName: selectedStage.title,
        isStageClear: false,
      });
      setTaskSuccessMsg(`Guided task completed! +${xpReward} XP awarded.`);
      setTimeout(() => setTaskSuccessMsg(''), 4000);
      onRefreshJourney();
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setIsTaskCompleting(false);
    }
  };

  // 3. Handle MCQ Answer Selection & Submission (CRITICAL RULE: 1/5 CONTINUES!)
  const handleSelectMCQ = (qId: string, optionIdx: number) => {
    if (mcqSubmitted) return;
    setMcqAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitMCQ = async () => {
    if (!assessmentMcqs.length) return;
    let score = 0;
    assessmentMcqs.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    try {
      const res = await api.submitMCQAttempt({
        stageId: selectedStage.id,
        score,
        totalQuestions: assessmentMcqs.length,
        answers: mcqAnswers,
      });

      setMcqResult({
        score,
        total: assessmentMcqs.length,
        xp: res.xpAwarded,
      });
      setMcqSubmitted(true);
      playLevelUpSound();
      setCelebration({
        isOpen: true,
        title: 'Concept Checkpoint Proved!',
        subtitle: `Scored ${score}/${assessmentMcqs.length} correct in the project knowledge assessment.`,
        xpAwarded: res.xpAwarded || (score * 50),
        stageName: selectedStage.title,
        isStageClear: false,
      });
      onRefreshJourney();
    } catch (err) {
      console.error('Failed to submit MCQs:', err);
    }
  };

  // 4. Handle Final Descriptive Project Submission
  const handleSubmitDescriptiveAssessment = async () => {
    if (!descriptiveText || descriptiveText.trim().length < 20) return;

    try {
      setIsSubmittingAssessment(true);
      const res = await api.submitDescriptiveAnswer({
        projectId: project.id,
        answerText: descriptiveText,
        githubUrl,
        demoUrl,
        notes: techNotes,
      });

      if (res.submission.evaluation) {
        setAiEvaluation(res.submission.evaluation);
      }
      setAssessmentSuccess(true);
      playLevelUpSound();
      setCelebration({
        isOpen: true,
        title: 'Capstone Project Evaluated by AI!',
        subtitle: `Your technical implementation scored ${res.submission.evaluation?.overallScore ?? res.submission.evaluation?.score ?? 95}/100 with verified proof of work!`,
        xpAwarded: 500,
        stageName: project.title,
        isStageClear: true,
      });
      onRefreshJourney();
    } catch (err) {
      console.error('Failed to submit descriptive assessment:', err);
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Active Project Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                ACTIVE CAREER JOURNEY
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{project.domain}</span>
              <span className="text-slate-400">·</span>
              <span className="text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {project.difficulty} Level
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Progress and XP Meter */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Roadmap Progress:</span>
              <span className="font-bold text-accent-themed">{enrollment.completionPercentage}%</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-accent-themed h-full rounded-full transition-all duration-500"
                style={{ width: `${enrollment.completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Journey XP Earned:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>+{enrollment.totalXpEarned} XP</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gamified Treasure-Hunt Visual Roadmap Nodes */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Interactive Quest Roadmap
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Traverse project checkpoints, complete guided tasks, master NPTEL & Coursera resources, and answer the descriptive question.
            </p>
          </div>

          <span className="hidden sm:inline text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-lg">
            {enrollment.completedStageIds.length} of {stages.length} Checkpoints Cleared
          </span>
        </div>

        {/* Roadmap Trail Flow */}
        <div className="relative py-4">
          {/* Connecting Trail Line */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
            {stages.map((stage, idx) => {
              const completed = isStageCompleted(stage.id);
              const unlocked = isStageUnlocked(idx);
              const isSelected = selectedStage.id === stage.id;

              return (
                <button
                  key={stage.id}
                  id={`roadmap-node-${stage.id}`}
                  onClick={() => {
                    if (unlocked) {
                      setSelectedStageId(stage.id);
                    }
                  }}
                  disabled={!unlocked}
                  className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all group relative cursor-pointer ${
                    isSelected
                      ? 'border-accent-themed bg-accent-subtle shadow-sm ring-2 ring-accent-themed'
                      : completed
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                      : unlocked
                      ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Step Node Icon / Circle */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-2xs transition-all ${
                      completed
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-accent-themed text-white animate-pulse'
                        : unlocked
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : unlocked ? (
                      <span>{stage.stageNumber}</span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Stage Title */}
                  <span
                    className={`text-xs font-heading font-bold line-clamp-2 leading-tight ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-400'
                        : completed
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : unlocked
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stage.title}
                  </span>

                  {/* XP Chip */}
                  <span className="mt-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    +{stage.xpReward} XP
                  </span>

                  {/* Status Indicator */}
                  <span className="mt-1 text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                    {completed ? 'Completed' : unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Selected Checkpoint Details Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8 transition-colors">
        {/* Checkpoint Title & Type */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              <span>CHECKPOINT #{selectedStage.stageNumber}</span>
              <span>·</span>
              <span className="capitalize">{selectedStage.type.replace('_', ' ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
              {selectedStage.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedStage.shortDescription}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Checkpoint XP: +{selectedStage.xpReward}</span>
            </span>

            {isStageCompleted(selectedStage.id) && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cleared</span>
              </span>
            )}
          </div>
        </div>

        {/* 3A. Guided Project Task (Interactive Game Mode) */}
        {selectedStage.task && (
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                  Guided Engineering Quest: {selectedStage.task.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-full">
                Interactive Simulation
              </span>
            </div>

            {/* Task Objective & Engineering Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Quest Objective:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedStage.task.objective}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Engineering Rationale:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedStage.task.explanation}
                </p>
              </div>
            </div>

            {/* Step-by-Step Implementation Instructions */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Step-by-Step Architecture Instructions:
              </span>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedStage.task.instructions.map((ins, idx) => (
                  <li key={idx} className="pl-1">
                    {ins}
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Output Banner */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-bold block mb-1">Expected Verified Output:</span>
              <p>{selectedStage.task.expectedOutput}</p>
            </div>

            {/* Interactive Game Checklist & Virtual Simulator */}
            <TaskGameInteractive
              task={selectedStage.task}
              checklist={selectedStage.task.checklist}
              checkedItems={interactiveTaskChecks}
              onToggleItem={(idx, isChecked) => {
                setInteractiveTaskChecks((prev) => ({ ...prev, [idx]: isChecked }));
                const itemKey = selectedStage.task?.checklist[idx];
                if (itemKey) {
                  setCheckedTaskItems((prev) => ({ ...prev, [itemKey]: isChecked }));
                }
              }}
              onAllCompleted={() => {
                handleCompleteTask(selectedStage.task!.id, selectedStage.task!.xpReward);
              }}
            />

            {/* Manual Completion Fallback */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Check off all items or run the Automated Simulator above to earn your quest completion!
              </div>

              <button
                onClick={() =>
                  handleCompleteTask(selectedStage.task!.id, selectedStage.task!.xpReward)
                }
                disabled={isTaskCompleting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-md"
              >
                {isTaskCompleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Claim Quest Completion (+{selectedStage.task.xpReward} XP)</span>
              </button>
            </div>

            {taskSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
                {taskSuccessMsg}
              </div>
            )}
          </div>
        )}

        {/* 3B. Recommended Learning Resources (NPTEL & Coursera with In-App Study Modal) */}
        {selectedStage.learningResources && selectedStage.learningResources.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                  Academic & Industry Course Modules (NPTEL & Global Curricula)
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click any course to preview syllabus, notes & earn +50 XP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedStage.learningResources.map((res) => {
                const isStudied = !!studiedResources[res.id];
                return (
                  <div
                    key={res.id}
                    onClick={() => setActiveResourceModal(res)}
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all shadow-2xs hover:shadow-md cursor-pointer group ${
                      isStudied
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-800">
                          {res.provider}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {res.estimatedDuration}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        Institution: <span className="font-medium text-slate-700 dark:text-slate-300">{res.institution || 'IIT / Global University'}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                        Skill: {res.skillCovered}
                      </span>

                      <div className="flex items-center space-x-2">
                        {isStudied && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Studied</span>
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveResourceModal(res);
                          }}
                          className="inline-flex items-center space-x-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 group-hover:underline"
                        >
                          <span>Study Modules</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3C. MCQ Knowledge Check (CRITICAL RULE: 1/5 CONTINUES!) */}
        {selectedStage.mcqs && selectedStage.mcqs.length > 0 && (
          <div className="bg-purple-50/40 border border-purple-200/80 rounded-2xl p-5 sm:p-6 space-y-6">
            {/* Optional exam-integrity preview */}
            <div className="rounded-2xl border border-indigo-200 bg-white p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700"><ShieldAlert className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Test environment check</h4>
                  <p className="text-xs text-slate-600 mt-1">Enable a live camera and microphone preview before starting. HireZone does not record or upload this stream.</p>
                </div>
                {!proctoringStarted ? (
                  <button type="button" onClick={startProctoredTest} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">Enable camera & mic</button>
                ) : (
                  <button type="button" onClick={stopProctoredTest} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><CircleStop className="inline w-4 h-4 mr-1" />Stop</button>
                )}
              </div>
              {proctoringStarted && (
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center">
                  <video ref={previewVideoRef} autoPlay muted playsInline className="w-full aspect-video rounded-xl bg-slate-900 object-cover" />
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-700"><Camera className="w-4 h-4" /> Camera: {cameraReady ? 'Ready' : 'Unavailable'}</div>
                    <div className="flex items-center gap-2 text-emerald-700"><Mic className="w-4 h-4" /> Microphone: {micReady ? 'Ready' : 'Unavailable'}</div>
                    <p className="text-slate-500">This is a local preview only. It is not a foolproof anti-cheating system.</p>
                  </div>
                </div>
              )}
              {proctoringError && <p className="text-xs text-red-600">{proctoringError}</p>}
              {proctoringStarted && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                    <span className="text-amber-900">Integrity status</span>
                    <span className={isFullscreen ? 'text-emerald-700' : 'text-amber-700'}>{isFullscreen ? 'Fullscreen active' : 'Fullscreen inactive'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">Tab switches, focus loss, restricted shortcuts and clipboard actions are logged locally as warnings. Camera/mic streams are not uploaded by this client.</p>
                  {integrityWarnings.length > 0 && (
                    <details className="text-[11px] text-amber-900">
                      <summary className="cursor-pointer font-semibold">Warnings ({integrityWarnings.length})</summary>
                      <ul className="mt-2 list-disc pl-4 space-y-1">
                        {integrityWarnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Checkpoint Knowledge Verification (MCQ)
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs font-medium text-purple-800 bg-purple-100/70 px-2.5 py-1 rounded-md">
                  <span>Formative check — low scores never block progress.</span>
                </div>
                <button type="button" onClick={() => window.open('/mcq-test', '_blank', 'noopener,noreferrer')} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                  Open full MCQ test ↗
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {assessmentMcqs.map((mcq, qIdx) => {
                const selectedOption = mcqAnswers[mcq.id];
                return (
                  <div
                    key={mcq.id}
                    className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs space-y-3"
                  >
                    <span className="text-xs font-bold text-slate-800 block">
                      Question {qIdx + 1}: {mcq.question}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mcq.options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        const isCorrect = mcq.correctAnswer === optIdx;
                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (mcqSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-red-50 border-red-300 text-red-700';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-purple-50 border-purple-500 text-purple-800 font-semibold ring-1 ring-purple-500';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectMCQ(mcq.id, optIdx)}
                            className={`text-left p-2.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {mcqSubmitted && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 mt-2">
                        <span className="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                        <p>{mcq.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {integrityPaused && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4" role="alertdialog" aria-modal="true">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-700"><ShieldAlert className="h-6 w-6" /></div>
                    <div><h3 className="text-lg font-bold text-slate-900">Assessment paused</h3><p className="text-xs text-slate-500">Integrity check required</p></div>
                  </div>
                  <p className="text-sm text-slate-700">{integrityPauseReason}</p>
                  <p className="mt-2 text-xs text-slate-500">Return to fullscreen and continue. This event has been logged locally.</p>
                  <button type="button" onClick={resumeAfterIntegrityCheck} className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">Return to test</button>
                </div>
              </div>
            )}

            {/* MCQ Submission & Feedback */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {!mcqSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitMCQ}
                  disabled={!proctoringStarted || Object.keys(mcqAnswers).length < assessmentMcqs.length}
                  className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <span>Submit MCQ Answers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="bg-white border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-900">
                    Result: {mcqResult?.score} / {mcqResult?.total} Correct (+{mcqResult?.xp} XP)
                  </div>
                  <span className="text-xs text-emerald-700 font-medium">
                    ✓ Checkpoint verified. You may continue freely to next stage!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3D. Final Stage: Descriptive Project Question (NOT a mission report) */}
        {selectedStage.type === 'final_challenge' && (
          <div className="bg-gradient-to-tr from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>CAPSTONE ENGINEERING REFLECTION</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Descriptive Project Question
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Synthesize your hands-on calibration, architecture, trade-offs, and debugging experience.
                </p>
              </div>

              <span className="text-xs font-bold text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded-lg">
                Max +300 XP
              </span>
            </div>

            {/* The Question Box */}
            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Project-Specific Prompt:
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                "{project.descriptiveQuestionPrompt}"
              </p>
            </div>

            {/* Answer Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Your Technical Response:</label>
                <span className="text-slate-400">{descriptiveText.split(/\s+/).filter(Boolean).length} words</span>
              </div>

              <textarea
                rows={7}
                value={descriptiveText}
                onChange={(e) => setDescriptiveText(e.target.value)}
                placeholder="Detail your engineering decisions, sensor noise handling, motor control logic, calibration issues, and future scaling plans..."
                className="w-full p-4 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Optional Project Evidence Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">GitHub Repo URL (Optional):</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Demo Video / Link (Optional):</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or Google Drive"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Technical Notes / Evidence:</label>
                <input
                  type="text"
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Battery voltage, motor specs, etc."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitDescriptiveAssessment}
                disabled={isSubmittingAssessment || descriptiveText.trim().length < 20}
                className="inline-flex items-center space-x-2 bg-accent-themed hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isSubmittingAssessment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Engineering Reasoning via Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Submit for AI-Assisted Project Evaluation</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Evaluation Feedback Card */}
            {aiEvaluation && (
              <div className="bg-white border-2 border-indigo-300 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      AI-Assisted Learning Feedback
                    </span>
                    <h4 className="text-lg font-heading font-bold text-slate-900 mt-1">
                      Project Evaluation & Scoring Breakdown
                    </h4>
                    <p className="text-xs text-slate-500">
                      Formative learning feedback evaluated against engineering depth, trade-off clarity, and problem solving.
                    </p>
                  </div>

                  <div className="text-right bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100">
                    <span className="text-xs font-semibold text-slate-600 block">Overall Score</span>
                    <span className="text-3xl font-heading font-bold text-indigo-700">
                      {aiEvaluation.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* 4 Score Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block mb-1">Technical Understanding</span>
                    <span className="text-lg font-bold text-slate-800">
                      {aiEvaluation.technicalUnderstandingScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block mb-1">Project Knowledge</span>
                    <span className="text-lg font-bold text-slate-800">
                      {aiEvaluation.projectKnowledgeScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block mb-1">Problem Solving</span>
                    <span className="text-lg font-bold text-slate-800">
                      {aiEvaluation.problemSolvingScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block mb-1">Clarity & Communication</span>
                    <span className="text-lg font-bold text-slate-800">
                      {aiEvaluation.clarityScore}/100
                    </span>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl">
                    <span className="font-bold text-emerald-900 block mb-2 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Key Engineering Strengths:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-emerald-800">
                      {aiEvaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
                    <span className="font-bold text-amber-900 block mb-2 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Suggested Improvements:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-amber-800">
                      {aiEvaluation.suggestedImprovements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Feedback summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Evaluator Feedback:</span>
                  <p>{aiEvaluation.feedback}</p>
                </div>

                {/* Badges Unlocked Celebration */}
                <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-heading font-bold text-slate-900">
                        Badges Awarded: Project Finisher & Career Ready
                      </h5>
                      <p className="text-xs text-slate-600">
                        +500 Completion XP added to your student profile.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onNavigateToProfile}
                    className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
                  >
                    <span>View in Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation between Checkpoints */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStageIndex > 0) {
                setSelectedStageId(stages[currentStageIndex - 1].id);
              }
            }}
            disabled={currentStageIndex === 0}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>← Previous Checkpoint</span>
          </button>

          {currentStageIndex < stages.length - 1 ? (
            <button
              onClick={handleNextStage}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Next Checkpoint: {stages[currentStageIndex + 1]?.title.slice(0, 20)}...</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNavigateToProfile}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Go to Career Profile</span>
              <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Gamification Task Celebration Modal with Chimes & Confetti */}
      <TaskCelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        subtitle={celebration.subtitle}
        xpAwarded={celebration.xpAwarded}
        totalXp={profile?.totalXp || enrollment.totalXpEarned}
        stageName={celebration.stageName}
        isStageClear={celebration.isStageClear}
      />

      {/* NPTEL & Academic Course Syllabus Reader & Study Modal */}
      <ResourceStudyModal
        resource={activeResourceModal}
        isOpen={!!activeResourceModal}
        onClose={() => setActiveResourceModal(null)}
        onMarkCompleted={handleMarkResourceStudied}
        isCompleted={!!activeResourceModal && !!studiedResources[activeResourceModal.id]}
      />
    </div>
  );
};
