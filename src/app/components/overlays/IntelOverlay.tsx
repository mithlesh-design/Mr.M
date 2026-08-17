import React, { useEffect, useState, useRef, useMemo } from 'react';
import { usePrecisionMode } from '../../context/PrecisionModeContext';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { X, Crosshair, Target, Shield, Cpu, Database, Activity, Globe, Wifi } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   INTEL OVERLAY — Refined HUD System (John Wick / Sci-Fi Style)
   ─────────────────────────────────────────────────────────────────────────
   Design principles:
   1. NON-BLOCKING — content always stays fully readable
   2. ADDITIVE — reveals metadata without obscuring
   3. CONTEXTUAL — adapts readouts to the active section
   4. PERFORMANT — CSS animations over JS intervals where possible
   5. CINEMATIC — transitions feel like a "lens activation"
   6. TACTICAL — Precision targeting reticle and scan lines
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CornerBracket {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
}

const CORNER_BRACKETS: CornerBracket[] = [
  { top: 20, left: 20, borderTop: true, borderLeft: true },
  { top: 20, right: 20, borderTop: true, borderRight: true },
  { bottom: 20, left: 20, borderBottom: true, borderLeft: true },
  { bottom: 20, right: 20, borderBottom: true, borderRight: true },
];

// ── Section-aware intelligence ──────────────────────────────────────────────
interface SectionIntel {
  code: string;
  label: string;
  status: string;
  classification: string;
  icon: React.ElementType;
  dataPoints: { key: string; value: string }[];
}

const SECTION_INTEL: Record<string, SectionIntel> = {
  hero: {
    code: 'OPR-001',
    label: 'OPERATIVE PROFILE',
    status: 'ACTIVE',
    classification: 'LEVEL 7 ALPHA',
    icon: Shield,
    dataPoints: [
      { key: 'DESIGNATION', value: 'SR. UX DESIGNER' },
      { key: 'SPECIALIZATION', value: 'AI × PRODUCT' },
      { key: 'YEARS_ACTIVE', value: '7+' },
      { key: 'THREAT_LEVEL', value: 'ELITE' },
    ],
  },
  impact: {
    code: 'MTR-002',
    label: 'IMPACT TELEMETRY',
    status: 'DECRYPTED',
    classification: 'PERFORMANCE DATA',
    icon: Activity,
    dataPoints: [
      { key: 'AI_PRODUCTS', value: '10+ SHIPPED' },
      { key: 'AVG_ENGAGEMENT', value: '+25% LIFT' },
      { key: 'USABILITY_GAIN', value: '+15% DELTA' },
      { key: 'DATA_INTEGRITY', value: '99.97%' },
    ],
  },
  identity: {
    code: 'DSR-003',
    label: 'DOSSIER ACCESS',
    status: 'UNSEALED',
    classification: 'RESTRICTED FILE',
    icon: Database,
    dataPoints: [
      { key: 'CLEARANCE', value: 'LEVEL 7' },
      { key: 'ORIGIN', value: 'NEW DELHI' },
      { key: 'METHODOLOGY', value: 'HUMAN-CENTERED' },
      { key: 'PHILOSOPHY', value: 'OUTCOME-DRIVEN' },
    ],
  },
  missions: {
    code: 'ARC-004',
    label: 'CASE FILE ARCHIVE',
    status: 'ACCESSIBLE',
    classification: 'TOP SECRET',
    icon: Globe,
    dataPoints: [
      { key: 'TOTAL_MISSIONS', value: '9 INDEXED' },
      { key: 'SECTORS', value: 'AI / SaaS / HEALTH' },
      { key: 'SUCCESS_RATE', value: '100%' },
      { key: 'ENCRYPTION', value: 'AES-256-GCM' },
    ],
  },
  arsenal: {
    code: 'CAP-005',
    label: 'CAPABILITY MATRIX',
    status: 'LOADED',
    classification: 'CLASSIFIED',
    icon: Crosshair,
    dataPoints: [
      { key: 'PRIMARY', value: 'UX STRATEGY' },
      { key: 'SECONDARY', value: 'INTERACTION DESIGN' },
      { key: 'TERTIARY', value: 'FRONTEND DEV' },
      { key: 'PROFICIENCY', value: 'EXPERT TIER' },
    ],
  },
  tools: {
    code: 'TKT-006',
    label: 'TACTICAL LOADOUT',
    status: 'CALIBRATED',
    classification: 'OPERATIONAL',
    icon: Target,
    dataPoints: [
      { key: 'DESIGN_TOOLS', value: 'FIGMA / SKETCH' },
      { key: 'DEV_STACK', value: 'REACT / TS / TW' },
      { key: 'AI_TOOLS', value: 'GPT / MIDJOURNEY' },
      { key: 'SYS_STATUS', value: 'ALL NOMINAL' },
    ],
  },
  ailab: {
    code: 'NRL-007',
    label: 'NEURAL NETWORK',
    status: 'ONLINE',
    classification: 'EXPERIMENTAL',
    icon: Cpu,
    dataPoints: [
      { key: 'MODEL_STATUS', value: 'OPERATIONAL' },
      { key: 'INFERENCE', value: '< 200ms' },
      { key: 'ARCHITECTURE', value: 'TRANSFORMER' },
      { key: 'TRAINING_DATA', value: '7YR EXPERIENCE' },
    ],
  },
  contact: {
    code: 'COM-008',
    label: 'SECURE UPLINK',
    status: 'OPEN',
    classification: 'ENCRYPTED',
    icon: Wifi,
    dataPoints: [
      { key: 'CHANNEL', value: 'E2E ENCRYPTED' },
      { key: 'PROTOCOL', value: 'TLS 1.3' },
      { key: 'RESPONSE_TIME', value: '< 24 HRS' },
      { key: 'AVAILABILITY', value: 'OPEN TO WORK' },
    ],
  },
};

// ── Scramble hook ────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%&';
function useScramble(target: string, active: boolean, delay = 0) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!active) { setDisplay(target); return; } // Show target immediately if not active to avoid layout shift, or empty if desired
    let frame = 0;
    const totalFrames = 20; // Slightly longer for more dramatic effect
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    // Initial random string
    setDisplay(Array(target.length).fill(0).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));

    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        frame++;
        setDisplay(
          target.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (frame / totalFrames > i / target.length) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );
        if (frame >= totalFrames && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 30);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [active, target, delay]);
  return display;
}

// ── Micro signal bars (CSS-only feel) ────────────────────────────────────────
function MicroSignal({ bars = 5, color = '#00D1FF' }: { bars?: number; color?: string }) {
  return (
    <div className="flex items-end" style={{ gap: '1.5px', height: '10px' }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '2px',
            height: `${3 + (i * 2)}px`,
            background: color,
            opacity: 0.4 + (i / bars) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Pulse ring animation ─────────────────────────────────────────────────────
function PulseRing() {
  return (
    <div className="relative" style={{ width: '8px', height: '8px' }}>
      <div
        className="absolute inset-0"
        style={{ background: '#00D1FF', boxShadow: '0 0 4px #00D1FF' }}
      />
      <div
        className="absolute inset-0 animate-ping"
        style={{ background: '#00D1FF', opacity: 0.3 }}
      />
    </div>
  );
}

// ── Targeting Reticle (Follows Mouse) ────────────────────────────────────────
function TargetingReticle() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[90] hidden lg:block"
      style={{ left: smoothX, top: smoothY, x: '-50%', y: '-50%' }}
    >
      {/* Center dot */}
      <div className="w-1 h-1 bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]" />
      
      {/* Outer broken circle */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] opacity-30 animate-[spin_10s_linear_infinite]">
        <circle cx="30" cy="30" r="28" stroke="#00D1FF" strokeWidth="1" fill="none" strokeDasharray="10 20" />
      </svg>
      
      {/* Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[1px] bg-[#00D1FF]/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[40px] bg-[#00D1FF]/20" />
      
      {/* Coordinates label */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-[#00D1FF]/60 whitespace-nowrap">
        <span className="mr-2">TGT_LOCKED</span>
      </div>
    </motion.div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function IntelOverlay() {
  const { mode, setMode } = usePrecisionMode();
  const isActive = mode === 'INTEL';

  const [phase, setPhase] = useState<'boot' | 'active' | 'idle'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);
  
  // Ref tracking
  const prevSectionRef = useRef('hero');

  const currentIntel = SECTION_INTEL[activeSection] || SECTION_INTEL.hero;
  const scrambledCode = useScramble(currentIntel.code, isActive && phase === 'active', 0);
  const scrambledLabel = useScramble(currentIntel.label, isActive && phase === 'active', 80);

  // ── Boot sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isActive) {
      setPhase('boot');
      setElapsed(0);
      const t = setTimeout(() => setPhase('active'), 800); // Slightly longer boot for effect
      return () => clearTimeout(t);
    } else {
      setPhase('idle');
    }
  }, [isActive]);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isActive]);

  // ── Section observer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const sectionIds = ['hero', 'impact', 'identity', 'missions', 'arsenal', 'tools', 'ailab', 'contact'];
    
    // Fallback: update scroll percentage even if observer fails
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.round((window.scrollY / h) * 100) : 0;
      setScrollPct(pct);
      
      // Simple fallback for section detection if observer is flaky
      // (Though observer is preferred for precision)
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        
        if (visible && visible.intersectionRatio > 0.2) {
            const id = visible.target.id;
            if (sectionIds.includes(id)) {
              setActiveSection(id);
              prevSectionRef.current = id;
            }
        }
      },
      { threshold: [0.1, 0.3, 0.5, 0.7] }
    );
    
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive]);


  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const currentTime = useMemo(() => {
    if (!isActive) return '';
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [elapsed, isActive]);

  // Icon for current section
  const IntelIcon = currentIntel.icon;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* ── ACTIVATION FLASH ── */}
          <motion.div
            className="fixed inset-0 z-[101] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,209,255,0.15), transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.1, 1], ease: 'easeOut' }}
          />
          
          {/* ── RETICLE (Desktop only) ── */}
          <TargetingReticle />

          {/* ── MAIN HUD LAYER ── */}
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >

            {/* ── Subtle scan beam (single line, slow) ── */}
            <motion.div
              className="absolute left-0 w-full pointer-events-none"
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,209,255,0.2) 20%, rgba(0,209,255,0.6) 50%, rgba(0,209,255,0.2) 80%, transparent 100%)',
                boxShadow: '0 0 15px rgba(0,209,255,0.15)',
                zIndex: 1
              }}
              animate={{ top: ['-5%', '105%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* ── Background Grid & Vignette ── */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,209,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(5,5,10,0.8) 100%)' }} />
            </div>

            {/* ── CORNER BRACKETS ── */}
            {CORNER_BRACKETS.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                    width: 24, height: 24,
                    borderColor: 'rgba(0,209,255,0.5)',
                    borderStyle: 'solid',
                    borderWidth: 0,
                    borderTopWidth: pos.borderTop ? '1px' : 0,
                    borderBottomWidth: pos.borderBottom ? '1px' : 0,
                    borderLeftWidth: pos.borderLeft ? '1px' : 0,
                    borderRightWidth: pos.borderRight ? '1px' : 0,
                    ...pos
                }}
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: EASE_OUT }}
              />
            ))}

            {/* ── TOP HUD STRIP ── */}
            <motion.div
              className="absolute top-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4 sm:px-8 lg:px-12"
              style={{
                height: '48px',
                background: 'linear-gradient(to bottom, rgba(0,8,12,0.8), transparent)',
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
            >
              {/* Left: Operative + Classification */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-2 py-1 bg-[#00D1FF]/10 border border-[#00D1FF]/20">
                  <PulseRing />
                  <span className="font-mono uppercase text-[9px] tracking-[0.2em] text-[#00D1FF]/80 font-bold">
                    INTEL ACTIVE
                  </span>
                </div>
                <div className="w-[1px] h-[16px] bg-[#00D1FF]/20" />
                <span className="font-mono uppercase hidden sm:inline text-[9px] tracking-[0.15em] text-[#00D1FF]/50">
                  ID: MM-SNRUX-7
                </span>
              </div>

              {/* Right: Clock + Session */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] tracking-[0.1em] text-[#00D1FF]/60">
                    SYS.TIME
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#00D1FF]">
                    {currentTime}
                    </span>
                </div>
                <div className="w-[1px] h-[16px] bg-[#00D1FF]/20" />
                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="font-mono text-[9px] tracking-[0.1em] text-[#00D1FF]/60">
                    SESSION
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#00D1FF] tabular-nums">
                    T+{formatElapsed(elapsed)}
                    </span>
                </div>
              </div>
            </motion.div>

            {/* ── BOTTOM HUD STRIP ── */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4 sm:px-8 lg:px-12"
              style={{
                height: '40px',
                background: 'linear-gradient(to top, rgba(0,8,12,0.9), transparent)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
            >
              {/* Left: Section ID */}
              <div className="flex items-center gap-3">
                <span className="font-mono uppercase text-[9px] tracking-[0.2em] text-[#00D1FF]/60">
                  SECTOR:
                </span>
                <span className="font-mono uppercase text-[10px] tracking-[0.1em] text-[#00D1FF] font-bold bg-[#00D1FF]/5 px-2 py-0.5 border border-[#00D1FF]/10">
                  {activeSection.toUpperCase()}
                </span>
                <span className="font-mono uppercase text-[9px] tracking-[0.1em] text-[#00D1FF]/40 ml-2">
                  // {scrambledCode}
                </span>
              </div>

              {/* Center: Scroll progress bar (Desktop) */}
              <div className="hidden sm:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#00D1FF]/40">
                  SCROLL_DEPTH
                </span>
                <div className="relative w-[120px] h-[2px] bg-[#00D1FF]/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]"
                    style={{ width: `${scrollPct}%` }}
                    layout
                  />
                </div>
                <span className="font-mono text-[8px] tracking-[0.1em] text-[#00D1FF]/60 tabular-nums">
                  {String(scrollPct).padStart(3, '0')}%
                </span>
              </div>

              {/* Right: Encryption */}
              <div className="flex items-center gap-3">
                <MicroSignal />
                <span className="font-mono uppercase hidden sm:inline text-[8px] tracking-[0.2em] text-[#00D1FF]/40">
                  AES-256 ENCRYPTED
                </span>
              </div>
            </motion.div>

            {/* ── CONTEXTUAL INTEL PANEL (Right Sidebar) ── */}
            <motion.div
              className="absolute right-6 top-[55%] -translate-y-1/2 hidden lg:flex flex-col pointer-events-none"
              style={{
                width: '220px',
                background: 'rgba(5,10,15,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,209,255,0.15)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 20px, 20px 0)', // Angled corner cut
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
            >
              {/* Header */}
              <div className="p-4 border-b border-[#00D1FF]/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00D1FF]" />
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-[10px] tracking-[0.2em] text-[#00D1FF]">
                    {scrambledLabel}
                  </span>
                  <IntelIcon className="w-3 h-3 text-[#00D1FF]" />
                </div>
                
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${['ACTIVE','ONLINE','OPEN','LOADED','DECRYPTED','ACCESSIBLE','UNSEALED'].includes(currentIntel.status) ? 'bg-[#00D1FF] shadow-[0_0_6px_#00D1FF]' : 'bg-[#C9A86A]'}`} />
                    <span className="font-mono text-[8px] tracking-[0.1em] text-[#00D1FF]/70">
                        {currentIntel.status}
                    </span>
                </div>
              </div>

              {/* Data Content */}
              <div className="p-4 flex flex-col gap-3 relative">
                 {/* Scanline texture overlay for the panel */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,255,0.02)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />
                 
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentIntel.dataPoints.map((dp, i) => (
                            <div key={dp.key} className="flex flex-col gap-0.5">
                                <div className="flex justify-between items-end border-b border-[#00D1FF]/5 pb-1">
                                    <span className="font-mono text-[7px] tracking-[0.15em] text-[#00D1FF]/40">
                                        {dp.key}
                                    </span>
                                </div>
                                <span className="font-mono text-[10px] tracking-[0.05em] text-[#00D1FF]/90 font-semibold mt-1">
                                    {dp.value}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                 </AnimatePresence>
              </div>

              {/* Footer System Integrity */}
              <div className="p-3 bg-[#00D1FF]/5 border-t border-[#00D1FF]/10">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[7px] tracking-[0.2em] text-[#00D1FF]/50">INTEGRITY</span>
                    <span className="font-mono text-[8px] text-[#00D1FF]">100%</span>
                </div>
                <div className="w-full h-[2px] bg-[#00D1FF]/10 overflow-hidden">
                    <motion.div 
                        className="h-full bg-[#00D1FF]" 
                        initial={{ width: 0 }} 
                        animate={{ width: '100%' }} 
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
              </div>
            </motion.div>

            {/* ── CONTEXTUAL INTEL — MOBILE (Compact Bottom Card) ── */}
            <motion.div
              className="absolute left-4 right-4 lg:hidden pointer-events-none"
              style={{
                bottom: '40px', // Above bottom Safe Area
                background: 'rgba(5,10,15,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,209,255,0.2)',
                padding: '12px 16px',
                zIndex: 100
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.4, ease: EASE_OUT }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-[#00D1FF]/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00D1FF] shadow-[0_0_6px_#00D1FF]" />
                  <span className="font-mono font-bold text-[9px] tracking-[0.2em] text-[#00D1FF]">
                    {currentIntel.label}
                  </span>
                </div>
                <IntelIcon className="w-3 h-3 text-[#00D1FF]/60" />
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {currentIntel.dataPoints.slice(0, 4).map(dp => (
                  <div key={dp.key} className="flex flex-col">
                    <span className="font-mono text-[6px] tracking-[0.15em] text-[#00D1FF]/40">
                      {dp.key}
                    </span>
                    <span className="font-mono text-[9px] text-[#00D1FF]/80 truncate">
                      {dp.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── BOOT SCREEN (Centered Flash) ── */}
            <AnimatePresence>
              {phase === 'boot' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-[110]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center gap-4 bg-black/40 p-8 backdrop-blur-sm border border-[#00D1FF]/20">
                    <div className="font-mono font-bold uppercase text-[12px] tracking-[0.4em] text-[#00D1FF] animate-pulse">
                      ESTABLISHING UPLINK...
                    </div>
                    <div className="w-[160px] h-[1px] bg-[#00D1FF]/20 overflow-hidden relative">
                      <motion.div
                        className="absolute inset-0 bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut', repeat: Infinity }}
                      />
                    </div>
                    <div className="font-mono text-[8px] text-[#00D1FF]/60 tracking-widest">
                        ENCRYPTION KEY: VALIDATED
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── EXIT BUTTON ── */}
            <motion.button
              onClick={() => setMode('STORY')}
              className="absolute pointer-events-auto flex items-center border group overflow-hidden"
              style={{
                top: 70,
                right: 16,
                padding: '6px 14px',
                gap: '8px',
                borderColor: 'rgba(0,209,255,0.3)',
                background: 'rgba(0,10,20,0.8)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
              whileHover={{
                borderColor: 'rgba(0,209,255,0.8)',
                boxShadow: '0 0 15px rgba(0,209,255,0.2)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.35, ease: EASE_OUT }}
              title="Exit Intel Mode (ESC)"
            >
              <span className="absolute inset-0 bg-[#00D1FF]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              <X className="w-3 h-3 text-[#00D1FF]" />
              <span className="font-mono uppercase text-[9px] tracking-[0.15em] text-[#00D1FF]">
                TERMINATE
              </span>
            </motion.button>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
