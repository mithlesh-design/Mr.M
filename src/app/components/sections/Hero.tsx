import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring, useMotionTemplate,
} from 'motion/react';
import { Button } from '../ui/Button';
import { ArrowRight, Crosshair, Activity, Shield, Fingerprint, ChevronDown } from 'lucide-react';
import heroSectionVideo from '@/app/Video/HeroSectionVideo.mp4';
import { EASE_CINEMATIC } from '../../constants';
import { useIsMobile } from '../ui/use-mobile';

/* ─── Category config ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: '7+ YEARS', dot: '#FF2A2A', glow: '#FF2A2A' },
  { label: '+25% ENGAGEMENT', dot: '#00D1FF', glow: '#00D1FF' },
  { label: '+15% USABILITY', dot: '#C9A86A', glow: '#C9A86A' },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  /* ── Refs ─────────────────────────────────────────────────────────────── */
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Category hover ───────────────────────────────────────────────────── */
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  /* ── Glow intensity — rAF + MotionValue (zero re-renders) ────────────── */
  const rawGlowIntensity = useMotionValue(0);
  const glowIntensity = useSpring(rawGlowIntensity, { stiffness: 18, damping: 22 });
  const glowRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (glowRafRef.current) cancelAnimationFrame(glowRafRef.current);
    if (hoveredCategory === null) { rawGlowIntensity.set(0); return; }
    const t0 = performance.now();
    const RAMP_MS = 2000;
    const tick = () => {
      const v = Math.min(1, 0.2 + ((performance.now() - t0) / RAMP_MS) * 0.8);
      rawGlowIntensity.set(v);
      if (v < 1) glowRafRef.current = requestAnimationFrame(tick);
    };
    rawGlowIntensity.set(0.2);
    glowRafRef.current = requestAnimationFrame(tick);
    return () => { if (glowRafRef.current) cancelAnimationFrame(glowRafRef.current); };
  }, [hoveredCategory, rawGlowIntensity]);

  /* ── Mobile detection — reactive to viewport changes ─────────────────── */
  const isMobile = useIsMobile(1024);

  /* ── Spotlight (torch) & 3D Tilt ─────────────────────────────────────── */
  const spotRawX = useMotionValue(50);
  const spotRawY = useMotionValue(50);
  const spotX = useSpring(spotRawX, { stiffness: 120, damping: 20 });
  const spotY = useSpring(spotRawY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(spotY, [0, 100], [12, -12]);
  const rotateY = useTransform(spotX, [0, 100], [-12, 12]);
  const [isInsideImage, setIsInsideImage] = useState(false);

  // Enhanced Cyberpunk/Tactical lighting
  const spotlightBg = useMotionTemplate`radial-gradient(circle 240px at ${spotX}% ${spotY}%, rgba(0, 209, 255, 0.25) 0%, rgba(0, 209, 255, 0.08) 45%, transparent 80%)`;
  const warmTintBg = useMotionTemplate`radial-gradient(circle 140px at ${spotX}% ${spotY}%, rgba(255, 42, 42, 0.3) 0%, transparent 100%)`;

  /* ── Boot status ticker ─────────────────────────────────────────────── */
  const [bootStatus, setBootStatus] = useState('LOADING PROFILE...');
  useEffect(() => {
    const t = setTimeout(() => setBootStatus('PROFILE LOADED \u2713'), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.playbackRate = 0.72;
  }, []);

  /* ── Dust particles ──────────────────────────────────────────────────── */
  const dustParticles = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      id: i,
      width: 1 + (i * 0.37) % 2,
      height: 1 + (i * 0.53) % 2,
      top: (i * 17.3) % 100,
      left: (i * 22.7 + 7) % 100,
      duration: 40 + (i * 4.1) % 20,
      delay: (i * 1.7) % 10,
    })), []);

  /* ── Scroll ──────────────────────────────────────────────────────────── */
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 300], [0, 70]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 160], [1, 0]);

  /* ── Global mouse parallax ───────────────────────────────────────────── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth) - 0.5);
    mouseY.set((e.clientY / window.innerHeight) - 0.5);
  }, []);
  const springCfg = { stiffness: 40, damping: 25 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  /* ── Image parallax (counter-moves for depth illusion) ───────────────── */
  const imgParallaxX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const imgParallaxY = useTransform(smoothY, [-0.5, 0.5], [5, -5]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Derived ────────────────────────────────────────────────────────── */
  const idleGlow = hoveredCategory === null;
  const activeCat = hoveredCategory !== null ? CATEGORIES[hoveredCategory] : null;
  const activeGlow = activeCat?.glow ?? '#FF2A2A';

  /* ════════════════════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      role="banner"
      aria-label="Hero — Mithlesh Mishra, Senior UX Designer"
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center bg-[#050505] selection:bg-[#FF2A2A]/30 selection:text-white"
    >

      {/* ━━━ 1. BACKGROUND ━━━ */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#020202]"
        style={{ x: bgX, y: bgY, scale: 1.02 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {/* Dynamic bleed — hue shifts with category */}
          <motion.div
            className="absolute top-[-10%] left-[5%] w-[600px] h-[900px] blur-[180px] rotate-[-20deg]"
            animate={{
              background: `radial-gradient(ellipse, ${activeGlow}${hoveredCategory !== null ? '12' : '07'} 0%, transparent 70%)`,
              opacity: hoveredCategory !== null ? 0.9 : 0.6,
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          <div className="absolute bottom-0 right-[5%] w-[500px] h-[600px] bg-[#00D1FF]/[0.035] blur-[160px] rotate-[10deg]" />

          {/* Tactical reticle behind image */}
          <div className="absolute right-[3%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" style={{ zIndex: 1 }} aria-hidden="true">
            <svg width="520" height="520" viewBox="0 0 520 520" style={{ opacity: 0.045 }} aria-hidden="true">
              <circle cx="260" cy="260" r="252" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="3 9" />
              <circle cx="260" cy="260" r="190" stroke="white" strokeWidth="0.4" fill="none" />
              <circle cx="260" cy="260" r="128" stroke="white" strokeWidth="0.4" fill="none" strokeDasharray="2 6" />
              <circle cx="260" cy="260" r="66" stroke="white" strokeWidth="0.3" fill="none" />
              <line x1="260" y1="0" x2="260" y2="520" stroke="white" strokeWidth="0.3" />
              <line x1="0" y1="260" x2="520" y2="260" stroke="white" strokeWidth="0.3" />
              <line x1="76" y1="76" x2="100" y2="76" stroke="white" strokeWidth="0.5" />
              <line x1="76" y1="76" x2="76" y2="100" stroke="white" strokeWidth="0.5" />
              <line x1="444" y1="76" x2="420" y2="76" stroke="white" strokeWidth="0.5" />
              <line x1="444" y1="76" x2="444" y2="100" stroke="white" strokeWidth="0.5" />
              <line x1="76" y1="444" x2="100" y2="444" stroke="white" strokeWidth="0.5" />
              <line x1="76" y1="444" x2="76" y2="420" stroke="white" strokeWidth="0.5" />
              <line x1="444" y1="444" x2="420" y2="444" stroke="white" strokeWidth="0.5" />
              <line x1="444" y1="444" x2="444" y2="420" stroke="white" strokeWidth="0.5" />
              <circle cx="260" cy="260" r="3" fill="white" opacity="0.5" />
            </svg>
          </div>

          <div className="absolute inset-0 opacity-30">
            {dustParticles.map(p => (
              <div
                key={`dust-${p.id}`}
                className="absolute bg-white/40 rounded-full blur-[1px] animate-float"
                style={{ width: p.width + 'px', height: p.height + 'px', top: p.top + '%', left: p.left + '%', animationDuration: p.duration + 's', animationDelay: p.delay + 's' }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_100%)] opacity-70" />
        </div>
      </motion.div>

      {/* ━━━ 2. HUD CHROME ━━━ */}
      <div className="absolute inset-0 z-10 pointer-events-none px-6 py-8 md:p-12 flex-col justify-between hidden md:flex">
        <div className="flex justify-between items-start opacity-0 animate-[fadeIn_1s_ease-out_1.4s_forwards]">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <div className="text-[10px] tracking-[0.2em] font-mono text-gray-600">COORDS</div>
            <div className="text-[11px] font-mono text-[#00D1FF]/60">28.6139° N / 77.2090° E</div>
          </div>
          <div className="flex items-center" style={{ gap: '1rem' }}>
            <div className="h-[1px] w-10 bg-white/5" />
            <div className="text-[10px] tracking-[0.2em] font-mono text-gray-600">SYS.VER 4.0</div>
          </div>
        </div>
        <div className="flex justify-between items-end opacity-0 animate-[fadeIn_1s_ease-out_1.4s_forwards]">
          <div className="flex items-center" style={{ gap: '0.5rem' }}>
            <Activity className="w-3 h-3 text-[#FF2A2A] animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] font-mono text-[#FF2A2A]/80">LIVE SIGNAL</span>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-mono text-gray-600 flex flex-col items-end" style={{ gap: '4px' }}>
            <span>OPERATIVE ID: MM-2024</span>
            <span className="text-white/10">CLASSIFIED</span>
          </div>
        </div>
      </div>

      {/* ━━━ 3. MAIN CONTENT ━━━ */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-3 lg:gap-8 items-center h-full pt-0 pb-1 sm:pt-12 sm:pb-8 lg:py-0"
        style={{ y: isMobile ? 0 : textY, opacity: isMobile ? 1 : opacity }}
      >

        {/* ── LEFT: Text column ──────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 relative ml-0 mr-0 lg:mr-[-10px] my-0" style={{ gap: isMobile ? '0.5rem' : '1rem' }}>

          {/* Vertical left accent line */}
          <motion.div
            className="absolute hidden lg:block pointer-events-none"
            style={{ left: -24, top: 0, bottom: 0, width: '1px' }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE_CINEMATIC }}
          >
            <div className="w-full h-full" style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,42,42,0.4) 20%, rgba(255,42,42,0.2) 70%, transparent)',
            }} />
          </motion.div>

          {/* Boot status */}
          <motion.div
            className="flex items-center font-mono"
            style={{ gap: '0.5rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: bootStatus.includes('\u2713') ? '#00D1FF' : '#FF2A2A',
                boxShadow: `0 0 6px ${bootStatus.includes('\u2713') ? '#00D1FF' : '#FF2A2A'}`,
                transition: 'background-color 0.3s ease',
              }}
            />
            <motion.span
              key={bootStatus}
              className="uppercase"
              style={{ fontSize: '8px', letterSpacing: '0.25em', color: bootStatus.includes('\u2713') ? 'rgba(0,209,255,0.6)' : 'rgba(255,42,42,0.5)' }}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {bootStatus}
            </motion.span>
          </motion.div>

          {/* Operative badge */}
          <motion.div
            className="flex items-center flex-wrap w-fit" style={{ gap: '0.5rem' }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            <motion.div
              className="h-[1px] bg-[#FF2A2A] flex-shrink-0 hidden lg:block"
              style={{ boxShadow: '0 0 8px rgba(255,42,42,0.7)' }}
              initial={{ width: 0 }} animate={{ width: '2.5rem' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            />
            <div className="flex items-center font-mono text-[10px] uppercase" style={{ gap: '0.5rem', letterSpacing: '0.25em' }}>
              <span className="text-white/90 font-bold">Mithlesh Mishra</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-gray-500 hidden sm:inline">Senior UX Designer</span>
              <span className="text-gray-500 sm:hidden">Sr. UX Designer</span>
            </div>
            <div className="border rounded-sm font-mono text-[#FF2A2A]/70 uppercase bg-[#FF2A2A]/5 flex-shrink-0"
              style={{ padding: '3px 8px', fontSize: '8px', letterSpacing: '0.2em', borderColor: 'rgba(255,42,42,0.3)' }}>
              LVL 7
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="relative font-bold font-heading leading-[0.92]" style={{ letterSpacing: '0.08em' }}>
            <div className="overflow-hidden">
              <motion.span
                className="block"
                style={{ fontSize: 'clamp(42px, 6vw, 72px)', WebkitTextStroke: '1.5px rgba(255,255,255,0.62)', color: 'transparent', letterSpacing: '0.08em' }}
                initial={{ y: '115%' }} animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE_CINEMATIC, delay: 0.6 }}
              >
                PRECISION
              </motion.span>
            </div>
            <motion.div
              className="flex items-center" style={{ gap: '0.75rem', margin: '0.3rem 0' }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 1.05 }}
            >
              <div className="h-[1px] bg-[#FF2A2A]/50" style={{ width: '2rem' }} />
              <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.32em' }}>by design</span>
              <div className="h-[1px] bg-white/6 flex-1" />
            </motion.div>
            <div className="overflow-hidden">
              <motion.span
                className="block"
                style={{ fontSize: 'clamp(48px, 7vw, 88px)', background: 'linear-gradient(108deg, #ffffff 0%, #e0e0e0 45%, rgba(201,168,106,0.75) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.08em' }}
                initial={{ y: '115%' }} animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE_CINEMATIC, delay: 0.78 }}
              >
                DESIGN
                <motion.span
                  style={{ WebkitTextFillColor: '#FF2A2A', textShadow: '0 0 22px rgba(255,42,42,0.55)' }}
                  animate={{ textShadow: ['0 0 22px rgba(255,42,42,0.55)', '0 0 35px rgba(255,42,42,0.8)', '0 0 22px rgba(255,42,42,0.55)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >.</motion.span>
              </motion.span>
            </div>
          </h1>

          {/* Animated underline accent */}
          <motion.div
            className="relative overflow-hidden rounded-full"
            style={{ height: '2px', maxWidth: '280px' }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 1.3 }}
          >
            <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #FF2A2A 0%, rgba(255,42,42,0.35) 60%, transparent 100%)' }} />
            {/* Traveling shimmer */}
            <motion.div
              className="absolute top-0 h-full"
              style={{ width: '40px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
              animate={{ left: ['-40px', '300px'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut', delay: 2 }}
            />
          </motion.div>

          {/* Brief + chips */}
          <motion.div
            className="flex flex-col" style={{ gap: '0.625rem' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.1 }}
          >
            <div className="relative" style={{ paddingLeft: '1.25rem', maxWidth: '480px' }}>
              <span className="absolute left-0 top-0 w-[1px]"
                style={{ height: '100%', background: 'linear-gradient(to bottom, #00D1FF, rgba(0,209,255,0.35), rgba(0,209,255,0))', boxShadow: '0 0 8px #00D1FF' }}
              />
              <p className="text-gray-400 leading-relaxed font-light" style={{ fontSize: isMobile ? '14px' : '16px', letterSpacing: '0.01em' }}>
                Designing scalable AI-powered products that drive measurable growth and exceptional user experiences.
              </p>
            </div>

            {/* Category chips */}
            <div className="relative">
              <div className="flex flex-nowrap sm:flex-wrap items-center overflow-x-auto sm:overflow-visible scrollbar-none" style={{ gap: '0.5rem', paddingLeft: '1.25rem', paddingBottom: '4px', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {CATEGORIES.map((cat, i) => {
                  const isChipHovered = hoveredCategory === i;
                  return (
                    <motion.div
                      key={i}
                      ref={el => { chipRefs.current[i] = el; }}
                      className="flex items-center border rounded-md cursor-default relative flex-shrink-0"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.2 + i * 0.1, ease: 'easeOut' }}
                      style={{
                        gap: '0.5rem', padding: '5px 11px',
                        borderColor: isChipHovered ? `${cat.glow}60` : 'rgba(255,255,255,0.07)',
                        background: isChipHovered ? `${cat.glow}14` : 'rgba(255,255,255,0.03)',
                        boxShadow: isChipHovered ? `0 0 20px ${cat.glow}28, inset 0 0 10px ${cat.glow}08` : 'none',
                        transition: 'border-color 0.22s ease-out, background 0.22s ease-out, box-shadow 0.22s ease-out',
                      }}
                      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHoveredCategory(i); }}
                      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHoveredCategory(null); }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.dot }}
                        animate={{
                          boxShadow: isChipHovered
                            ? [`0 0 6px ${cat.glow}`, `0 0 16px ${cat.glow}`, `0 0 6px ${cat.glow}`]
                            : `0 0 4px ${cat.glow}80`,
                        }}
                        transition={{ duration: 1, repeat: isChipHovered ? Infinity : 0, ease: 'easeInOut' }}
                      />
                      <span className="font-mono text-gray-400 uppercase" style={{ fontSize: '9px', letterSpacing: '0.18em' }}>
                        {cat.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              {/* Scroll fade hint — mobile only */}
              <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none sm:hidden" style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row" style={{ gap: '0.625rem' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.35 }}
          >
            <motion.div whileTap={{ scale: 0.98 }} className="sm:w-auto">
              <Button
                variant="primary" size="lg"
                onClick={() => scrollTo('identity')}
                className="bg-[#FF2A2A] hover:bg-[#D91E1E] text-white border-0 relative overflow-hidden group w-full sm:w-auto shadow-[0_4px_30px_rgba(255,42,42,0.28)] hover:shadow-[0_4px_44px_rgba(255,42,42,0.46)]"
                style={{ padding: '12px 24px', fontSize: '12px', letterSpacing: '0.12em', fontWeight: 700, transition: 'background 0.22s ease-out, box-shadow 0.22s ease-out' }}
              >
                <span className="relative z-10 flex items-center justify-center" style={{ gap: '0.75rem' }}>
                  VIEW CASE FILES
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out z-0" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }} className="sm:w-auto">
              <Button
                variant="outline" size="lg"
                onClick={() => scrollTo('arsenal')}
                className="group w-full sm:w-auto border border-white/[0.09] bg-white/[0.03] text-gray-300 hover:border-[#00D1FF]/40 hover:text-white hover:shadow-[0_0_20px_rgba(0,209,255,0.10)]"
                style={{ padding: '12px 24px', fontSize: '12px', letterSpacing: '0.12em', fontWeight: 700, backdropFilter: 'blur(8px)', transition: 'border-color 0.22s ease-out, color 0.22s ease-out, box-shadow 0.22s ease-out' }}
              >
                <span className="flex items-center justify-center" style={{ gap: '0.75rem' }}>
                  <Crosshair className="w-4 h-4 text-[#00D1FF] group-hover:rotate-90 transition-transform duration-500" />
                  ACCESS ARSENAL
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: Image column ────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-6 relative order-1 lg:order-2 flex justify-center lg:justify-end items-center">
          {/* Outer wrapper — max-width tracks portrait's max-h × 0.75 per breakpoint */}
          <motion.div
            className="relative w-full mx-auto lg:mx-0 max-w-[calc(38vh*0.75)] sm:max-w-[calc(52vh*0.75)] md:max-w-[calc(54vh*0.75)] lg:max-w-[min(560px,calc(70vh*0.75))]"
            initial={{ opacity: 0, x: isMobile ? 0 : 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE_CINEMATIC }}
          >


            {/* Category hover border ring */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ inset: '-5px', zIndex: 2 }}
              animate={{
                boxShadow: hoveredCategory !== null
                  ? `0 0 28px ${activeGlow}44, 0 0 12px ${activeGlow}28`
                  : '0 0 0px transparent',
                border: hoveredCategory !== null ? `1px solid ${activeGlow}40` : '1px solid transparent',
                opacity: hoveredCategory !== null ? 1 : 0,
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />

            {/* Tactical corner brackets */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
              <motion.div
                key={pos}
                className="absolute pointer-events-none"
                style={{
                  zIndex: 5,
                  ...(pos.startsWith('t') ? { top: -6 } : { bottom: -6 }),
                  ...(pos.endsWith('l') ? { left: -6 } : { right: -6 }),
                }}
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
              >
                <div style={{
                  position: 'absolute', width: 22, height: 1.5,
                  background: '#FF2A2A',
                  boxShadow: '0 0 8px rgba(255,42,42,0.6)',
                  ...(pos.startsWith('t') ? { top: 0 } : { bottom: 0 }),
                  ...(pos.endsWith('l') ? { left: 0 } : { right: 0 }),
                }} />
                <div style={{
                  position: 'absolute', width: 1.5, height: 22,
                  background: '#FF2A2A',
                  boxShadow: '0 0 8px rgba(255,42,42,0.6)',
                  ...(pos.startsWith('t') ? { top: 0 } : { bottom: 0 }),
                  ...(pos.endsWith('l') ? { left: 0 } : { right: 0 }),
                }} />
              </motion.div>
            ))}

            {/* Right-side measurement annotation */}
            <motion.div
              className="absolute pointer-events-none hidden lg:flex items-center"
              style={{ right: -48, top: '30%', zIndex: 5, gap: '6px' }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div style={{ width: 28, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
              <div className="flex flex-col" style={{ gap: '2px' }}>
                <span className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>AR 3:4</span>
                <span className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.15em', color: 'rgba(255,42,42,0.3)' }}>PORTRAIT</span>
              </div>
            </motion.div>

            {/* Portrait with spotlight torch */}
            <motion.div
              ref={imageContainerRef}
              className="relative max-h-[38vh] sm:max-h-[52vh] md:max-h-[54vh] lg:max-h-[70vh]"
              style={{
                aspectRatio: '3/4',
                zIndex: 1,
                background: '#050505',
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
                boxShadow: isInsideImage ? '0 30px 60px -20px rgba(0,209,255,0.15)' : 'none',
                transition: 'box-shadow 0.4s ease-out'
              }}
              onMouseEnter={() => { if (!isMobile) setIsInsideImage(true); }}
              onMouseLeave={() => { 
                if (!isMobile) {
                  setIsInsideImage(false);
                  spotRawX.set(50);
                  spotRawY.set(50);
                }
              }}
              onMouseMove={e => {
                if (isMobile) return;
                const rect = e.currentTarget.getBoundingClientRect();
                spotRawX.set(((e.clientX - rect.left) / rect.width) * 100);
                spotRawY.set(((e.clientY - rect.top) / rect.height) * 100);
              }}
            >

              {/* ── Masked layer: image + vignettes + lighting (blends into bg) ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse 78% 82% at 50% 42%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.6) 52%, rgba(0,0,0,0.2) 66%, transparent 78%)',
                  maskImage: 'radial-gradient(ellipse 78% 82% at 50% 42%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.6) 52%, rgba(0,0,0,0.2) 66%, transparent 78%)',
                }}
              >
                {/* Hero video */}
                <motion.video
                  ref={heroVideoRef}
                  src={heroSectionVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                  style={{ x: isMobile ? 0 : imgParallaxX, y: isMobile ? 0 : imgParallaxY, scale: 1.1 }}
                  animate={{
                    filter: isInsideImage
                      ? 'brightness(1.18) contrast(1.15) saturate(1.12)'
                      : hoveredCategory !== null
                        ? 'brightness(0.98) contrast(1.10) saturate(0.92)'
                        : 'brightness(0.92) contrast(1.08) saturate(0.88)',
                  }}
                  transition={{ duration: 0.42, ease: 'easeOut' }}
                />

                {/* Base vignette — bottom (strongest) */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 18%, rgba(5,5,5,0.25) 40%, rgba(5,5,5,0) 65%)' }}
                />
                {/* Base vignette — top */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.3) 15%, rgba(5,5,5,0) 35%)' }}
                />
                {/* Base vignette — left (strong to prevent cut-off look) */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.5) 12%, rgba(5,5,5,0.15) 25%, transparent 45%)' }}
                />
                {/* Base vignette — right */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to left, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.4) 12%, rgba(5,5,5,0.1) 25%, transparent 45%)' }}
                />
                {/* Radial vignette — center focus */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 65% 60% at 50% 38%, transparent 40%, rgba(5,5,5,0.5) 70%, rgba(5,5,5,0.9) 100%)' }}
                />

                {/* Spotlight torch overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: spotlightBg, opacity: isInsideImage ? 1 : 0, transition: 'opacity 0.35s ease-out' }}
                />

                {/* Warm tint at cursor */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: warmTintBg, mixBlendMode: 'screen', opacity: isInsideImage ? 1 : 0, transition: 'opacity 0.35s ease-out' }}
                />

                {/* Hover lighting boost */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: isInsideImage ? 1 : 0,
                    background: 'radial-gradient(ellipse 65% 60% at 50% 44%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, transparent 80%)',
                    boxShadow: isInsideImage ? 'inset 0 0 60px rgba(0,209,255,0.15)' : 'inset 0 0 0px transparent'
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />

                {/* Category color wash */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: hoveredCategory !== null ? 0.12 : 0,
                    background: `radial-gradient(ellipse at 50% 28%, ${activeGlow}80 0%, transparent 62%)`,
                  }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                />
              </div>

              {/* ── HUD overlays (unmasked, always fully visible) ── */}

              {/* Periodic scan line */}
              <motion.div
                className="absolute left-0 w-full pointer-events-none"
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent 0%, rgba(0,209,255,0.0) 15%, rgba(0,209,255,0.35) 40%, rgba(0,209,255,0.35) 60%, rgba(0,209,255,0.0) 85%, transparent 100%)',
                  boxShadow: '0 0 8px rgba(0,209,255,0.20)',
                  zIndex: 10,
                }}
                animate={{ top: ['-2%', '104%'] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 5.5, ease: 'linear', delay: 2.5 }}
              />

              {/* Biometric data strip at bottom */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ zIndex: 15, padding: '14px 16px 12px' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px' }} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <Shield className="w-3 h-3 text-[#00D1FF]" style={{ opacity: 0.7 }} />
                    <span className="font-mono uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(0,209,255,0.7)' }}>
                      IDENTITY VERIFIED
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <Fingerprint className="w-3 h-3 text-gray-500" style={{ opacity: 0.5 }} />
                    <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)' }}>
                      MM-7YR-SNRUX
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Operational readout overlay — top-left corner */}
              <motion.div
                className="absolute pointer-events-none hidden lg:block"
                style={{
                  top: '14px', left: '14px', zIndex: 15,
                  padding: '8px 10px',
                  background: 'rgba(3,3,3,0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.8, ease: EASE_CINEMATIC }}
              >
                <div className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(255,42,42,0.50)', marginBottom: '4px' }}>
                  THREAT LVL
                </div>
                <div className="flex items-center" style={{ gap: '3px' }}>
                  {[0, 1, 2, 3, 4].map(bar => (
                    <motion.div
                      key={bar}
                      style={{
                        width: '8px',
                        height: '3px',
                        background: bar < 4 ? '#FF2A2A' : 'rgba(255,255,255,0.08)',
                        boxShadow: bar < 4 ? '0 0 4px rgba(255,42,42,0.4)' : 'none',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2, delay: 2.0 + bar * 0.08, ease: 'easeOut' }}
                    />
                  ))}
                  <span className="font-mono ml-1" style={{ fontSize: '7px', color: '#FF2A2A', letterSpacing: '0.05em' }}>HIGH</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Vertical classification stamp */}
            <motion.div
              className="absolute pointer-events-none hidden lg:block"
              style={{ right: -32, bottom: '20%', zIndex: 5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: '7px', letterSpacing: '0.35em',
                  color: 'rgba(255,255,255,0.08)',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                }}
              >
                CLASSIFIED // LEVEL 7
              </span>
            </motion.div>

          </motion.div>
        </div>

      </motion.div>

      {/* ━━━ SCROLL INDICATOR ━━━ */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex pointer-events-none"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer pointer-events-auto"
          style={{ gap: '0.625rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 7, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 2.4, ease: 'easeOut' },
            y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
          }}
          onClick={() => scrollTo('missions')}
        >
          <span className="font-mono text-gray-500 uppercase" style={{ fontSize: '9px', letterSpacing: '0.3em' }}>
            Scroll to decrypt
          </span>
          <ChevronDown className="w-4 h-4 text-[#FF2A2A]/70" />
          <div className="rounded-full"
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,42,42,0.65), rgba(255,42,42,0))' }}
          />
        </motion.div>
      </motion.div>

      {/* Keyframes are defined in global /src/styles/index.css */}
    </section>
  );
}
