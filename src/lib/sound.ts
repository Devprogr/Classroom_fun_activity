let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  startTime: number,
  frequency: number,
  duration: number,
  peakGain: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/**
 * Soft two-note rising chime for awarding points. Kept quiet (low peak gain)
 * and free of harsh overtones (pure sine waves) so it's usable in front of a
 * grade 4/5 class without startling anyone.
 */
export function playPointsAddedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, now, 587.33, 0.16, 0.05); // D5
  playTone(ctx, now + 0.09, 880, 0.22, 0.06); // A5
}

/** Soft two-note falling tone for removing points. Gentle, not a buzzer. */
export function playPointsRemovedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, now, 493.88, 0.16, 0.05); // B4
  playTone(ctx, now + 0.09, 349.23, 0.22, 0.05); // F4
}

/** Plays the added/removed chime based on the sign of a points value. */
export function playPointsSound(value: number) {
  if (value > 0) playPointsAddedSound();
  else if (value < 0) playPointsRemovedSound();
}
