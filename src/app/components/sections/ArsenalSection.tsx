import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, PenTool, Layers, Cpu, Search, Zap, Code, Target,
  ArrowRight,
} from 'lucide-react';
import { useSound } from '../../audio/AudioSystem';
import operativeImg from '@/assets/eb361c490c8f064b7012dac934f5a70d457978dc.png';
import { useIsMobile } from '../ui/use-mobile';

// ─────────────────────────────────────────────────────────────
//  CINEMATIC EASING LANGUAGE
// ─────────────────────────────────────────────────────────────
const SINE: [number, number, number, number] = [0.37, 0, 0.63, 1];
const CUBIC: [number, number, number, number] = [0.33, 1, 0.68, 1];
const QUART: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  label: string;
  align: 'left' | 'right';
  desc: string;
  pDelay: number;
  icon: React.ElementType;
  proficiency: number; // 0-1, drives the subtle indicator bar
}

const services: ServiceItem[] = [
  { id: 'UX-01', label: 'UX Strategy & Leadership', align: 'left', desc: 'Tactical roadmaps that convert intent into measurable outcomes.', pDelay: 0.00, icon: Compass, proficiency: 0.95 },
  { id: 'PD-02', label: 'Product Design', align: 'left', desc: 'Surgical-precision interfaces from wire to pixel-perfect.', pDelay: 0.55, icon: PenTool, proficiency: 0.92 },
  { id: 'DS-03', label: 'Design Systems', align: 'left', desc: 'Scalable component libraries built for rapid output.', pDelay: 1.10, icon: Layers, proficiency: 0.90 },
  { id: 'AI-04', label: 'AI Integration', align: 'left', desc: 'Fusing neural intelligence with seamless interaction.', pDelay: 1.65, icon: Cpu, proficiency: 0.85 },
  { id: 'UR-05', label: 'User Research', align: 'right', desc: 'Deep intelligence gathering for informed decisions.', pDelay: 0.28, icon: Search, proficiency: 0.88 },
  { id: 'PR-06', label: 'Prototyping', align: 'right', desc: 'High-fidelity simulations for pre-launch validation.', pDelay: 0.83, icon: Zap, proficiency: 0.91 },
  { id: 'FC-07', label: 'Frontend Ops', align: 'right', desc: 'Bridging design vision and React execution.', pDelay: 1.38, icon: Code, proficiency: 0.80 },
  { id: 'CD-08', label: 'Creative Direction', align: 'right', desc: 'Leading teams toward mission-critical outcomes.', pDelay: 1.93, icon: Target, proficiency: 0.87 },
];

// ─────────────────────────────────────────────────────────────
//  SIGNAL LINE GEOMETRY  (1000 x 600 SVG viewBox)
//  Character torso origin (500, 215)
//  L-col right edge ~ 248   R-col left edge ~ 752
// ─────────────────────────────────────────────────────────────
interface LineData {
  id: string; align: 'left' | 'right';
  x2: number; y2: number; len: number; pDelay: number;
}
const ORIG = { x: 500, y: 215 };
const LINES: LineData[] = (() => {
  const lft = services.filter(s => s.align === 'left');
  const rgt = services.filter(s => s.align === 'right');
  const totalH = lft.length * 64 + (lft.length - 1) * 4;
  const sy = (600 - totalH) / 2;
  return services.map(s => {
    const side = s.align === 'left' ? lft : rgt;
    const idx = side.findIndex(x => x.id === s.id);
    const y2 = sy + idx * 68 + 32;
    const x2 = s.align === 'left' ? 248 : 752;
    return { id: s.id, align: s.align, x2, y2, len: Math.hypot(x2 - ORIG.x, y2 - ORIG.y), pDelay: s.pDelay };
  });
})();

// ─────────────────────────────────────────────────────────────
//  AMBIENT DUST PARTICLES  (stable module-level)
// ─────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 11 }, (_, i) => ({
  id: i,
  x: 6 + ((i * 13.7 + i * i * 0.8) % 88),
  y: 8 + ((i * 11.3 + i * 2.1) % 80),
  r: 0.55 + (i % 3) * 0.25,
  opacity: 0.028 + (i % 4) * 0.010,
  dur: 15 + (i * 2.9) % 10,
  delay: i * 1.75,
  dy: -(14 + (i % 5) * 10),
  dx: (i % 7 - 3) * 11,
}));

// ─────────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ArsenalSection() {
  const { play } = useSound();
  const [activeService, setActiveService] = useState<string | null>(null);

  /* -- Mobile detection (reactive) -- */
  const isMobile = useIsMobile(1024);
  const isSmallMobile = useIsMobile(769);


  const isHovering = activeService !== null;
  const activeData = services.find(s => s.id === activeService) ?? null;
  const leftServices = services.filter(s => s.align === 'left');
  const rightServices = services.filter(s => s.align === 'right');

  // ═══════════════════════════════════════════════════════════════
  //  MOBILE LAYOUT — "Classified Dossier" Pattern
  //  Single-column intel cards, atmospheric operative watermark,
  //  tap-to-engage interaction, visible proficiency bars.
  //  Desktop code below remains completely untouched.
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section className="relative bg-[#050505] overflow-hidden">
        {/* ═══ MOBILE ATMOSPHERIC BACKGROUND ═══ */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Single subtle ambient glow */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 70% 40% at 50% 20%, rgba(255,42,42,0.04) 0%, transparent 70%)',
            }}
          />
          {/* Operative ghost watermark */}
          <div
            style={{
              position: 'absolute',
              top: '40px', left: '50%', transform: 'translateX(-50%)',
              width: isSmallMobile ? '280px' : '340px',
              height: isSmallMobile ? '360px' : '420px',
              opacity: 0.045, pointerEvents: 'none',
              maskImage: 'radial-gradient(ellipse 65% 75% at 50% 38%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 55%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse 65% 75% at 50% 38%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 55%, transparent 78%)',
            }}
          >
            <img src={operativeImg} alt="" aria-hidden="true" loading="lazy" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.5) saturate(0) contrast(1.2)' }}
            />
          </div>
          {/* Cinematic scan line */}
          <motion.div
            style={{
              position: 'absolute', left: 0, right: 0, height: '1px',
              background: 'linear-gradient(to right, transparent 5%, rgba(255,42,42,0.10) 25%, rgba(255,42,42,0.28) 50%, rgba(255,42,42,0.10) 75%, transparent 95%)',
              boxShadow: '0 0 8px rgba(255,42,42,0.15)',
            }}
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 6, ease: 'linear', repeat: Infinity, repeatDelay: 12, delay: 2 }}
          />
          {/* Edge vignettes */}
          <div style={{
            position: 'absolute', inset: 0,
            background: [
              'linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, transparent 10%, transparent 88%, rgba(5,5,5,0.75) 100%)',
              'linear-gradient(to right, rgba(5,5,5,0.45) 0%, transparent 8%, transparent 92%, rgba(5,5,5,0.45) 100%)',
            ].join(', '),
          }} />
          {/* Subtle centre crosshair */}
          <div style={{ position: 'absolute', top: isSmallMobile ? '180px' : '200px', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: '1px', height: '60px', top: '-30px', left: '0', background: 'linear-gradient(to bottom, transparent, rgba(255,42,42,0.06), transparent)' }} />
            <div style={{ position: 'absolute', height: '1px', width: '60px', left: '-30px', top: '0', background: 'linear-gradient(to right, transparent, rgba(255,42,42,0.06), transparent)' }} />
          </div>
          {/* Ambient dust — reduced for mobile */}
          {PARTICLES.slice(0, 5).map(p => (
            <motion.div key={p.id} className="absolute rounded-full"
              style={{ width: `${p.r * 2}px`, height: `${p.r * 2}px`, left: `${p.x}%`, top: `${p.y}%`, backgroundColor: 'rgba(255,255,255,0.85)' }}
              animate={{ y: [0, p.dy * 0.6, 0], opacity: [0, p.opacity * 0.7, p.opacity, p.opacity * 0.7, 0] }}
              transition={{
                y: { duration: p.dur, ease: SINE, repeat: Infinity, delay: p.delay },
                opacity: { duration: p.dur * 0.8, ease: SINE, repeat: Infinity, delay: p.delay },
              }}
            />
          ))}
        </div>

        {/* ═══ MOBILE CONTENT ═══ */}
        <div className="relative z-10" style={{ padding: isSmallMobile ? '64px 20px 80px' : '72px 24px 88px', maxWidth: '540px', margin: '0 auto' }}>
          {/* ─── SECTION HEADER ─── */}
          <motion.div
            style={{ marginBottom: isSmallMobile ? '36px' : '44px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: CUBIC }}
            viewport={{ once: true }}
          >
            <div className="flex items-center" style={{ gap: '10px', marginBottom: '16px' }}>
              <motion.div className="bg-[#FF2A2A] rounded-full flex-shrink-0"
                style={{ width: '5px', height: '5px', boxShadow: '0 0 8px rgba(255,42,42,0.7)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2.2, ease: SINE, repeat: Infinity }}
              />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>
                Operational Loadout
              </span>
              <div style={{ height: '1px', width: '24px', background: 'rgba(255,42,42,0.18)' }} />
            </div>
            <h2 className="font-heading font-bold text-white leading-none"
              style={{ fontSize: isSmallMobile ? '36px' : '42px', letterSpacing: '0.09em', marginBottom: '14px' }}>
              THE{' '}
              <span style={{ WebkitTextStroke: '1.2px rgba(255,255,255,0.40)', color: 'transparent' }}>ARSENAL</span>
            </h2>
            <motion.p className="font-manrope"
              style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.38)', maxWidth: '340px', margin: 0, marginBottom: '20px' }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: CUBIC, delay: 0.12 }}
              viewport={{ once: true }}
            >
              Core capabilities refined across 7+ years of designing high-impact digital products.
            </motion.p>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <span className="rounded-full animate-pulse" style={{ width: '5px', height: '5px', backgroundColor: '#00D1FF', boxShadow: '0 0 6px #00D1FF', flexShrink: 0 }} />
              <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>8 Capabilities Active</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
            </div>
          </motion.div>

          {/* ─── CAPABILITY CARDS ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isSmallMobile ? '10px' : '12px' }}>
            {services.map((service, i) => (
              <MobileCapabilityCard
                key={service.id}
                service={service}
                index={i}
                isActive={activeService === service.id}
                onTap={() => {
                  setActiveService(prev => (prev === service.id ? null : service.id));
                  play('moduleDeploy');
                }}
                isSmallMobile={isSmallMobile}
              />
            ))}
          </div>

          {/* ─── CTA ─── */}
          <motion.div className="flex justify-center" style={{ marginTop: isSmallMobile ? '44px' : '52px' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: CUBIC, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <a href="#/arsenal" className="inline-flex items-center relative overflow-hidden rounded-xl"
              style={{ gap: '10px', padding: '14px 26px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>
              <span className="font-ui font-bold uppercase text-gray-400" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>Explore Full Arsenal</span>
              <ArrowRight style={{ width: '15px', height: '15px', color: '#FF2A2A' }} />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //  DESKTOP LAYOUT — Unchanged below this line
  // ═══════════════════════════════════════════════════════════════
  return (
    <section
      className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center py-16 md:py-20 lg:py-24"
      style={{ paddingBottom: isSmallMobile ? '84px' : undefined }}
    >

      {/* ===============================================================
          ATMOSPHERIC BACKGROUND
      =============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient glow — single, static */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,42,42,0.04) 0%, transparent 70%)',
          }}
        />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{
          background: [
            'linear-gradient(to right, rgba(5,5,5,0.6) 0%, transparent 18%, transparent 82%, rgba(5,5,5,0.6) 100%)',
            'linear-gradient(to bottom, rgba(5,5,5,0.5) 0%, transparent 16%, transparent 78%, rgba(5,5,5,0.6) 100%)',
          ].join(', '),
        }} />
        {/* Single slow scan line */}
        <motion.div className="absolute left-0 right-0"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent 10%, rgba(255,42,42,0.08) 35%, rgba(255,42,42,0.18) 50%, rgba(255,42,42,0.08) 65%, transparent 90%)',
          }}
          animate={{ top: ['-2%', '102%'] }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatDelay: 14, delay: 3 }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">

        {/* ===== SECTION HEADER ===== */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: CUBIC }}
          viewport={{ once: true }}
          style={{ marginBottom: isSmallMobile ? '64px' : undefined }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between" style={{ gap: '1.5rem' }}>
            <div>
              <div className="flex items-center mb-4" style={{ gap: '0.75rem' }}>
                <motion.div
                  className="bg-[#FF2A2A] rounded-full flex-shrink-0"
                  style={{ width: '6px', height: '6px', boxShadow: '0 0 8px rgba(255,42,42,0.7)' }}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2.2, ease: SINE, repeat: Infinity }}
                />
                <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                  Operational Loadout
                </span>
                <div className="h-[1px] w-8 bg-[#FF2A2A]/20" />
              </div>
              <h2 className="font-heading font-bold text-white leading-none"
                style={{ fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '0.09em' }}>
                THE{' '}
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)', color: 'transparent' }}>ARSENAL</span>
              </h2>
              {/* Subtext — provides context for the section */}
              <motion.p
                className="text-gray-500 mt-4 max-w-md leading-relaxed"
                style={{ fontSize: '15px' }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: CUBIC, delay: 0.15 }}
                viewport={{ once: true }}
              >
                Core capabilities refined across 7+ years of designing high-impact digital products.
              </motion.p>
            </div>
            <div className="flex items-center border-l border-white/5" style={{ gap: '0.75rem', paddingLeft: '1.5rem' }}>
              <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #00D1FF' }} />
              <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                8 Capabilities Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* ===============================================================
            3-COLUMN INTELLIGENCE GRID
        =============================================================== */}
        <div
          className="grid grid-cols-2 lg:grid-cols-12 items-center relative"
          style={{ columnGap: '0', rowGap: isMobile ? '8px' : '0' }}
          onMouseLeave={() => setActiveService(null)}
        >

          {/* SIGNAL INTELLIGENCE NETWORK SVG — z-5 behind everything */}
          <svg
            className="absolute inset-0 pointer-events-none hidden lg:block"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', overflow: 'visible', zIndex: 5 }}
          >
            <defs>
              <filter id="signalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Clip particles to node zones — excludes character center */}
              <clipPath id="nodeZoneClip">
                <rect x="0" y="0" width="310" height="600" />
                <rect x="690" y="0" width="310" height="600" />
              </clipPath>
            </defs>

            {LINES.map(line => {
              const isActive = activeService === line.id;
              const isOtherActive = isHovering && !isActive;

              const lineOpacity = isActive ? 0.72 : isOtherActive ? 0.04 : 0.15;
              const lineWidth = isActive ? 1.4 : 0.7;
              const dotOpacity = isActive ? 0.95 : isOtherActive ? 0.00 : 0.28;
              const dotSpeed = isActive ? 1.0 : 2.8;
              const shimmerDur = line.len / 58;

              return (
                <g key={line.id}>
                  {/* Ghost base */}
                  <line
                    x1={ORIG.x} y1={ORIG.y} x2={line.x2} y2={line.y2}
                    stroke="rgba(255,42,42,0.05)" strokeWidth="0.5"
                  />
                  {/* Idle shimmer */}
                  <motion.line
                    x1={ORIG.x} y1={ORIG.y} x2={line.x2} y2={line.y2}
                    stroke="rgba(255,42,42,0.55)"
                    strokeWidth="0.6"
                    strokeDasharray={`5 ${line.len}`}
                    initial={{ strokeDashoffset: 0, opacity: 0.18 }}
                    animate={{
                      strokeDashoffset: [0, -(line.len + 5)],
                      opacity: isActive ? 0 : isOtherActive ? 0 : 0.18,
                    }}
                    transition={{
                      strokeDashoffset: { duration: shimmerDur, ease: 'linear', repeat: Infinity, delay: line.pDelay * 0.4 },
                      opacity: { duration: 0.4, ease: CUBIC },
                    }}
                  />
                  {/* Active energy line */}
                  <motion.line
                    x1={ORIG.x} y1={ORIG.y} x2={line.x2} y2={line.y2}
                    stroke="#FF2A2A"
                    strokeWidth={lineWidth}
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: lineOpacity }}
                    transition={{ duration: 0.3, ease: QUART }}
                    filter={isActive ? 'url(#signalGlow)' : undefined}
                  />
                  {/* Traveling particle — clipped to side zones */}
                  <motion.circle
                    r={isActive ? 2.8 : 1.8}
                    fill="#FF2A2A"
                    filter="url(#dotGlow)"
                    clipPath="url(#nodeZoneClip)"
                    initial={{ cx: ORIG.x, cy: ORIG.y, opacity: 0 }}
                    animate={{
                      cx: [ORIG.x, line.x2],
                      cy: [ORIG.y, line.y2],
                      opacity: [0, dotOpacity, dotOpacity, 0],
                    }}
                    transition={{
                      duration: dotSpeed, repeat: Infinity,
                      ease: SINE, delay: line.pDelay, times: [0, 0.08, 0.92, 1],
                    }}
                  />
                  {/* Secondary pulse — active only */}
                  {isActive && (
                    <motion.circle
                      r={1.4}
                      fill="rgba(255,180,180,1)"
                      filter="url(#dotGlow)"
                      clipPath="url(#nodeZoneClip)"
                      initial={{ cx: ORIG.x, cy: ORIG.y, opacity: 0 }}
                      animate={{
                        cx: [ORIG.x, line.x2],
                        cy: [ORIG.y, line.y2],
                        opacity: [0, 0.55, 0.55, 0],
                      }}
                      transition={{
                        duration: 1.0, repeat: Infinity,
                        ease: SINE, delay: line.pDelay + 0.48, times: [0, 0.1, 0.9, 1],
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* == LEFT capabilities == */}
          <div
            className="col-span-1 lg:col-span-3 flex flex-col items-end order-2 lg:order-1 relative"
            style={{ gap: isSmallMobile ? '6px' : isMobile ? '4px' : '2px', zIndex: 10 }}
          >
            {leftServices.map((service, i) => (
              <motion.div key={service.id} className="w-full"
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09, duration: 0.6, ease: CUBIC }} viewport={{ once: true }}>
                <CapabilityNode
                  service={service}
                  isActive={activeService === service.id}
                  isOtherActive={activeService !== null && activeService !== service.id}
                  onHover={() => {
                    setActiveService(service.id);
                    play('systemModuleOnline');
                  }}
                  onLeave={() => setActiveService(null)}
                  isSmallMobile={isSmallMobile}
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </div>

          {/* == CHARACTER PRESENCE == */}
          <div
            className="col-span-2 lg:col-span-6 relative flex items-center justify-center order-1 lg:order-2"
            style={{
              height: isSmallMobile ? 'auto' : isMobile ? 'min(95vw, 580px)' : 'clamp(320px, 60vw, 600px)',
              aspectRatio: isSmallMobile ? '3 / 4' : undefined,
              maxHeight: isSmallMobile ? '52vh' : isMobile ? '620px' : undefined,
              zIndex: 8,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            {/* Radial character glow */}
            <div
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                transform: 'translate(-50%, -44%)',
                width: '420px', height: '420px',
                background: isHovering
                  ? 'radial-gradient(ellipse at 50% 60%, rgba(255,42,42,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 60%, rgba(255,42,42,0.04) 0%, transparent 65%)',
                transition: 'background 0.6s ease-out',
                zIndex: 1,
              }}
            />

            {/* Ground shadow */}
            <motion.div
              className="absolute rounded-[100%] pointer-events-none"
              style={{
                height: '80px',
                bottom: 0,
                left: '50%',
                translateX: '-50%',
                translateY: '30px',
                scaleY: 0.4,
                transformOrigin: 'center center',
                filter: 'blur(32px)',
                zIndex: 2,
                backgroundColor: isSmallMobile ? 'rgba(255,42,42,0.08)' : 'rgba(255,42,42,0.11)',
              }}
              animate={{
                width: isHovering ? '75%' : '55%',
                backgroundColor: isHovering
                  ? (isSmallMobile ? 'rgba(255,42,42,0.28)' : 'rgba(255,42,42,0.38)')
                  : (isSmallMobile ? 'rgba(255,42,42,0.08)' : 'rgba(255,42,42,0.11)'),
              }}
              transition={{ duration: 0.9, ease: QUART }}
            />

            {/* CHARACTER IMAGE — background-integrated with refined opacity */}
            <div
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ zIndex: 20 }}
            >
              <img
                src={operativeImg}
                alt="Operative"
                loading="lazy"
                decoding="async"
                style={{
                  height: isMobile ? '105%' : '94%',
                  width: isMobile ? 'auto' : 'auto',
                  maxHeight: isMobile ? '105%' : undefined,
                  objectFit: 'contain',
                  objectPosition: 'center bottom',
                  display: 'block',
                  opacity: 0.88,
                  filter: isHovering
                    ? 'brightness(0.62) saturate(0.85) sepia(0.35) hue-rotate(-15deg)'
                    : 'brightness(0.55) saturate(0.7)',
                  transition: 'filter 0.6s ease-out',
                }}
              />
              {/* Subtle red colour overlay on hover */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '-100px',
                  right: '0px',
                  bottom: '-100px',
                  left: '0px',
                  background: 'radial-gradient(ellipse 70% 80% at 50% 55%, rgba(255,42,42,0.18) 0%, rgba(255,42,42,0.06) 50%, transparent 80%)',
                  mixBlendMode: 'color',
                  opacity: isHovering ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                }}
              />
            </div>

            {/* Mobile bottom fade */}
            {isMobile && (
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: isSmallMobile ? '200px' : '160px',
                  background: isSmallMobile
                    ? 'linear-gradient(to top, #050505 25%, rgba(5,5,5,0.90) 45%, rgba(5,5,5,0.55) 65%, rgba(5,5,5,0.15) 82%, transparent 100%)'
                    : 'linear-gradient(to top, #050505 30%, rgba(5,5,5,0.85) 55%, rgba(5,5,5,0.4) 75%, transparent 100%)',
                  zIndex: 25,
                }}
              />
            )}

            {/* SIDE-AWARE HUD INTEL PANEL */}
            <AnimatePresence>
              {activeData && !isMobile && (
                <motion.div
                  key={activeData.id}
                  className="absolute pointer-events-none"
                  style={{
                    ...(activeData.align === 'left'
                      ? { left: '4%' }
                      : { right: '4%' }),
                    top: '16%',
                    zIndex: 40,
                    minWidth: '180px', maxWidth: '210px',
                    padding: '14px 16px 16px',
                    background: 'rgba(3,3,3,0.94)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,42,42,0.15)',
                  }}
                  initial={{ opacity: 0, x: activeData.align === 'left' ? -16 : 16, y: -8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: activeData.align === 'left' ? -16 : 16, y: -8 }}
                  transition={{ duration: 0.22, ease: CUBIC }}
                >
                  {/* Classified flicker */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'rgba(255,42,42,0.12)' }}
                    animate={{ opacity: [0, 0.06, 0, 0.03, 0, 0.05, 0] }}
                    transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 3.5, ease: 'linear' }}
                  />
                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      height: '1px',
                      background: 'linear-gradient(to right, transparent, rgba(255,42,42,0.4), transparent)',
                      top: 0,
                    }}
                    animate={{ top: ['0%', '100%'], opacity: [0.8, 0] }}
                    transition={{ duration: 0.35, ease: CUBIC, delay: 0.1 }}
                  />
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#FF2A2A]/28 rounded-tl" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#FF2A2A]/18 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#FF2A2A]/18 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#FF2A2A]/28 rounded-br" />
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="font-mono uppercase mb-1.5"
                      style={{ fontSize: '7.5px', letterSpacing: '0.24em', color: 'rgba(255,42,42,0.58)' }}>
                      {activeData.id}&nbsp;&#9656;&nbsp;ACTIVE
                    </div>
                    <div className="font-heading font-bold text-white"
                      style={{ fontSize: '13px', letterSpacing: '0.01em', lineHeight: 1.2, marginBottom: '8px' }}>
                      {activeData.label}
                    </div>
                    <div className="font-mono text-gray-500"
                      style={{ fontSize: '9.5px', letterSpacing: '0.01em', lineHeight: 1.55, marginBottom: '10px' }}>
                      {activeData.desc}
                    </div>
                    {/* Proficiency bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>
                        PROFICIENCY
                      </span>
                      <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #FF2A2A 0%, rgba(255,42,42,0.5) 100%)',
                            boxShadow: '0 0 8px rgba(255,42,42,0.4)',
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${activeData.proficiency * 100}%` }}
                          transition={{ duration: 0.6, ease: CUBIC, delay: 0.1 }}
                        />
                      </div>
                      <span className="font-mono" style={{ fontSize: '8px', color: '#FF2A2A', letterSpacing: '0.05em' }}>
                        {Math.round(activeData.proficiency * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>{/* /character column */}

          {/* == RIGHT capabilities == */}
          <div
            className="col-span-1 lg:col-span-3 flex flex-col items-start order-3 relative"
            style={{ gap: isSmallMobile ? '6px' : isMobile ? '4px' : '2px', zIndex: 10 }}
          >
            {rightServices.map((service, i) => (
              <motion.div key={service.id} className="w-full"
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09, duration: 0.6, ease: CUBIC }} viewport={{ once: true }}>
                <CapabilityNode
                  service={service}
                  isActive={activeService === service.id}
                  isOtherActive={activeService !== null && activeService !== service.id}
                  onHover={() => {
                    setActiveService(service.id);
                    play('systemModuleOnline');
                  }}
                  onLeave={() => setActiveService(null)}
                  isSmallMobile={isSmallMobile}
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </div>

        </div>{/* /grid */}

        {/* ===== SECTION FOOTER CTA ===== */}
        <motion.div
          className="flex justify-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: CUBIC, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ marginTop: isSmallMobile ? '48px' : undefined }}
        >
          <a
            href="#/arsenal"
            className="group inline-flex items-center relative overflow-hidden rounded-xl transition-all duration-200 px-7 py-3.5 bg-white/[0.02] border border-white/[0.08] hover:border-[#FF2A2A]/35 hover:bg-[#FF2A2A]/[0.06] hover:shadow-[0_0_24px_rgba(255,42,42,0.10)]"
            style={{
              gap: '0.75rem',
              textDecoration: 'none',
            }}
            onMouseEnter={() => play('ctaHover')}
          >
            <span className="font-ui font-bold uppercase text-gray-400 group-hover:text-white transition-colors duration-200" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
              Explore Full Arsenal
            </span>
            <ArrowRight className="w-4 h-4 text-[#FF2A2A] group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  MOBILE CAPABILITY CARD — Classified Intel Card
//  Tap-to-engage, proficiency bars, scan line, corner brackets
// ─────────────────────────────────────────────────────────────
function MobileCapabilityCard({
  service, index, isActive, onTap, isSmallMobile,
}: {
  service: ServiceItem;
  index: number;
  isActive: boolean;
  onTap: () => void;
  isSmallMobile: boolean;
}) {
  const Icon = service.icon;
  const [scanKey, setScanKey] = useState(0);

  useEffect(() => {
    if (isActive) setScanKey(k => k + 1);
  }, [isActive]);

  return (
    <motion.div
      onPointerDown={() => onTap()}
      className="relative select-none"
      style={{
        padding: isSmallMobile ? '16px 14px 16px 18px' : '18px 16px 18px 20px',
        border: `1px solid ${isActive ? 'rgba(255,42,42,0.16)' : 'rgba(255,255,255,0.05)'}`,
        background: isActive ? 'rgba(255,42,42,0.025)' : 'rgba(255,255,255,0.012)',
        cursor: 'default',
        overflow: 'hidden',
        willChange: 'transform',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        transition: 'border-color 0.22s ease-out, background-color 0.22s ease-out',
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: CUBIC, delay: index * 0.055 }}
      viewport={{ once: true, margin: '-30px' }}
      whileTap={{ scale: 1.012 }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '14px', bottom: '14px', width: '2px',
        background: isActive
          ? 'linear-gradient(to bottom, rgba(255,42,42,0.25), #FF2A2A 50%, rgba(255,42,42,0.25))'
          : 'rgba(255,42,42,0.08)',
        boxShadow: isActive ? '0 0 10px rgba(255,42,42,0.55), 0 0 3px rgba(255,42,42,0.8)' : 'none',
        transition: 'all 0.22s ease-out',
      }} />

      {/* Scan line — fires each time card becomes active */}
      {isActive && (
        <motion.div
          key={`scan-${scanKey}`}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: '1px', zIndex: 5,
            background: 'linear-gradient(to right, transparent 5%, rgba(255,42,42,0.25) 30%, rgba(255,42,42,0.5) 50%, rgba(255,42,42,0.25) 70%, transparent 95%)',
          }}
          initial={{ top: '0%', opacity: 0.9 }}
          animate={{ top: '100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: CUBIC }}
        />
      )}

      {/* Corner brackets — fade in/out with active state */}
      {(['tl', 'tr', 'bl', 'br'] as const).map(corner => {
        const isTop = corner.startsWith('t');
        const isLeft = corner.endsWith('l');
        const intensity = (isTop && isLeft) || (!isTop && !isLeft) ? 0.22 : 0.14;
        return (
          <div key={corner} style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 0,
            [isLeft ? 'left' : 'right']: 0,
            width: '10px', height: '10px',
            [isTop ? 'borderTop' : 'borderBottom']: `1px solid rgba(255,42,42,${isActive ? intensity : 0})`,
            [isLeft ? 'borderLeft' : 'borderRight']: `1px solid rgba(255,42,42,${isActive ? intensity : 0})`,
            transition: 'border-color 0.22s ease-out',
          }} />
        );
      })}

      {/* Active ambient glow — subtle bg tint */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,42,42,0.06) 0%, transparent 70%)',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }} />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* Row 1: Icon + Code ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: isSmallMobile ? '34px' : '36px',
            height: isSmallMobile ? '34px' : '36px',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive ? 'rgba(255,42,42,0.10)' : 'rgba(255,255,255,0.025)',
            border: `1px solid ${isActive ? 'rgba(255,42,42,0.20)' : 'rgba(255,255,255,0.05)'}`,
            boxShadow: isActive ? '0 0 12px rgba(255,42,42,0.12)' : 'none',
            transition: 'all 0.22s ease-out',
          }}>
            <Icon style={{
              width: '15px', height: '15px',
              color: isActive ? '#FF2A2A' : 'rgba(255,255,255,0.28)',
              transition: 'color 0.22s ease-out',
            }} />
          </div>
          <span className="font-mono uppercase" style={{
            fontSize: '8.5px', letterSpacing: '0.22em',
            color: isActive ? '#FF2A2A' : 'rgba(255,255,255,0.28)',
            transition: 'color 0.22s ease-out',
          }}>
            {isActive ? '\u25B8 ENGAGED' : service.id}
          </span>
          <div style={{
            flex: 1, height: '1px',
            background: isActive ? 'linear-gradient(to right, rgba(255,42,42,0.12), transparent)' : 'rgba(255,255,255,0.03)',
            transition: 'background 0.22s ease-out',
          }} />
        </div>

        {/* Label */}
        <h3 className="font-heading font-bold uppercase" style={{
          fontSize: isSmallMobile ? '14px' : '15px',
          letterSpacing: '0.06em', lineHeight: 1.2,
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.72)',
          textShadow: isActive ? '0 0 22px rgba(255,42,42,0.20)' : 'none',
          transition: 'color 0.22s ease-out, text-shadow 0.22s ease-out',
          marginBottom: '5px',
        }}>
          {service.label}
        </h3>

        {/* Description */}
        <p className="font-manrope" style={{
          fontSize: isSmallMobile ? '12px' : '13px',
          lineHeight: 1.55, letterSpacing: '0.01em',
          color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.22s ease-out',
          margin: 0, marginBottom: '13px',
        }}>
          {service.desc}
        </p>

        {/* Proficiency bar — 10-segment */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span className="font-mono uppercase" style={{
            fontSize: '7px', letterSpacing: '0.18em',
            color: isActive ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.15)',
            flexShrink: 0, transition: 'color 0.22s ease-out',
          }}>
            PROF
          </span>
          <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
            {Array.from({ length: 10 }).map((_, bar) => {
              const threshold = (bar + 1) * 0.1;
              const isFilled = service.proficiency >= threshold;
              return (
                <div key={bar} style={{
                  flex: 1, height: '2px',
                  background: isFilled
                    ? (isActive ? '#FF2A2A' : 'rgba(255,42,42,0.25)')
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: (isActive && isFilled) ? '0 0 4px rgba(255,42,42,0.30)' : 'none',
                  transition: 'all 0.22s ease-out',
                }} />
              );
            })}
          </div>
          <span className="font-mono" style={{
            fontSize: '8.5px', letterSpacing: '0.04em',
            color: isActive ? '#FF2A2A' : 'rgba(255,255,255,0.20)',
            flexShrink: 0, transition: 'color 0.22s ease-out',
          }}>
            {Math.round(service.proficiency * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAPABILITY NODE — Refined with icon, description, proficiency
//  (Desktop only — used in the 3-column intelligence grid)
// ─────────────────────────────────────────────────────────────
function CapabilityNode({
  service, isActive, isOtherActive, onHover, onLeave, isSmallMobile,
}: {
  service: ServiceItem;
  isActive: boolean;
  isOtherActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  isSmallMobile: boolean;
  isMobile: boolean;
}) {
  const isLeft = service.align === 'left';
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (!isSmallMobile) return;
    setTapped(true);
    setTimeout(() => setTapped(false), 320);
  };

  const isLit = isActive || (isSmallMobile && tapped);
  const Icon = service.icon;

  // Proficiency arc geometry
  const R = 17;
  const C = 2 * Math.PI * R;
  const arcFill = service.proficiency * C;
  const globalIdx = services.findIndex(s => s.id === service.id);

  return (
    <div
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') onHover(); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') onLeave(); }}
      onPointerDown={(e) => { if (e.pointerType === 'touch') handleTap(); }}
      className="relative cursor-default w-full select-none"
      style={{ padding: isSmallMobile ? '10px 12px' : isLeft ? '14px 18px 14px 0' : '14px 0 14px 18px' }}
    >
      {/* Ghost index number — dim background stamp */}
      <div
        className="absolute pointer-events-none font-heading font-black"
        style={{
          fontSize: '72px',
          lineHeight: 1,
          color: isLit ? 'rgba(255,42,42,0.07)' : 'rgba(255,255,255,0.025)',
          top: '50%', transform: 'translateY(-50%)',
          [isLeft ? 'right' : 'left']: '-8px',
          transition: 'color 0.28s ease-out',
          userSelect: 'none',
          letterSpacing: '-0.05em',
        }}
      >
        {String(globalIdx + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div
        className={`flex items-center ${isLeft ? 'flex-row-reverse text-right' : 'text-left'}`}
        style={{ gap: '14px', position: 'relative', zIndex: 2 }}
      >

        {/* Circular icon with proficiency arc */}
        <div className="flex-shrink-0 relative" style={{ width: '46px', height: '46px' }}>
          {/* SVG arc ring */}
          <svg
            width="46" height="46"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle cx="23" cy="23" r={R} fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Proficiency fill */}
            <circle cx="23" cy="23" r={R} fill="none"
              stroke={isLit ? '#FF2A2A' : isOtherActive ? 'rgba(255,42,42,0.08)' : 'rgba(255,42,42,0.28)'}
              strokeWidth={isLit ? 1.5 : 1}
              strokeLinecap="round"
              strokeDasharray={`${arcFill} ${C}`}
              style={{ transition: 'stroke 0.28s ease-out, stroke-width 0.28s ease-out' }}
            />
          </svg>

          {/* Icon center */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ borderRadius: '50%' }}
          >
            <Icon strokeWidth={1.25} style={{
              width: '17px', height: '17px',
              color: isLit ? '#FF2A2A' : isOtherActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
              filter: isLit ? 'drop-shadow(0 0 6px rgba(255,42,42,0.7))' : 'none',
              transition: 'color 0.28s ease-out, filter 0.28s ease-out',
            }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Code */}
          <div className="font-mono uppercase" style={{
            fontSize: '8px', letterSpacing: '0.24em', marginBottom: '3px',
            color: isLit ? '#FF2A2A' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.28s ease-out',
          }}>
            {isLit ? '▸ ACTIVE' : service.id}
          </div>

          {/* Label */}
          <h3 className="font-heading font-bold uppercase" style={{
            fontSize: 'clamp(12px, 1.1vw, 15px)',
            letterSpacing: '0.06em', lineHeight: 1.2, marginBottom: '4px',
            color: isLit ? '#fff' : isOtherActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.72)',
            transition: 'color 0.28s ease-out',
          }}>
            {service.label}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: '10px', lineHeight: 1.5, margin: 0,
            color: isLit ? 'rgba(255,255,255,0.45)' : isOtherActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.22)',
            transition: 'color 0.28s ease-out',
          }}>
            {service.desc}
          </p>

          {/* Proficiency pct — shown only when active */}
          <div className="hidden lg:block" style={{
            fontSize: '8px', fontFamily: 'monospace', letterSpacing: '0.12em',
            color: isLit ? 'rgba(255,42,42,0.7)' : 'transparent',
            marginTop: '5px', transition: 'color 0.28s ease-out',
          }}>
            {Math.round(service.proficiency * 100)}% PROFICIENCY
          </div>
        </div>
      </div>

      {/* Bottom accent line — active state */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0,
          [isLeft ? 'right' : 'left']: isLeft ? '18px' : '18px',
          height: '1px',
          background: isLeft
            ? 'linear-gradient(to left, #FF2A2A, transparent)'
            : 'linear-gradient(to right, #FF2A2A, transparent)',
        }}
        animate={{ width: isLit ? '55%' : '0%', opacity: isLit ? 0.6 : 0 }}
        transition={{ duration: 0.28, ease: QUART }}
      />
    </div>
  );
}
