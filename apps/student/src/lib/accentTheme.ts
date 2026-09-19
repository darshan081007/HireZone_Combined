export type AccentColor = 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export interface AccentDefinition {
  id: AccentColor;
  label: string;
  hex: string;
  previewBg: string;
  classes: {
    btnPrimary: string;
    btnOutline: string;
    badge: string;
    text: string;
    textDark: string;
    activeNav: string;
    border: string;
    borderSubtle: string;
    ring: string;
    bgSubtle: string;
    progressGrad: string;
    glow: string;
  };
}

export const ACCENT_PALETTES: Record<AccentColor, AccentDefinition> = {
  blue: {
    id: 'blue',
    label: 'Ocean Blue',
    hex: '#2563eb',
    previewBg: 'bg-blue-600',
    classes: {
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
      btnOutline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40',
      badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      textDark: 'text-blue-700 dark:text-blue-300',
      activeNav: 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold',
      border: 'border-blue-600 dark:border-blue-500',
      borderSubtle: 'border-blue-200 dark:border-blue-800',
      ring: 'ring-blue-500/25',
      bgSubtle: 'bg-blue-50/70 dark:bg-blue-900/30',
      progressGrad: 'from-blue-600 to-indigo-600',
      glow: 'shadow-[0_0_20px_rgba(37,99,235,0.35)]',
    },
  },
  indigo: {
    id: 'indigo',
    label: 'Cosmic Indigo',
    hex: '#4f46e5',
    previewBg: 'bg-indigo-600',
    classes: {
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
      btnOutline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800',
      text: 'text-indigo-600 dark:text-indigo-400',
      textDark: 'text-indigo-700 dark:text-indigo-300',
      activeNav: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold',
      border: 'border-indigo-600 dark:border-indigo-500',
      borderSubtle: 'border-indigo-200 dark:border-indigo-800',
      ring: 'ring-indigo-500/25',
      bgSubtle: 'bg-indigo-50/70 dark:bg-indigo-900/30',
      progressGrad: 'from-indigo-600 to-violet-600',
      glow: 'shadow-[0_0_20px_rgba(79,70,229,0.35)]',
    },
  },
  emerald: {
    id: 'emerald',
    label: 'Cyber Emerald',
    hex: '#059669',
    previewBg: 'bg-emerald-600',
    classes: {
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
      btnOutline: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400',
      textDark: 'text-emerald-700 dark:text-emerald-300',
      activeNav: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold',
      border: 'border-emerald-600 dark:border-emerald-500',
      borderSubtle: 'border-emerald-200 dark:border-emerald-800',
      ring: 'ring-emerald-500/25',
      bgSubtle: 'bg-emerald-50/70 dark:bg-emerald-900/30',
      progressGrad: 'from-emerald-600 to-teal-600',
      glow: 'shadow-[0_0_20px_rgba(5,150,105,0.35)]',
    },
  },
  violet: {
    id: 'violet',
    label: 'Electric Violet',
    hex: '#7c3aed',
    previewBg: 'bg-violet-600',
    classes: {
      btnPrimary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm',
      btnOutline: 'border border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40',
      badge: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800',
      text: 'text-violet-600 dark:text-violet-400',
      textDark: 'text-violet-700 dark:text-violet-300',
      activeNav: 'bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold',
      border: 'border-violet-600 dark:border-violet-500',
      borderSubtle: 'border-violet-200 dark:border-violet-800',
      ring: 'ring-violet-500/25',
      bgSubtle: 'bg-violet-50/70 dark:bg-violet-900/30',
      progressGrad: 'from-violet-600 to-purple-600',
      glow: 'shadow-[0_0_20px_rgba(124,58,237,0.35)]',
    },
  },
  amber: {
    id: 'amber',
    label: 'Solar Amber',
    hex: '#d97706',
    previewBg: 'bg-amber-600',
    classes: {
      btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm',
      btnOutline: 'border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40',
      badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
      textDark: 'text-amber-800 dark:text-amber-300',
      activeNav: 'bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold',
      border: 'border-amber-600 dark:border-amber-500',
      borderSubtle: 'border-amber-200 dark:border-amber-800',
      ring: 'ring-amber-500/25',
      bgSubtle: 'bg-amber-50/70 dark:bg-amber-900/30',
      progressGrad: 'from-amber-500 to-orange-600',
      glow: 'shadow-[0_0_20px_rgba(217,119,6,0.35)]',
    },
  },
  rose: {
    id: 'rose',
    label: 'Neon Rose',
    hex: '#e11d48',
    previewBg: 'bg-rose-600',
    classes: {
      btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
      btnOutline: 'border border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800',
      text: 'text-rose-600 dark:text-rose-400',
      textDark: 'text-rose-700 dark:text-rose-300',
      activeNav: 'bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold',
      border: 'border-rose-600 dark:border-rose-500',
      borderSubtle: 'border-rose-200 dark:border-rose-800',
      ring: 'ring-rose-500/25',
      bgSubtle: 'bg-rose-50/70 dark:bg-rose-900/30',
      progressGrad: 'from-rose-600 to-pink-600',
      glow: 'shadow-[0_0_20px_rgba(225,29,72,0.35)]',
    },
  },
  cyan: {
    id: 'cyan',
    label: 'Hyper Cyan',
    hex: '#0891b2',
    previewBg: 'bg-cyan-600',
    classes: {
      btnPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm',
      btnOutline: 'border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40',
      badge: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-800',
      text: 'text-cyan-600 dark:text-cyan-400',
      textDark: 'text-cyan-700 dark:text-cyan-300',
      activeNav: 'bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 font-semibold',
      border: 'border-cyan-600 dark:border-cyan-500',
      borderSubtle: 'border-cyan-200 dark:border-cyan-800',
      ring: 'ring-cyan-500/25',
      bgSubtle: 'bg-cyan-50/70 dark:bg-cyan-900/30',
      progressGrad: 'from-cyan-600 to-blue-600',
      glow: 'shadow-[0_0_20px_rgba(8,145,178,0.35)]',
    },
  },
};

export function getAccent(color?: string): AccentDefinition {
  if (color && color in ACCENT_PALETTES) {
    return ACCENT_PALETTES[color as AccentColor];
  }
  return ACCENT_PALETTES.blue;
}
