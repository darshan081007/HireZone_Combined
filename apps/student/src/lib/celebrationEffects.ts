// Synthesized celebration audio chime & particle effects using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a pleasant game-like chord chime (C5 -> E5 -> G5 -> C6)
 */
export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.38);
    });
  } catch (err) {
    // Audio might be blocked by browser autoplay policy until user interacts
  }
}

/**
 * Plays a quick, crisp quest task accomplished ping
 */
export function playTaskSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    // Silent fallback
  }
}

/**
 * Tactile checkmark pop sound for task checklists
 */
export function playCheckboxTickSound(checked = true) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (checked) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (err) {
    // Silent
  }
}

/**
 * Ascending combo streak sound (1x, 2x, 3x, 4x, etc.)
 */
export function playComboSound(streak: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreq = 440; // A4
    const semitones = Math.min(streak * 2, 14);
    const targetFreq = baseFreq * Math.pow(2, semitones / 12);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq * 0.75, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.09);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (err) {}
}

/**
 * Cybernetic scanner beep for running automated code/hardware simulation
 */
export function playSimulationScanSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.06, 0.12].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700 + idx * 250, now + offset);
      gain.gain.setValueAtTime(0.06, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.05);
    });
  } catch (err) {}
}

/**
 * Full victory fanfare on completing entire stage or capstone
 */
export function playVictoryFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, t: 0, d: 0.12 },     // C5
      { f: 659.25, t: 0.12, d: 0.12 },  // E5
      { f: 783.99, t: 0.24, d: 0.14 },  // G5
      { f: 1046.5, t: 0.38, d: 0.38 },  // C6
    ];

    const now = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.2, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  } catch (err) {}
}

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  shape: 'square' | 'circle' | 'strip';
  alpha: number;
}

export function createConfettiCannon(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    '#3B82F6', '#60A5FA', '#10B981', '#34D399',
    '#F59E0B', '#FBBF24', '#8B5CF6', '#A78BFA',
    '#EC4899', '#F472B6', '#06B6D4',
  ];

  const particles: ConfettiParticle[] = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4; // shooting upwards
    const speed = Math.random() * 14 + 10;
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.75,
      vx: (Math.random() - 0.5) * 16,
      vy: -speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 5,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'square' : 'strip',
      alpha: 1,
    });
  }

  let animationFrameId: number;

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vRot;
      p.alpha -= 0.007;

      if (p.alpha > 0 && p.y < canvas.height + 50) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'strip') {
          ctx.fillRect(-p.size, -p.size / 3, p.size * 2, p.size / 1.5);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    }
  };

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
