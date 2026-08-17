import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Shield, Fingerprint, Crosshair, ArrowRight } from 'lucide-react';
import { DepthCard } from '../ui/DepthCard';
import { useSound } from '../../audio/AudioSystem';
import operativeImg from '@/assets/ID.png';

const timeline = [
  {
    year: '2018',
    label: 'UI Designer',
    place: 'Loantube Technologies',
    desc: 'Shaped the visual identity and UX of a fintech platform from the ground up.',
    metric: 'FinTech Growth',
    id: 'LT-01',
  },
  {
    year: '2020',
    label: 'Senior UX',
    place: 'Appzlogic Mobility',
    desc: 'Led product design across mobile and web — delivering measurable engagement lifts.',
    metric: '+25% Engagement',
    id: 'AX-02',
  },
  {
    year: '2023',
    label: 'Creative Head',
    place: 'Legends Cricket League',
    desc: 'Directed creative for a national sports brand — broadcast, digital, and experiential.',
    metric: 'National Campaign',
    id: 'LC-03',
  },
  {
    year: 'NOW',
    label: 'Senior Operative',
    place: 'AI & Enterprise Focus',
    desc: 'Leading design for AI-native products and enterprise systems at Appzlogic — 5+ year tenure.',
    metric: 'Level 7 Clearance',
    id: 'OP-04',
    isActive: true,
  },
];

/**
 * Comparator — most recent first.
 * "NOW" / "Present" → Infinity (always first).
 * Numeric years → sorted descending (2023 > 2020 > 2018).
 * Unparsable strings → -Infinity (pushed to bottom).
 */
function timelinePriority(year: string): number {
  if (/^(NOW|Present)$/i.test(year.trim())) return Infinity;
  const n = parseInt(year, 10);
  return isNaN(n) ? -Infinity : n;
}

const sortedTimeline = [...timeline].sort(
  (a, b) => timelinePriority(b.year) - timelinePriority(a.year),
);

export default function IdentitySection() {
  const [pinnedId, setPinnedId] = useState<number | null>(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredInfoCard, setHoveredInfoCard] = useState<string | null>(null);
  const { play } = useSound();

  return (
    <section
      className="bg-[#050505] relative overflow-hidden flex items-center py-12 md:py-20 lg:py-24"
      style={{ minHeight: '100vh' }}
    >

      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 relative z-10 w-full items-center">

        {/* ── LEFT: Profile Card ── */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <DepthCard
              depth={20}
              className="w-full rounded-xl overflow-hidden"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={() => { setIsHoveringCard(true); play('hover'); }}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              {/* Photo area */}
              <div className="relative overflow-hidden bg-black" style={{ height: 'clamp(260px, 42vw, 320px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <img
                  src={operativeImg}
                  alt="Mithlesh Mishra"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                  style={{
                    filter: isHoveringCard ? 'grayscale(40%) brightness(0.85) contrast(1.1)' : 'grayscale(90%) brightness(0.75) contrast(1.1)',
                    mixBlendMode: 'luminosity',
                    transition: 'filter 500ms ease-out',
                  }}
                />

                {/* Scan line — always mounted, fades in/out smoothly */}
                <motion.div
                  className="absolute left-0 w-full pointer-events-none z-20"
                  style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(255,42,42,0.5), transparent)',
                  }}
                  animate={isHoveringCard
                    ? { top: ['0%', '100%'], opacity: 1 }
                    : { opacity: 0 }
                  }
                  transition={isHoveringCard
                    ? { top: { duration: 2.8, ease: 'linear', repeat: Infinity }, opacity: { duration: 0.2 } }
                    : { opacity: { duration: 0.2 } }
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

                {/* Status badge — top right corner only, no diagonal tape */}
                <div
                  className="absolute top-4 right-4 flex items-center font-mono uppercase"
                  style={{
                    gap: '0.4rem', fontSize: '8px', letterSpacing: '0.2em',
                    padding: '4px 8px',
                    background: 'rgba(5,5,5,0.8)',
                    border: '1px solid rgba(255,42,42,0.35)',
                    color: '#FF2A2A',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="w-1 h-1 bg-[#FF2A2A] rounded-full animate-pulse" />
                  Classified
                </div>

                {/* Bottom data overlay */}
                <div className="absolute bottom-5 left-6 font-mono" style={{ zIndex: 20 }}>
                  <div className="flex items-center mb-1" style={{ gap: '0.5rem' }}>
                    <Shield className="w-3 h-3 text-[#00D1FF]" />
                    <span className="text-white font-bold uppercase" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
                      Identity Verified
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500" style={{ gap: '0.4rem', fontSize: '10px', letterSpacing: '0.12em' }}>
                    <Fingerprint className="w-3 h-3" />
                    ID: MM-7YR-SNRUX
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: 'clamp(1.25rem, 4vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3
                    className="font-heading font-bold text-white"
                    style={{ fontSize: 'clamp(22px, 5vw, 28px)', letterSpacing: '0.09em', marginBottom: '4px' }}
                  >
                    Mithlesh Mishra
                  </h3>
                  <p className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                    Senior UX Designer // Product Strategist
                  </p>
                </div>

                <p
                  className="text-gray-400 leading-relaxed"
                  style={{ fontSize: '14px', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,42,42,0.25)' }}
                >
                  7+ years driving measurable outcomes across AI, SaaS, and enterprise. Combines tactical precision with creative direction.
                </p>

                <div className="grid grid-cols-2" style={{ gap: '0.625rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {[
                    { label: 'Clearance', value: 'Level 7 / ALPHA', accent: '#FF2A2A' },
                    { label: 'Status', value: 'Active', accent: '#00D1FF', pulse: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg"
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: `1px solid ${hoveredInfoCard === item.label ? `${item.accent}30` : 'rgba(255,255,255,0.05)'}`,
                        transition: 'border-color 200ms ease-out',
                      }}
                      onMouseEnter={() => setHoveredInfoCard(item.label)}
                      onMouseLeave={() => setHoveredInfoCard(null)}
                    >
                      <div className="font-mono text-gray-600 uppercase mb-1" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                        {item.label}
                      </div>
                      <div
                        className="font-bold flex items-center"
                        style={{ fontSize: '13px', color: '#fff', gap: '0.5rem' }}
                      >
                        {item.value}
                        {item.pulse && <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #00D1FF' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DepthCard>
          </motion.div>
        </div>

        {/* ── RIGHT: Timeline ── */}
        <div className="lg:col-span-7 lg:pl-8">
          {/* Header */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4" style={{ gap: '0.75rem' }}>
              <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                Operative Dossier
              </span>
            </div>
            <h2
              className="font-heading font-bold text-white leading-none"
              style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', letterSpacing: '0.09em' }}
            >
              MISSION{' '}
              <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)', color: 'transparent' }}>
                HISTORY
              </span>
            </h2>
          </motion.div>

          {/* Timeline items */}
          <div className="relative" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Vertical line */}
            <div
              className="absolute left-0 top-4 bottom-4 w-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(255,42,42,0.4), rgba(255,255,255,0.06) 60%, transparent)' }}
            />

            {sortedTimeline.map((item, index) => {
              const isPinned = pinnedId === index;
              return (
                <motion.div
                  key={index}
                  className="relative cursor-default group"
                  style={{ paddingLeft: '2rem' }}
                  onMouseEnter={() => { setPinnedId(index); play('hover'); }}
                  onMouseLeave={() => setPinnedId(null)}
                  onPointerDown={(e) => {
                    if (e.pointerType === 'touch') {
                      setPinnedId(prev => prev === index ? null : index);
                    }
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-[22px] -translate-x-1/2 rounded-full flex items-center justify-center"
                    style={{
                      width: '14px', height: '14px',
                      background: '#050505',
                      border: `2px solid ${isPinned ? '#FF2A2A' : 'rgba(255,255,255,0.15)'}`,
                      boxShadow: isPinned ? '0 0 12px rgba(255,42,42,0.5)' : 'none',
                      transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
                      zIndex: 10,
                    }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: '5px', height: '5px',
                        background: isPinned ? '#FF2A2A' : 'rgba(255,255,255,0.2)',
                        transition: 'background 200ms ease-out',
                      }}
                    />
                  </div>

                  {/* Pulse ring on active/last */}
                  {(item.isActive || isPinned) && (
                    <div
                      className="absolute left-0 -translate-x-1/2 top-[22px] rounded-full bg-[#FF2A2A] animate-ping opacity-20"
                      style={{ width: '14px', height: '14px' }}
                    />
                  )}

                  {/* Card — fixed padding, no layout shift on hover */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      padding: '1.25rem',
                      background: isPinned ? 'rgba(10,10,10,0.95)' : 'transparent',
                      border: `1px solid ${isPinned ? 'rgba(255,42,42,0.22)' : 'transparent'}`,
                      marginBottom: '0.5rem',
                      transition: 'background 200ms ease-out, border-color 200ms ease-out',
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center" style={{ gap: '0.75rem' }}>
                        <span
                          className="font-mono font-bold uppercase rounded"
                          style={{
                            fontSize: '10px', letterSpacing: '0.15em',
                            padding: '2px 8px',
                            background: isPinned ? '#FF2A2A' : 'rgba(255,255,255,0.05)',
                            color: isPinned ? '#000' : 'rgba(255,255,255,0.4)',
                            transition: 'background 0.2s ease, color 0.2s ease',
                          }}
                        >
                          {item.year}
                        </span>
                        <h4
                          className="font-heading font-bold uppercase transition-colors duration-200"
                          style={{
                            fontSize: '20px', letterSpacing: '0.06em',
                            color: isPinned ? '#ffffff' : 'rgba(255,255,255,0.35)',
                          }}
                        >
                          {item.label}
                        </h4>
                      </div>
                      <div style={{ opacity: isPinned ? 1 : 0, transition: 'opacity 0.2s ease' }}>
                        <Activity className="w-4 h-4 text-[#FF2A2A] animate-pulse" />
                      </div>
                    </div>

                    <p
                      className="text-gray-500 transition-colors duration-200"
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: isPinned ? 'rgba(255,255,255,0.55)' : undefined,
                      }}
                    >
                      {item.place} — {item.desc}
                    </p>

                    {/* Metric reveal */}
                    <motion.div
                      className="overflow-hidden"
                      animate={{ height: isPinned ? 'auto' : 0, opacity: isPinned ? 1 : 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <div
                        className="flex items-center justify-between mt-3 pt-3"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center font-mono text-[#00D1FF]" style={{ fontSize: '11px', letterSpacing: '0.15em', gap: '0.5rem' }}>
                          <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #00D1FF' }} />
                          IMPACT: {item.metric}
                        </div>
                        <span className="font-mono text-gray-600" style={{ fontSize: '9px' }}>{item.id}</span>
                      </div>
                    </motion.div>

                    {/* Hover background wash */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                      style={{
                        background: 'linear-gradient(to right, rgba(255,42,42,0.03), transparent)',
                        opacity: isPinned ? 1 : 0,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
