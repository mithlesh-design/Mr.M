import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Sound Names (public API — unchanged)                                     */
/* ══════════════════════════════════════════════════════════════════════════ */

export type SoundName =
  | 'hover' | 'click' | 'ctaHover' | 'navClick'
  | 'bootInitialize' | 'intelActivate' | 'intelDeactivate'
  | 'bootBeep' | 'bootComplete' | 'sectionEnter'
  | 'success' | 'error' | 'transmit' | 'dataStream'
  | 'reticleTarget' | 'moduleDeploy' | 'skillTagHover'
  | 'systemModuleOnline';

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Volume constants                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */

const MASTER_VOL   = 0.42;   // Overall output level (was 0.001 — inaudible)
const AMBIENCE_VOL = 0.065;  // Procedural ambient music bus level

/* ══════════════════════════════════════════════════════════════════════════ */
/*  React context                                                             */
/* ══════════════════════════════════════════════════════════════════════════ */

type SoundContextType = {
  play: (name: SoundName) => void;
  setMasterVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
  volume: number;
};

const SoundContext = createContext<SoundContextType>({
  play: () => {},
  setMasterVolume: () => {},
  muted: false,
  toggleMute: () => {},
  volume: MASTER_VOL,
});

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Module-level Web Audio graph                                              */
/*                                                                            */
/*   sfxBus ──→ limiter ──→ master ──→ destination                           */
/*   reverbBus ──→ 3× delay taps ──→ revLPF ──→ master                      */
/*   ambienceBus ──→ ambiLPF ──→ ambiComp ──→ master                        */
/* ══════════════════════════════════════════════════════════════════════════ */

let ctx:         AudioContext | null = null;
let master:      GainNode     | null = null;
let sfxBus:      GainNode     | null = null;
let reverbBus:   GainNode     | null = null;
let ambienceBus: GainNode     | null = null;

/* ── Ambience state ──────────────────────────────────────────────────────── */

let ambienceBuilt   = false;
let ambienceStopped = false;
let ambienceNodes: {
  oscs:     OscillatorNode[];
  gainNodes: GainNode[];
  pulseId:  ReturnType<typeof setInterval>  | null;
  motifId:  ReturnType<typeof setTimeout>   | null;
} | null = null;

const AMBIENCE_FADE_IN  = 3200;
const AMBIENCE_FADE_OUT = 1200;

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Audio context + routing graph init                                        */
/* ══════════════════════════════════════════════════════════════════════════ */

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;

  const AC = window.AudioContext
    || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;

  ctx = new AC();

  /* ── SFX chain ──────────────────────────────────────────────────────── */
  master = ctx.createGain();
  master.gain.value = MASTER_VOL;

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -12;
  limiter.knee.value       = 8;
  limiter.ratio.value      = 4;
  limiter.attack.value     = 0.002;
  limiter.release.value    = 0.08;

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 1.0;
  sfxBus.connect(limiter);
  limiter.connect(master);

  /* ── Plate reverb bus (3 prime-interval delay taps + feedback) ─────── */
  reverbBus = ctx.createGain();
  reverbBus.gain.value = 0.16;

  const reverbOut = ctx.createGain();
  reverbOut.gain.value = 0.65;

  const revLPF = ctx.createBiquadFilter();
  revLPF.type            = 'lowpass';
  revLPF.frequency.value = 3200;
  revLPF.Q.value         = 0.5;

  /* Use the already-initialised ctx (not null here) */
  const c = ctx;
  [0.047, 0.073, 0.113].forEach(dt => {
    const delay    = c.createDelay(0.5);
    delay.delayTime.value = dt;
    const feedback = c.createGain();
    feedback.gain.value = 0.20;
    reverbBus!.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);   // feedback loop within the delay tap
    delay.connect(reverbOut);
  });

  reverbOut.connect(revLPF);
  revLPF.connect(master);

  /* ── Ambient music bus ──────────────────────────────────────────────── */
  ambienceBus = ctx.createGain();
  ambienceBus.gain.value = 0;   // fades in after user interaction

  const ambiLPF = ctx.createBiquadFilter();
  ambiLPF.type            = 'lowpass';
  ambiLPF.frequency.value = 4200;

  const ambiComp = ctx.createDynamicsCompressor();
  ambiComp.threshold.value = -22;
  ambiComp.ratio.value     = 3;

  ambienceBus.connect(ambiLPF);
  ambiLPF.connect(ambiComp);
  ambiComp.connect(master);

  master.connect(ctx.destination);
  return ctx;
}

export function resumeContext(): boolean {
  const c = getCtx();
  if (!c) return false;
  if (c.state === 'running') return true;
  c.resume().catch(() => {});
  return true;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Helpers                                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */

/** Smooth volume ramp on a GainNode over `ms` milliseconds. */
function rampGain(node: GainNode, to: number, ms: number) {
  if (!ctx) return;
  const now = ctx.currentTime;
  node.gain.cancelScheduledValues(now);
  node.gain.setValueAtTime(node.gain.value, now);
  node.gain.linearRampToValueAtTime(to, now + ms / 1000);
}

/** Fill a mono AudioBuffer with white noise. */
function createNoiseBuffer(c: AudioContext, secs: number): AudioBuffer {
  const len = Math.ceil(c.sampleRate * secs);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Procedural Ambient Music                                                  */
/*                                                                            */
/*  5 layers:                                                                 */
/*  1. Sub drone   — detuned pair at A1 (55 Hz) for deep warmth              */
/*  2. Chord pad   — A minor (A2, C3, E3, A3) with slow LFO filter sweep     */
/*  3. Shimmer     — bandpass noise 4–8 kHz with tremolo LFO                 */
/*  4. Sub pulse   — 60 BPM sine kick at 80→30 Hz (felt, not heard)          */
/*  5. Motif       — random A-minor pentatonic phrases every 12–22 s         */
/* ══════════════════════════════════════════════════════════════════════════ */

function buildAmbience() {
  const c = getCtx();
  if (!c || !ambienceBus || ambienceBuilt) return;
  ambienceBuilt = true;

  const oscs:      OscillatorNode[] = [];
  const gainNodes: GainNode[]       = [];

  /* ── Layer 1: Sub drone ───────────────────────────────────────────── */
  const droneConfig = [
    { freq: 55.0,  type: 'sine'     as OscillatorType, detune: 0,  vol: 0.022 },
    { freq: 55.0,  type: 'sine'     as OscillatorType, detune: 7,  vol: 0.016 }, // +7¢ beating
    { freq: 110.0, type: 'triangle' as OscillatorType, detune: -4, vol: 0.010 }, // A2 harmonic
  ];

  droneConfig.forEach(({ freq, type, detune, vol }) => {
    const osc = c.createOscillator();
    const g   = c.createGain();
    const lpf = c.createBiquadFilter();

    osc.type            = type;
    osc.frequency.value = freq;
    osc.detune.value    = detune;
    g.gain.value        = 0;
    lpf.type            = 'lowpass';
    lpf.frequency.value = 240;
    lpf.Q.value         = 0.7;

    osc.connect(lpf); lpf.connect(g); g.connect(ambienceBus!);
    osc.start();
    rampGain(g, vol, AMBIENCE_FADE_IN);

    oscs.push(osc);
    gainNodes.push(g);
  });

  /* ── Layer 2: A minor chord pad (A2=110, C3=130.8, E3=164.8, A3=220) */
  const padLPF = c.createBiquadFilter();
  padLPF.type            = 'lowpass';
  padLPF.frequency.value = 700;
  padLPF.Q.value         = 1.4;
  padLPF.connect(ambienceBus!);

  /* Slow LFO sweeps filter cutoff ±400 Hz at 0.06 Hz */
  const padLFO     = c.createOscillator();
  const padLFOGain = c.createGain();
  padLFO.frequency.value  = 0.06;
  padLFO.type             = 'sine';
  padLFOGain.gain.value   = 400;
  padLFO.connect(padLFOGain);
  padLFOGain.connect(padLPF.frequency);
  padLFO.start();
  oscs.push(padLFO);

  const padConfig = [
    { freq: 110.0, detune: 0,  vol: 0.018 }, // A2
    { freq: 110.0, detune: 1200, vol: 0.011 }, // A3 (octave)
    { freq: 130.8, detune: 0,  vol: 0.014 }, // C3 minor third
    { freq: 164.8, detune: 5,  vol: 0.012 }, // E3 fifth
    { freq: 220.0, detune: -3, vol: 0.008 }, // A3
  ];

  padConfig.forEach(({ freq, detune, vol }) => {
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.type            = 'sine';
    osc.frequency.value = freq;
    osc.detune.value    = detune;
    g.gain.value        = 0;
    osc.connect(g); g.connect(padLPF);
    osc.start();
    rampGain(g, vol, AMBIENCE_FADE_IN * 1.6);
    oscs.push(osc);
    gainNodes.push(g);
  });

  /* ── Layer 3: High shimmer (bandpass noise + tremolo LFO) ─────────── */
  const shimmerBuf = createNoiseBuffer(c, 6);
  const shimSrc    = c.createBufferSource();
  shimSrc.buffer   = shimmerBuf;
  shimSrc.loop     = true;

  const shimBPF = c.createBiquadFilter();
  shimBPF.type            = 'bandpass';
  shimBPF.frequency.value = 6500;
  shimBPF.Q.value         = 1.8;

  const shimHPF = c.createBiquadFilter();
  shimHPF.type            = 'highpass';
  shimHPF.frequency.value = 4200;

  const shimG = c.createGain();
  shimG.gain.value = 0;

  /* Tremolo LFO on shimmer gain (0.22 Hz, ±0.003) */
  const shimLFO     = c.createOscillator();
  const shimLFOGain = c.createGain();
  shimLFO.frequency.value = 0.22;
  shimLFO.type            = 'sine';
  shimLFOGain.gain.value  = 0.003;
  shimLFO.connect(shimLFOGain);
  shimLFOGain.connect(shimG.gain);
  shimLFO.start();
  oscs.push(shimLFO);

  shimSrc.connect(shimBPF); shimBPF.connect(shimHPF); shimHPF.connect(shimG);
  shimG.connect(ambienceBus!);
  shimSrc.start();
  rampGain(shimG, 0.006, AMBIENCE_FADE_IN * 2.2);
  gainNodes.push(shimG);

  /* ── Layer 4: Sub pulse — felt heartbeat at 60 BPM ───────────────── */
  const pulseId = setInterval(() => {
    if (!ambienceNodes || !ctx || !ambienceBus) return;
    const kick = ctx.createOscillator();
    const kG   = ctx.createGain();
    const kLPF = ctx.createBiquadFilter();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(80, ctx.currentTime);
    kick.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.10);
    kLPF.type            = 'lowpass';
    kLPF.frequency.value = 160;
    kG.gain.setValueAtTime(0, ctx.currentTime);
    kG.gain.linearRampToValueAtTime(0.010, ctx.currentTime + 0.003);
    kG.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    kick.connect(kLPF); kLPF.connect(kG); kG.connect(ambienceBus);
    kick.start(ctx.currentTime);
    kick.stop(ctx.currentTime + 0.18);
  }, 1000); // 60 BPM

  /* ── Layer 5: Occasional melodic motif (A-minor pentatonic) ──────── */
  // A3=220, C4=261.6, D4=293.7, E4=329.6, G4=392, A4=440
  const MOTIF_NOTES = [220, 261.6, 293.7, 329.6, 392.0, 440.0];

  function scheduleMotif() {
    if (!ambienceNodes) return;
    const delay = 12000 + Math.random() * 10000;
    const id = setTimeout(() => {
      if (!ambienceNodes || !ctx || !ambienceBus) return;
      const len   = 3 + Math.floor(Math.random() * 3);
      const start = Math.floor(Math.random() * (MOTIF_NOTES.length - len));

      MOTIF_NOTES.slice(start, start + len).forEach((freq, i) => {
        const mOsc = ctx!.createOscillator();
        const mG   = ctx!.createGain();
        const mPan = ctx!.createStereoPanner();

        mOsc.type            = 'sine';
        mOsc.frequency.value = freq;
        mPan.pan.value       = (Math.random() - 0.5) * 0.5;

        const t = ctx!.currentTime + i * 0.36;
        mG.gain.setValueAtTime(0, t);
        mG.gain.linearRampToValueAtTime(0.0055, t + 0.06);
        mG.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

        mOsc.connect(mG); mG.connect(mPan);
        mPan.connect(ambienceBus!);
        if (reverbBus) mPan.connect(reverbBus); // add space to motif notes
        mOsc.start(t); mOsc.stop(t + 0.65);
      });
      scheduleMotif();
    }, delay);
    ambienceNodes.motifId = id;
  }

  ambienceNodes = { oscs, gainNodes, pulseId, motifId: null };
  scheduleMotif();
}

function startAmbience() {
  if (ambienceStopped) return;
  const c = getCtx();
  if (!c || !ambienceBus) return;
  buildAmbience();
  rampGain(ambienceBus, AMBIENCE_VOL, AMBIENCE_FADE_IN);
}

function stopAmbience() {
  ambienceStopped = true;
  if (ambienceBus) rampGain(ambienceBus, 0, AMBIENCE_FADE_OUT);
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Synth primitives                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */

function env(g: GainNode, now: number, attack: number, decay: number, peak: number, tail = 0.0001) {
  g.gain.cancelScheduledValues(now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(peak, now + attack);
  g.gain.exponentialRampToValueAtTime(tail, now + attack + decay);
}

/** Single oscillator tone with optional reverb send. */
function tone(
  freq: number, type: OscillatorType, dur: number, peak: number,
  pan = 0, detune = 0, attack = 0.003, wet = false,
) {
  const c = getCtx();
  if (!c || !sfxBus) return;
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  const p = c.createStereoPanner();
  o.type = type; o.frequency.value = freq; o.detune.value = detune; p.pan.value = pan;
  env(g, now, attack, Math.max(0.03, dur - attack), peak);
  o.connect(g); g.connect(p); p.connect(sfxBus);
  if (wet && reverbBus) p.connect(reverbBus);
  o.start(now); o.stop(now + dur + 0.05);
}

/** Exponential frequency sweep. */
function sweep(
  f0: number, f1: number, dur: number, peak: number,
  type: OscillatorType = 'sine', wet = false,
) {
  const c = getCtx();
  if (!c || !sfxBus) return;
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, now);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), now + dur);
  env(g, now, 0.008, dur, peak);
  o.connect(g); g.connect(sfxBus);
  if (wet && reverbBus) g.connect(reverbBus);
  o.start(now); o.stop(now + dur + 0.06);
}

/** Bandpass / highpass filtered noise burst. */
function noiseBurst(dur: number, peak: number, hp = 900, lp = 6500) {
  const c = getCtx();
  if (!c || !sfxBus) return;
  const now  = c.currentTime;
  const size = Math.max(256, Math.floor(c.sampleRate * dur));
  const buf  = c.createBuffer(1, size, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
  const src = c.createBufferSource(); src.buffer = buf;
  const hpf = c.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = hp;
  const lpf = c.createBiquadFilter(); lpf.type = 'lowpass';  lpf.frequency.value = lp;
  const g = c.createGain();
  env(g, now, 0.001, dur, peak);
  src.connect(hpf); hpf.connect(lpf); lpf.connect(g); g.connect(sfxBus);
  src.start(now); src.stop(now + dur + 0.04);
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Sound design library                                                      */
/* ══════════════════════════════════════════════════════════════════════════ */

const COOLDOWN_MS: Record<SoundName, number> = {
  hover: 80,           click: 120,         ctaHover: 130,      navClick: 130,
  bootInitialize: 500, intelActivate: 200, intelDeactivate: 200,
  bootBeep: 80,        bootComplete: 300,  sectionEnter: 160,
  success: 200,        error: 200,         transmit: 280,      dataStream: 80,
  reticleTarget: 110,  moduleDeploy: 110,  skillTagHover: 80,
  systemModuleOnline: 160,
};

function playDesign(name: SoundName) {
  switch (name) {

    /* ── Hover: crystalline high tick ──────────────────────────────────── */
    case 'hover':
      tone(3200, 'sine', 0.018, 0.012, 0, 0, 0.001);
      noiseBurst(0.012, 0.003, 4000, 10000);
      break;

    case 'skillTagHover':
      tone(2600, 'sine', 0.018, 0.010, 0, 0, 0.001);
      noiseBurst(0.010, 0.002, 3500, 9000);
      break;

    /* ── Click: sharp mechanical snap ──────────────────────────────────── */
    case 'click':
      noiseBurst(0.008, 0.028, 600, 4200);       // transient body
      tone(420, 'triangle', 0.040, 0.020, 0, 0, 0.001);
      tone(840, 'sine',     0.025, 0.010, 0, 0, 0.001);
      break;

    /* ── Nav click: tactical double beep ───────────────────────────────── */
    case 'navClick':
      tone(1200, 'sine', 0.012, 0.020, 0, 0, 0.001);
      tone(2400, 'sine', 0.020, 0.012, 0, 0, 0.002);  // octave harmonic
      noiseBurst(0.015, 0.005, 2500, 7000);
      break;

    /* ── CTA hover: smooth ascending energy sweep ───────────────────────── */
    case 'ctaHover':
      sweep(480, 1800, 0.18, 0.016, 'sine', true);
      sweep(720, 2600, 0.22, 0.009, 'triangle');
      break;

    /* ── Boot: cinematic multi-stage build ─────────────────────────────── */
    case 'bootInitialize':
      sweep(38, 180,  1.0, 0.038, 'sine');          // deep sub rise
      sweep(76, 320,  0.9, 0.022, 'triangle');       // mid harmonic
      noiseBurst(1.2, 0.008, 500, 2800);             // texture layer
      setTimeout(() => sweep(300, 1000, 0.5, 0.018, 'sine'), 500);
      setTimeout(() => {
        tone(440, 'sine', 0.12, 0.014, 0, 0, 0.010, true);
        tone(880, 'sine', 0.12, 0.009, 0, 0, 0.010, true);
      }, 920);
      break;

    /* ── Boot beep: triple ascending ping ───────────────────────────────── */
    case 'bootBeep':
      tone(900,  'sine', 0.015, 0.018, 0, 0, 0.001);
      setTimeout(() => tone(1200, 'sine', 0.015, 0.015, 0, 0, 0.001), 55);
      setTimeout(() => tone(1800, 'sine', 0.015, 0.012, 0, 0, 0.001), 110);
      break;

    /* ── Boot complete: A-minor chord arpeggio → resolve ────────────────── */
    case 'bootComplete':
      tone(220, 'sine', 0.30, 0.016, -0.3, 0, 0.005, true);  // A2
      setTimeout(() => tone(277, 'sine', 0.30, 0.014,  0.0, 0, 0.005, true), 80);  // C#3
      setTimeout(() => tone(330, 'sine', 0.30, 0.012,  0.3, 0, 0.005, true), 160); // E3
      setTimeout(() => {
        tone(440, 'sine', 0.65, 0.020, 0, 0, 0.010, true);  // A3 resolution
        noiseBurst(0.06, 0.006, 2200, 8000);                 // air sparkle
      }, 240);
      break;

    /* ── Intel activate: electronic surge upward ────────────────────────── */
    case 'intelActivate':
      sweep(220, 2200, 0.30, 0.024, 'sine', true);
      sweep(440, 3300, 0.34, 0.013, 'triangle');
      noiseBurst(0.14, 0.006, 2000, 9000);
      setTimeout(() => tone(1100, 'sine', 0.18, 0.012, 0, 0, 0.005, true), 220);
      break;

    /* ── Intel deactivate: reverse surge ────────────────────────────────── */
    case 'intelDeactivate':
      sweep(2200, 220, 0.30, 0.024, 'sine', true);
      sweep(3300, 440, 0.34, 0.013, 'triangle');
      noiseBurst(0.09, 0.005, 1500, 6500);
      break;

    /* ── Section enter: deep ambient whoosh ─────────────────────────────── */
    case 'sectionEnter':
      noiseBurst(0.14, 0.010, 380, 3200);
      sweep(260, 75, 0.15, 0.014, 'sine');
      break;

    /* ── Success: C-major chime chord ───────────────────────────────────── */
    case 'success':
      tone(523.2, 'sine', 0.28, 0.020, -0.25, 0, 0.005, true); // C5
      setTimeout(() => tone(659.3, 'sine', 0.28, 0.017, 0.00, 0, 0.005, true), 70);  // E5
      setTimeout(() => tone(783.9, 'sine', 0.34, 0.015, 0.25, 0, 0.005, true), 140); // G5
      break;

    /* ── Error: maximum dissonance (minor second beating) ───────────────── */
    case 'error':
      tone(260, 'square', 0.16, 0.020, -0.15, 0, 0.003);
      tone(277, 'square', 0.18, 0.017,  0.15, 0, 0.003);  // m2 = harsh beating
      setTimeout(() => tone(240, 'square', 0.15, 0.015), 190);
      break;

    /* ── Transmit: two-burst radio crackle ──────────────────────────────── */
    case 'transmit':
      noiseBurst(0.08, 0.018, 1200, 5500);
      sweep(900, 1400, 0.08, 0.020, 'square');
      setTimeout(() => {
        noiseBurst(0.055, 0.009, 1500, 6500);
        sweep(1400, 1900, 0.055, 0.013, 'square');
      }, 65);
      break;

    /* ── Data stream: short random-pitch blip ───────────────────────────── */
    case 'dataStream':
      tone(
        1100 + Math.random() * 900, 'sine', 0.018, 0.007,
        0, Math.random() * 14 - 7, 0.001,
      );
      break;

    /* ── Reticle target: precision lock tone ────────────────────────────── */
    case 'reticleTarget':
      tone(2000, 'sine', 0.012, 0.020, 0, 0, 0.001);
      setTimeout(() => {
        tone(2000, 'sine', 0.07, 0.016, 0, 0, 0.001, true);
        tone(4000, 'sine', 0.05, 0.009, 0, 0, 0.001);
      }, 65);
      break;

    /* ── Module deploy: punch + descending sweep ────────────────────────── */
    case 'moduleDeploy':
      noiseBurst(0.065, 0.018, 750, 3500);
      sweep(520, 140, 0.11, 0.024, 'triangle');
      setTimeout(() => tone(600, 'sine', 0.07, 0.012, 0, 0, 0.003), 55);
      break;

    /* ── System module online: ascending A-minor arpeggio ───────────────── */
    case 'systemModuleOnline':
      tone(440, 'sine', 0.14, 0.015, -0.25, 0, 0.004, true);  // A3
      setTimeout(() => tone(554, 'sine', 0.14, 0.013,  0.00, 0, 0.004, true), 75);  // C#4
      setTimeout(() => tone(659, 'sine', 0.20, 0.013,  0.25, 0, 0.004, true), 150); // E4
      setTimeout(() => tone(880, 'sine', 0.28, 0.011,  0.00, 0, 0.005, true), 225); // A4
      break;

    default: break;
  }
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Provider                                                                  */
/* ══════════════════════════════════════════════════════════════════════════ */

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mm-sound-muted') === 'true';
  });
  const [volume, setVolume] = useState(MASTER_VOL);
  const lastPlayedRef = useRef<Record<string, number>>({});

  /* Sync mute/volume state → audio graph */
  useEffect(() => {
    const c = getCtx();
    if (!c || !master) return;
    if (muted) {
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(0, c.currentTime);
      stopAmbience();
    } else {
      master.gain.setTargetAtTime(volume, c.currentTime, 0.015);
      ambienceStopped = false;
      if (c.state === 'running') startAmbience();
    }
  }, [muted, volume]);

  /* Unlock AudioContext on first user interaction (browser autoplay policy) */
  useEffect(() => {
    let removed = false;
    const unlock = () => {
      const c = getCtx();
      if (!c) return;
      const onRunning = () => {
        if (removed) return;
        removed = true;
        window.removeEventListener('click',      unlock, { capture: true });
        window.removeEventListener('keydown',    unlock, { capture: true });
        window.removeEventListener('touchstart', unlock, { capture: true });
        setMuted(prev => {
          if (!prev) { ambienceStopped = false; startAmbience(); }
          return prev;
        });
      };
      if (c.state === 'running') onRunning();
      else c.resume().then(onRunning).catch(() => {});
    };
    window.addEventListener('click',      unlock, { capture: true });
    window.addEventListener('keydown',    unlock, { capture: true });
    window.addEventListener('touchstart', unlock, { capture: true });
    return () => {
      removed = true;
      window.removeEventListener('click',      unlock, { capture: true });
      window.removeEventListener('keydown',    unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
    };
  }, []);

  const play = useCallback((name: SoundName) => {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    const cooldown = COOLDOWN_MS[name] ?? 0;
    if (cooldown > 0) {
      const now  = performance.now();
      const last = lastPlayedRef.current[name] ?? 0;
      if (now - last < cooldown) return;
      lastPlayedRef.current[name] = now;
    }
    playDesign(name);
  }, [muted]);

  const setMasterVolume = useCallback(
    (v: number) => setVolume(Math.max(0, Math.min(1, v))),
    [],
  );

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      if (!next) resumeContext();
      localStorage.setItem('mm-sound-muted', String(next));
      window.dispatchEvent(new CustomEvent('mm-audio-toggle', { detail: { muted: next } }));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ play, setMasterVolume, muted, toggleMute, volume }),
    [play, setMasterVolume, muted, toggleMute, volume],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Hooks (public API — unchanged)                                            */
/* ══════════════════════════════════════════════════════════════════════════ */

export function useSoundEngine() { return useContext(SoundContext); }
export function useSoundHover()  { const { play } = useSoundEngine(); return { onMouseEnter: () => play('hover') }; }
export function useSoundClick(sound: SoundName = 'click') {
  const { play } = useSoundEngine();
  return { onMouseDown: () => play(sound) };
}
export const useSound = useSoundEngine;
