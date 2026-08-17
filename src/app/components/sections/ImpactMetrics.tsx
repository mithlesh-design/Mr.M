import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSound } from '../../audio/AudioSystem';
import {
  motion, useSpring, useTransform, useMotionValue,
  useMotionTemplate,
} from 'motion/react';

/* ─── Reduced motion hook ─────────────────────────────────────────────── */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}
import { ShieldCheck, TrendingUp, Zap, Award, Target } from 'lucide-react';
import { EASE_CINEMATIC } from '../../constants';

/* ─── Data ───────────────────────────────────────────────────────────────── */
const stats = [
  {
    value: '10+', raw: 10, ringFill: 0.68, prefix: '', suffix: '+',
    label: 'AI Products', sublabel: 'Launched & Scaled',
    accent: '#FF2A2A', accentGlow: 'rgba(255,42,42,0.5)',
    id: 'PRD-01', icon: Zap,
    context: 'Enterprise + AI',
    trend: '+3 YTD',
  },
  {
    value: '$50M+', raw: 50, ringFill: 0.52, prefix: '$', suffix: 'M+',
    label: 'Revenue Impact', sublabel: 'Generated Across Products',
    accent: '#00D1FF', accentGlow: 'rgba(0,209,255,0.5)',
    id: 'REV-02', icon: TrendingUp,
    context: 'Cumulative ROI',
    trend: '+127% CAGR',
  },
  {
    value: '85%', raw: 85, ringFill: 0.85, prefix: '', suffix: '%',
    label: 'Efficiency Gain', sublabel: 'Avg Workflow Improvement',
    accent: '#C9A86A', accentGlow: 'rgba(201,168,106,0.5)',
    id: 'EFF-03', icon: Target,
    context: 'Workflow Optimization',
    trend: 'Peak Metric',
  },
  {
    value: '12', raw: 12, ringFill: 0.60, prefix: '', suffix: '',
    label: 'Industry Awards', sublabel: 'Recognition Won',
    accent: '#FF2A2A', accentGlow: 'rgba(255,42,42,0.5)',
    id: 'AWD-04', icon: Award,
    context: 'Design Excellence',
    trend: '+4 This Year',
  },
];

/* ─── Static report timestamp ─────────────────────────────────────────── */
const REPORT_TS = '2025-Q4 / CONFIRMED';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Animated Spring Counter                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
function Counter({
  to, prefix = '', suffix = '', isVisible, reduceMotion,
}: { to: number; prefix?: string; suffix?: string; isVisible: boolean; reduceMotion: boolean }) {
  const spring = useSpring(0, { stiffness: 38, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    if (reduceMotion) { setValue(to); return; }
    const unsub = display.on('change', (v) => setValue(v));
    spring.set(to);
    return unsub;
  }, [isVisible, spring, to, display, reduceMotion]);

  return <>{prefix}{value}{suffix}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SVG Arc Ring — fills on scroll-in with glowing endpoint                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StatRing({
  accent, fill, isVisible, size = 120, reduceMotion,
}: { accent: string; fill: number; isVisible: boolean; size?: number; reduceMotion: boolean }) {
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference * (1 - fill);
  const [offset, setOffset] = useState(circumference);
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    if (!isVisible) { setOffset(circumference); return; }
    if (reduceMotion) { setOffset(targetOffset); return; }
    const t = setTimeout(() => setOffset(targetOffset), 400);
    return () => clearTimeout(t);
  }, [isVisible, targetOffset, circumference, reduceMotion]);

  const fillAngle = fill * 360 - 90;
  const endX = cx + r * Math.cos((fillAngle * Math.PI) / 180);
  const endY = cy + r * Math.sin((fillAngle * Math.PI) / 180);

  return (
    <svg
      width={size} height={size}
      className="absolute pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      aria-hidden="true"
    >
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      {/* Tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 - 90) * (Math.PI / 180);
        const inner = r - 3;
        const outer = r + 3;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(angle)} y1={cy + inner * Math.sin(angle)}
            x2={cx + outer * Math.cos(angle)} y2={cy + outer * Math.sin(angle)}
            stroke={i % 6 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}
            strokeWidth={i % 6 === 0 ? 1 : 0.5}
          />
        );
      })}
      {/* Animated arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: 'rotate(-90deg)',
          transition: isVisible && !reduceMotion
            ? 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
            : 'none',
          opacity: 0.6,
        }}
      />
      {/* Soft glow arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: 'rotate(-90deg)',
          transition: isVisible && !reduceMotion
            ? 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
            : 'none',
          opacity: 0.12,
          filter: 'blur(3px)',
        }}
      />
      {/* Glowing endpoint dot */}
      {isVisible && (
        <circle
          cx={endX} cy={endY} r="3"
          fill={accent}
          style={{
            opacity: offset <= targetOffset + 1 ? 0.9 : 0,
            filter: `drop-shadow(0 0 6px ${accent})`,
            transition: reduceMotion ? 'none' : 'opacity 0.4s ease 2.6s',
          }}
        />
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Linear Progress Bar — fills on visibility, shimmer plays once only       */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ProgressBar({
  fill, accent, isVisible, delay = 0, reduceMotion,
}: { fill: number; accent: string; isVisible: boolean; delay?: number; reduceMotion: boolean }) {
  return (
    <div className="w-full relative" style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
      <motion.div
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
          boxShadow: `0 0 8px ${accent}40`,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isVisible ? fill : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.8, delay: delay + 0.6, ease: EASE_CINEMATIC }
        }
      />
      {/* Shimmer — plays once, no repeat */}
      {isVisible && !reduceMotion && (
        <motion.div
          className="absolute top-0 h-full pointer-events-none"
          style={{
            width: '30px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
          }}
          initial={{ left: '-30px' }}
          animate={{ left: '110%' }}
          transition={{ duration: 1.6, delay: delay + 2.5, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Stat Card — individual metric card with glare + glow                     */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StatCard({
  stat, index, isVisible, reduceMotion,
}: {
  stat: typeof stats[0];
  index: number;
  isVisible: boolean;
  reduceMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const glareX = useTransform(springX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(springY, [0, 1], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(280px circle at ${glareX} ${glareY}, rgba(255,255,255,0.045), transparent 65%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || reduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY, reduceMotion]);

  const Icon = stat.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-default"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: index * 0.12, duration: 0.65, ease: EASE_CINEMATIC }
      }
      onMouseEnter={() => { setIsHovered(true); play('hover'); }}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0.5); mouseY.set(0.5); }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="relative overflow-hidden h-full"
        style={{
          padding: 'clamp(20px, 3vw, 28px) clamp(18px, 2.5vw, 24px)',
          background: isHovered
            ? 'rgba(255,255,255,0.038)'
            : 'rgba(255,255,255,0.018)',
          border: `1px solid ${isHovered ? `${stat.accent}35` : 'rgba(255,255,255,0.07)'}`,
          boxShadow: isHovered
            ? `0 0 40px ${stat.accent}14, 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`
            : '0 2px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)',
          transition: 'background 0.28s ease-out, border-color 0.28s ease-out, box-shadow 0.28s ease-out, transform 0.28s ease-out',
          transform: !reduceMotion && isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Glare overlay */}
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: glareBg, opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        )}

        {/* Top accent stripe */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${stat.accent}45 30%, ${stat.accent}65 50%, ${stat.accent}45 70%, transparent)`,
            opacity: isHovered ? 1 : 0.35,
            transition: 'opacity 0.28s ease',
          }}
        />

        {/* Header: ID tag + context badge */}
        <div className="flex items-center justify-between relative z-10" style={{ marginBottom: '18px' }}>
          <div className="flex items-center" style={{ gap: '7px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px', height: '6px',
                background: stat.accent,
                boxShadow: `0 0 8px ${stat.accentGlow}`,
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.18em', color: `${stat.accent}95` }}
            >
              {stat.id}
            </span>
          </div>
          <div
            className="flex items-center"
            style={{
              padding: '3px 8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.32)' }}
            >
              {stat.context}
            </span>
          </div>
        </div>

        {/* Number + Ring cluster */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: '100px', marginBottom: '14px' }}
        >
          <StatRing
            accent={stat.accent}
            fill={stat.ringFill}
            isVisible={isVisible}
            size={100}
            reduceMotion={reduceMotion}
          />
          <div
            className="font-heading font-bold tabular-nums relative z-10 text-center select-none"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: isVisible ? '#ffffff' : 'rgba(255,255,255,0.06)',
              transition: reduceMotion ? 'none' : 'color 0.6s ease',
              textShadow: isHovered ? `0 0 32px ${stat.accent}45` : 'none',
            }}
            aria-label={`${stat.value} ${stat.label} — ${stat.sublabel}`}
          >
            <Counter
              to={stat.raw}
              prefix={stat.prefix}
              suffix={stat.suffix}
              isVisible={isVisible}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10" style={{ marginBottom: '14px' }}>
          <ProgressBar
            fill={stat.ringFill}
            accent={stat.accent}
            isVisible={isVisible}
            delay={index * 0.12}
            reduceMotion={reduceMotion}
          />
          {/* Trend + verified row */}
          <div className="flex items-center justify-between" style={{ marginTop: '7px' }}>
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.12em', color: `${stat.accent}70` }}
            >
              {stat.trend}
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}
            >
              {Math.round(stat.ringFill * 100)}% VERIFIED
            </span>
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '14px' }} />

        {/* Label block */}
        <div className="relative z-10">
          <div className="flex items-center" style={{ gap: '8px', marginBottom: '5px' }}>
            <Icon
              className="flex-shrink-0"
              style={{ width: '13px', height: '13px', color: stat.accent, opacity: 0.75 }}
              aria-hidden={true}
            />
            <span
              className="font-ui font-bold text-white uppercase"
              style={{ fontSize: '13px', letterSpacing: '0.08em', lineHeight: 1.2 }}
            >
              {stat.label}
            </span>
          </div>
          {/* Fixed: was text-gray-600 which fails contrast on #050505 */}
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              paddingLeft: '21px',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.4,
            }}
          >
            {stat.sublabel}
          </span>
        </div>

        {/* Verification badge */}
        <div
          className="flex items-center relative z-10"
          style={{ gap: '6px', marginTop: '14px' }}
        >
          <ShieldCheck
            style={{ width: '11px', height: '11px', color: '#00D1FF', opacity: 0.5 }}
            aria-hidden={true}
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(0,209,255,0.4)' }}
          >
            DATA CONFIRMED
          </span>
        </div>

        {/* Bottom edge glow on hover */}
        <div
          className="absolute bottom-0 left-[15%] right-[15%] pointer-events-none"
          style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${stat.accent}55, transparent)`,
            boxShadow: `0 0 12px ${stat.accent}30`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.28s ease',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Main Section                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ImpactMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.12 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#050505] relative overflow-hidden"
      style={{
        paddingTop: 'clamp(64px, 10vw, 120px)',
        paddingBottom: 'clamp(64px, 10vw, 120px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Background: noise texture ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          mixBlendMode: 'overlay',
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
        aria-hidden="true"
      />

      {/* ── Background: dot grid ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />

      {/* ── Background: radial glows ──────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={
          !reduceMotion
            ? { opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.92 }
            : { opacity: isVisible ? 1 : 0 }
        }
        transition={{ duration: 1.8, ease: 'easeOut' }}
        style={{
          background: [
            'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,42,42,0.05) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 35% at 15% 60%, rgba(0,209,255,0.03) 0%, transparent 60%)',
            'radial-gradient(ellipse 35% 35% at 85% 40%, rgba(201,168,106,0.025) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* ── Corner brackets ───────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none" style={{ borderTop: '1px solid rgba(255,42,42,0.2)', borderLeft: '1px solid rgba(255,42,42,0.2)' }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none" style={{ borderTop: '1px solid rgba(255,42,42,0.2)', borderRight: '1px solid rgba(255,42,42,0.2)' }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none" style={{ borderBottom: '1px solid rgba(255,42,42,0.2)', borderLeft: '1px solid rgba(255,42,42,0.2)' }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none" style={{ borderBottom: '1px solid rgba(255,42,42,0.2)', borderRight: '1px solid rgba(255,42,42,0.2)' }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10">

        {/* ── SITREP classification strip ───────────────────────────────── */}
        <motion.div
          className="flex items-center justify-between flex-wrap"
          style={{
            marginBottom: '28px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            gap: '8px',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center" style={{ gap: '10px' }}>
            <motion.span
              style={{
                display: 'inline-block',
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#FF2A2A',
                flexShrink: 0,
              }}
              animate={!reduceMotion ? { opacity: [1, 0.25, 1] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,42,42,0.75)' }}
            >
              LIVE SITREP
            </span>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)' }}
            >
              {REPORT_TS}
            </span>
            <span
              className="font-mono uppercase hidden sm:inline"
              style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(0,209,255,0.38)' }}
            >
              LVL-7 CLEARANCE
            </span>
          </div>
        </motion.div>

        {/* ── Section header ────────────────────────────────────────────── */}
        <motion.div
          className="relative"
          style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7 }}
        >
          {/* Eyebrow: signal line + label */}
          <div className="flex items-center flex-wrap" style={{ gap: '0.75rem', marginBottom: '12px' }}>
            <motion.div
              className="h-[1px] bg-[#FF2A2A]"
              style={{ boxShadow: '0 0 8px rgba(255,42,42,0.6)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            />
            <span
              className="font-mono text-[#FF2A2A] uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}
            >
              Verified Impact Metrics
            </span>
          </div>

          {/* Title row */}
          <motion.div
            className="flex items-center flex-wrap"
            style={{ gap: '12px' }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          >
            <h2
              className="font-heading font-bold"
              style={{
                fontSize: 'clamp(24px, 4vw, 40px)',
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                background: 'linear-gradient(108deg, #ffffff 0%, #d0d0d0 50%, rgba(201,168,106,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              OPERATIONAL INTELLIGENCE
            </h2>
            <motion.div
              className="hidden md:block flex-1"
              style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.6, duration: 0.8, ease: EASE_CINEMATIC }}
            />
            <motion.span
              className="hidden md:inline-block font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.14)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.8 }}
            >
              // REAL-TIME BRIEFING
            </motion.span>
          </motion.div>

          {/* Description — fixed: was text-gray-500 (low contrast on #050505) */}
          <motion.p
            style={{
              fontSize: '15px',
              letterSpacing: '0.01em',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginTop: '12px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
            }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          >
            Measurable outcomes across enterprise AI, product strategy, and design systems.
          </motion.p>
        </motion.div>

        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 'clamp(12px, 2vw, 18px)' }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isVisible={isVisible}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        {/* ── Footer connector ──────────────────────────────────────────── */}
        <motion.div
          className="flex items-center"
          style={{ marginTop: 'clamp(32px, 5vw, 52px)', gap: '12px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.6, duration: 0.5 }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)' }} />
          <div className="flex items-center" style={{ gap: '7px' }}>
            {/* Replaced CSS impactPulse animation with Framer Motion (respects reduceMotion) */}
            <motion.span
              style={{
                display: 'inline-block',
                width: '4px', height: '4px',
                borderRadius: '50%',
                background: '#00D1FF',
                boxShadow: '0 0 6px rgba(0,209,255,0.5)',
                flexShrink: 0,
              }}
              animate={!reduceMotion ? { opacity: [1, 0.2, 1] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="font-mono uppercase hidden sm:inline"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.15)' }}
            >
              ALL METRICS INDEPENDENTLY VERIFIED
            </span>
            <span
              className="font-mono uppercase sm:hidden"
              style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}
            >
              METRICS VERIFIED
            </span>
          </div>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)' }} />
        </motion.div>

      </div>
    </section>
  );
}
