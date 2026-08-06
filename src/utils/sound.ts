/**
 * Tiny synthesised UI sounds — no audio asset to bundle or sync to the
 * native projects, and nothing to load at runtime.
 */

// A "pop": a quick downward pitch sweep under a percussive envelope.
const POP_START_HZ = 750;
const POP_END_HZ = 150;
const POP_SWEEP_S = 0.08;
const POP_ATTACK_S = 0.006;
const POP_RELEASE_S = 0.16;
const POP_PEAK_GAIN = 0.4;
// exponentialRampToValueAtTime can't reach 0, so ramp to near-silence instead.
const NEAR_SILENT = 0.0001;

/**
 * Wires a single pop into `destination`. Split out from `playPop` so the exact
 * shipped sound can be rendered through an OfflineAudioContext in tests.
 */
export function buildPop(ctx: BaseAudioContext, destination: AudioNode, startAt = ctx.currentTime): OscillatorNode {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(POP_START_HZ, startAt);
  osc.frequency.exponentialRampToValueAtTime(POP_END_HZ, startAt + POP_SWEEP_S);

  gain.gain.setValueAtTime(NEAR_SILENT, startAt);
  gain.gain.exponentialRampToValueAtTime(POP_PEAK_GAIN, startAt + POP_ATTACK_S);
  gain.gain.exponentialRampToValueAtTime(NEAR_SILENT, startAt + POP_RELEASE_S);

  osc.connect(gain).connect(destination);
  osc.start(startAt);
  osc.stop(startAt + POP_RELEASE_S + 0.02);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };

  return osc;
}

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  try {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx ??= new Ctor();
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays the pop. Deliberately best-effort: a WebView that blocks audio outside
 * a user gesture, or has no Web Audio at all, just stays silent rather than
 * breaking the celebration it accompanies.
 */
export function playPop(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    // Suspended contexts resume on the gesture that triggered the celebration.
    if (ctx.state === 'suspended') void ctx.resume();
    buildPop(ctx, ctx.destination, ctx.currentTime);
  } catch {
    /* no sound is fine; never let it surface to the user */
  }
}
