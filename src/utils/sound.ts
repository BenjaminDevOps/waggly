/**
 * Tiny synthesised UI sounds — no audio asset to bundle or sync to the
 * native projects, and nothing to load at runtime.
 */

// A confetti-cannon pop is two things at once: a broadband crack as the
// charge lets go, and a short low "body" thumping underneath it. One
// oscillator alone just sounds like a bloop, so both layers are built here.

// Body — the thump. Pitch collapses almost instantly.
const BODY_START_HZ = 260;
const BODY_END_HZ = 55;
const BODY_DROP_S = 0.055;
const BODY_ATTACK_S = 0.002;
const BODY_RELEASE_S = 0.13;
const BODY_GAIN = 0.55;

// Crack — filtered noise burst. Sweeping the band down as it decays reads
// as air escaping rather than as a hiss.
const NOISE_S = 0.12;
const NOISE_BAND_START_HZ = 2200;
const NOISE_BAND_END_HZ = 700;
const NOISE_BAND_Q = 0.8;
const NOISE_ATTACK_S = 0.001;
const NOISE_RELEASE_S = 0.09;
const NOISE_GAIN = 0.4;

// exponentialRampToValueAtTime can't reach 0, so ramp to near-silence instead.
const NEAR_SILENT = 0.0001;

/**
 * Wires a single confetti-cannon pop into `destination`. Split out from
 * `playPop` so the exact shipped sound can be rendered through an
 * OfflineAudioContext in tests.
 */
export function buildPop(ctx: BaseAudioContext, destination: AudioNode, startAt = ctx.currentTime): void {
  // --- body ---
  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();

  body.type = 'sine';
  body.frequency.setValueAtTime(BODY_START_HZ, startAt);
  body.frequency.exponentialRampToValueAtTime(BODY_END_HZ, startAt + BODY_DROP_S);

  bodyGain.gain.setValueAtTime(NEAR_SILENT, startAt);
  bodyGain.gain.exponentialRampToValueAtTime(BODY_GAIN, startAt + BODY_ATTACK_S);
  bodyGain.gain.exponentialRampToValueAtTime(NEAR_SILENT, startAt + BODY_RELEASE_S);

  body.connect(bodyGain).connect(destination);
  body.start(startAt);
  body.stop(startAt + BODY_RELEASE_S + 0.02);
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };

  // --- crack ---
  const frames = Math.ceil(ctx.sampleRate * NOISE_S);
  const noiseBuffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let i = 0; i < frames; i++) samples[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = NOISE_BAND_Q;
  band.frequency.setValueAtTime(NOISE_BAND_START_HZ, startAt);
  band.frequency.exponentialRampToValueAtTime(NOISE_BAND_END_HZ, startAt + NOISE_RELEASE_S);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(NEAR_SILENT, startAt);
  noiseGain.gain.exponentialRampToValueAtTime(NOISE_GAIN, startAt + NOISE_ATTACK_S);
  noiseGain.gain.exponentialRampToValueAtTime(NEAR_SILENT, startAt + NOISE_RELEASE_S);

  noise.connect(band).connect(noiseGain).connect(destination);
  noise.start(startAt);
  noise.stop(startAt + NOISE_S);
  noise.onended = () => { noise.disconnect(); band.disconnect(); noiseGain.disconnect(); };
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
