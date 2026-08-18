import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MmLogo from '../../assets/icons/MmLogo';

interface BootIntroProps {
  onComplete: () => void;
}

// ─── Utility ────────────────────────────────────────────────────────────────
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░';

// ─── Character-scramble text component ──────────────────────────────────────
function ScrambleText({
  text,
  run,
  startDelay = 0,
  className,
  style,
}: {
  text: string;
  run: boolean;
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(
    () => text.split('').map(c => (c === ' ' ? ' ' : '█')).join('')
  );
  const done = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;

    const t0 = setTimeout(() => {
      let frame = 0;
      const maxFrames = 12;

      const tick = () => {
        const locked = Math.floor((frame / maxFrames) * text.length);
        setDisplay(
          text.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < locked) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );
        frame++;
        if (frame <= maxFrames) {
          const t = setTimeout(tick, 38);
          timers.current.push(t);
        } else {
          setDisplay(text);
        }
      };
      tick();
    }, startDelay);

    timers.current.push(t0);
    return () => timers.current.forEach(clearTimeout);
  }, [run, startDelay, text]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
}

// ─── Status rows ─────────────────────────────────────────────────────────────
const STATUS = [
  { key: 'neural', label: 'NEURAL CORE', value: 'ONLINE', accent: '#00D1FF' },
  { key: 'clearance', label: 'CLEARANCE', value: 'LEVEL 7', accent: '#FF2A2A' },
  { key: 'uplink', label: 'UPLINK', value: 'SECURE', accent: '#C9A86A' },
];

// ─── Corner viewfinder brackets ──────────────────────────────────────────────
const CORNERS = [
  { top: '28px', left: '28px', borderWidth: '1.5px 0 0 1.5px' },
  { top: '28px', right: '28px', borderWidth: '1.5px 1.5px 0 0' },
  { bottom: '28px', left: '28px', borderWidth: '0 0 1.5px 1.5px' },
  { bottom: '28px', right: '28px', borderWidth: '0 1.5px 1.5px 0' },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function BootIntro({ onComplete }: BootIntroProps) {
  // phase: -1=click-to-enter | 0=black | 1=scan+frame | 2=name | 3=status | 4=progress | 5=granted
  const [phase, setPhase] = useState(-1);
  const [statusCount, setStatusCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressStarted = useRef(false);
  const bootStarted = useRef(false);

  // ── Start the boot sequence (called after user click) ─────────────────────
  const startBoot = useCallback(() => {
    if (bootStarted.current) return;
    bootStarted.current = true;

    setPhase(0);

    const run = async () => {
      await wait(400); setPhase(1);   // scan beam + frame corners
      await wait(900); setPhase(2);   // name decrypts
      await wait(1000); setPhase(3);  // status panel
      await wait(280); setStatusCount(1);
      await wait(220); setStatusCount(2);
      await wait(220); setStatusCount(3);
      await wait(400); setPhase(4);   // progress bar
      await wait(1200); setPhase(5);  // ACCESS GRANTED
      await wait(700); onComplete();  // exit
    };
    run();
  }, [onComplete]);

  const handleGateClick = () => {
    sessionStorage.setItem('mm-boot-seen', '1');
    startBoot();
  };

  // ── RAF-driven progress counter ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 4 || progressStarted.current) return;
    progressStarted.current = true;
    const duration = 1100;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] overflow-hidden select-none font-mono"
      style={{ background: '#020202', transformOrigin: 'center center' }}
      // TV-shutoff: collapses scaleY → 0 from center, revealing the site behind
      exit={{
        scaleY: 0,
        transition: { duration: 0.48, ease: [0.55, 0, 1, 0.45] },
      }}
    >

      {/* ── PRE-GATE: Click to Initialize ── */}
      {phase === -1 && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleGateClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          role="button"
          aria-label="Click to initialize system and start boot sequence"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGateClick(); }}
        >
          {/* Background atmosphere */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,42,42,0.03) 0%, rgba(2,2,2,0.95) 70%)' }} />

          {/* MM Logo */}
          <motion.div
            className="relative mb-10"
            style={{ height: 'clamp(48px, 10vw, 80px)', aspectRatio: '1060 / 630' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MmLogo />
          </motion.div>

          {/* Pulsing dot + label */}
          <div className="relative z-10 flex items-center" style={{ gap: '10px', marginBottom: '32px' }}>
            <motion.span
              style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#FF2A2A',
                display: 'inline-block',
                boxShadow: '0 0 8px #FF2A2A',
              }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span style={{ fontSize: '9px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              SYSTEM STANDBY
            </span>
          </div>

          {/* Click prompt */}
          <motion.div
            className="relative z-10"
            style={{
              border: '1px solid rgba(255,42,42,0.3)',
              padding: '12px 32px',
              background: 'rgba(255,42,42,0.04)',
              cursor: 'pointer',
            }}
            animate={{ borderColor: ['rgba(255,42,42,0.2)', 'rgba(255,42,42,0.5)', 'rgba(255,42,42,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ background: 'rgba(255,42,42,0.1)', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#FF2A2A', textTransform: 'uppercase', fontWeight: 600 }}>
              CLICK TO INITIALIZE SYSTEM
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* ── ATMOSPHERE ── */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] mix-blend-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.88) 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,42,42,0.06) 0%, rgba(2,2,2,0) 100%)' }}
      />

      {/* ── SCAN BEAM — sweeps top → bottom once ── */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="scanbeam"
            className="absolute left-0 right-0 pointer-events-none z-20"
            style={{
              height: '2px',
              background:
                'linear-gradient(90deg, rgba(2,2,2,0) 0%, rgba(255,255,255,0.55) 25%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.55) 75%, rgba(2,2,2,0) 100%)',
              boxShadow: '0 0 28px 6px rgba(255,255,255,0.18)',
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: 'linear', times: [0, 0.03, 0.97, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── VIEWFINDER CORNER BRACKETS ── */}
      {CORNERS.map((corner, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-10"
          style={{
            width: '22px',
            height: '22px',
            border: '1.5px solid rgba(255,42,42,0.45)',
            ...corner,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
        />
      ))}

      {/* ── CORNER HUD LABELS ── */}
      <motion.div
        className="absolute top-7 left-10 z-10"
        style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <span style={{ fontSize: '7px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
          COORDS
        </span>
        <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(0,209,255,0.45)' }}>
          28.6139° N / 77.2090° E
        </span>
      </motion.div>

      <motion.div
        className="absolute top-7 right-10 z-10 text-right"
        style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <span style={{ fontSize: '7px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
          SYS.VER
        </span>
        <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.22)' }}>
          4.0.2 // CLASSIFIED
        </span>
      </motion.div>

      {/* ── CENTER CONTENT ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full"
        style={{ paddingBottom: '80px' }}
      >

        {/* MM Logo — cinematic reveal */}
        <motion.div
          className="flex items-center justify-center"
          style={{ marginBottom: '24px' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.85 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="relative" style={{ height: 'clamp(48px, 10vw, 80px)', aspectRatio: '1060 / 630' }}>
            <MmLogo />
          </div>
        </motion.div>

        {/* Classification badge */}
        <motion.div
          className="flex items-center"
          style={{ gap: '14px', marginBottom: '28px' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              border: '1px solid rgba(255,42,42,0.55)',
              padding: '4px 12px',
              background: 'rgba(255,42,42,0.05)',
            }}
          >
            <motion.span
              style={{
                width: '5px', height: '5px',
                background: '#FF2A2A',
                display: 'inline-block',
                boxShadow: '0 0 7px #FF2A2A',
              }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span style={{ fontSize: '8px', letterSpacing: '0.32em', color: '#FF2A2A', textTransform: 'uppercase' }}>
              CLASSIFIED
            </span>
          </div>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)' }}>
            FILE: MW-001
          </span>
        </motion.div>

        {/* ── NAME — scramble reveal ── */}
        <motion.div
          className="text-center"
          style={{ marginBottom: '24px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(42px, 7.5vw, 92px)',
              letterSpacing: '0.09em',
              lineHeight: 1,
              color: '#ffffff',
            }}
          >
            <ScrambleText text="MITHLESH " run={phase >= 2} startDelay={0} />
            <ScrambleText
              text="MISHRA"
              run={phase >= 2}
              startDelay={200}
              style={{ color: '#FF2A2A' }}
            />
          </h1>

          {/* Role subtitle */}
          <motion.div
            className="flex items-center justify-center"
            style={{ gap: '14px', marginTop: '14px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <div style={{ height: '1px', width: '36px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase' }}>
              Senior UX Designer
            </span>
            <div style={{ height: '1px', width: '36px', background: 'rgba(255,255,255,0.1)' }} />
          </motion.div>
        </motion.div>

        {/* ── STATUS TERMINAL ── */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              style={{
                width: '288px',
                marginTop: '16px',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '9px',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {STATUS.map((row, i) => (
                <motion.div
                  key={row.key}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: statusCount > i ? 1 : 0,
                    x: statusCount > i ? 0 : -8,
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px' }}>›</span>
                    <span style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                      {row.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '9px', letterSpacing: '0.18em', color: row.accent, fontWeight: 700, textTransform: 'uppercase' }}>
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── BOTTOM PROGRESS BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ padding: '0 48px 40px' }}>
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              style={{ maxWidth: '360px', margin: '0 auto' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <motion.span
                  style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}
                  animate={{ color: phase >= 5 ? '#00D1FF' : 'rgba(255,255,255,0.28)' }}
                  transition={{ duration: 0.35 }}
                >
                  {phase >= 5 ? '■ ACCESS GRANTED' : '■ LOADING OPERATIVE PROFILE'}
                </motion.span>
                <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)' }}>
                  {progress}%
                </span>
              </div>

              <div
                style={{
                  height: '2px',
                  background: 'rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{ height: '100%', width: `${progress}%` }}
                  animate={{
                    background: phase >= 5 ? '#00D1FF' : '#FF2A2A',
                    boxShadow: phase >= 5
                      ? '0 0 10px rgba(0,209,255,0.7)'
                      : '0 0 8px rgba(255,42,42,0.65)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ACCESS GRANTED flash ── */}
      <AnimatePresence>
        {phase === 5 && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            style={{ background: 'rgba(0,209,255,0.055)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.25, 1] }}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
