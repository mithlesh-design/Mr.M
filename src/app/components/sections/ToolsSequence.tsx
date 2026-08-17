import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Cpu, Code, Layers, PenTool, Globe, Database, Terminal, Command } from 'lucide-react';
import { useIsMobile } from '../ui/use-mobile';

const toolCategories = [
  {
    code: 'DC',
    label: 'Design Core',
    tools: [
      { name: 'Figma', icon: PenTool, level: 'MASTERY', desc: 'Primary UI canvas' },
      { name: 'Motion', icon: Zap, level: 'EXPERT', desc: 'Cinematic animation' },
    ],
  },
  {
    code: 'FE',
    label: 'Frontend Ops',
    tools: [
      { name: 'React', icon: Code, level: 'EXPERT', desc: 'Component architecture' },
      { name: 'TypeScript', icon: Terminal, level: 'ADVANCED', desc: 'Type safety' },
      { name: 'Next.js', icon: Globe, level: 'ADVANCED', desc: 'Production framework' },
      { name: 'Tailwind', icon: Layers, level: 'EXPERT', desc: 'Rapid styling' },
    ],
  },
  {
    code: 'AI',
    label: 'AI & Intelligence',
    tools: [
      { name: 'OpenAI', icon: Cpu, level: 'INTEGRATED', desc: 'Neural augmentation' },
      { name: 'Cursor', icon: Command, level: 'NATIVE', desc: 'AI-native IDE' },
      { name: 'V0', icon: Zap, level: 'ADOPTER', desc: 'Generative UI' },
    ],
  },
  {
    code: 'DB',
    label: 'Data & Backend',
    tools: [
      { name: 'Supabase', icon: Database, level: 'INTERMEDIATE', desc: 'Backend infrastructure' },
    ],
  },
];

// Level → accent colour
const levelColor: Record<string, string> = {
  MASTERY: '#FF2A2A',
  EXPERT: '#FF2A2A',
  ADVANCED: '#00D1FF',
  INTEGRATED: '#00D1FF',
  NATIVE: '#C9A86A',
  ADOPTER: '#C9A86A',
  INTERMEDIATE: 'rgba(255,255,255,0.3)',
};

export default function ToolsSequence() {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  /* ── Mobile detection: gate hover effects so touch can never trigger blink ── */
  const isMobile = useIsMobile();

  return (
    <section
      className="bg-[#050505] relative overflow-hidden py-12 md:py-20 lg:py-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Scanning beam */}
      <motion.div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,42,42,0.3), transparent)',
          boxShadow: '0 0 16px rgba(255,42,42,0.2)',
        }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-16" style={{ gap: '1rem' }}>
          <div>
            <motion.div
              className="flex items-center mb-4"
              style={{ gap: '0.75rem' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                Arsenal Calibration
              </span>
            </motion.div>
            <motion.h2
              className="font-heading font-bold text-white leading-none"
              style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '0.09em' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              viewport={{ once: true }}
            >
              TACTICAL{' '}
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.18)', color: 'transparent' }}>
                LOADOUT
              </span>
            </motion.h2>
          </div>
          <div className="hidden md:flex items-center" style={{ gap: '0.5rem' }}>
            <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #00D1FF' }} />
            <span className="font-mono text-gray-500 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
              V.4.0.2 · System Optimised
            </span>
          </div>
        </div>

        {/* ── CATEGORISED TOOL ROWS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {toolCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.code}
              className="relative"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="flex flex-col md:flex-row md:items-start" style={{ gap: '1.5rem' }}>

                {/* Category label column */}
                <div className="flex-shrink-0" style={{ width: '180px' }}>
                  <div className="flex items-center" style={{ gap: '0.5rem', marginBottom: '2px' }}>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#FF2A2A', opacity: 0.7 }}
                    >
                      {cat.code}
                    </span>
                  </div>
                  <h3
                    className="font-heading font-bold text-white uppercase"
                    style={{ fontSize: '14px', letterSpacing: '0.04em' }}
                  >
                    {cat.label}
                  </h3>
                </div>

                {/* Tools row */}
                <div className="flex flex-wrap" style={{ gap: '0.625rem', flex: 1 }}>
                  {cat.tools.map((tool, toolIndex) => {
                    const key = `${cat.code}-${tool.name}`;
                    const isActive = hoveredTool === key;
                    const accent = levelColor[tool.level] ?? 'rgba(255,255,255,0.3)';

                    return (
                      <motion.div
                        key={tool.name}
                        className="relative cursor-default"
                        /* Mobile: never activate hover state — prevents blink from synthesised pointer events */
                        onPointerEnter={(e) => { if (!isMobile && e.pointerType === 'mouse') setHoveredTool(key); }}
                        onPointerLeave={(e) => { if (!isMobile && e.pointerType === 'mouse') setHoveredTool(null); }}
                        /* Mobile: opacity-only entry (no y-translate) eliminates jitter on scroll-into-view */
                        initial={{ opacity: 0, y: isMobile ? 0 : 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIndex * 0.1 + toolIndex * 0.06, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <div
                          className="flex items-center rounded-lg overflow-hidden"
                          style={{
                            padding: '10px 14px',
                            gap: '0.625rem',
                            background: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isActive ? accent + '45' : 'rgba(255,255,255,0.07)'}`,
                            transition: 'background 0.22s ease, border-color 0.22s ease',
                          }}
                        >
                          {/* Icon */}
                          <tool.icon
                            className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
                            style={{ color: isActive ? accent : 'rgba(255,255,255,0.3)' }}
                          />

                          {/* Name */}
                          <span
                            className="font-heading font-bold uppercase"
                            style={{
                              fontSize: '13px',
                              letterSpacing: '0.04em',
                              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                              transition: 'color 0.22s ease',
                            }}
                          >
                            {tool.name}
                          </span>

                          {/* Level pill — desktop only, opacity-only transition (no width animation = no layout shift) */}
                          <span
                            className="hidden md:inline font-mono uppercase"
                            style={{
                              fontSize: '8px',
                              letterSpacing: '0.15em',
                              color: accent,
                              opacity: isActive ? 1 : 0,
                              transition: 'opacity 0.18s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tool.level}
                          </span>
                        </div>

                        {/* Desc tooltip — desktop only (absolutely positioned, but hidden on mobile to prevent overlap) */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              className="absolute hidden md:block font-mono text-gray-500 pointer-events-none"
                              style={{
                                fontSize: '9px', letterSpacing: '0.1em',
                                top: '100%', left: 0, marginTop: '6px',
                                whiteSpace: 'nowrap',
                                zIndex: 20,
                              }}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.16 }}
                            >
                              {tool.desc}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Tool count */}
                <div className="hidden md:flex items-center flex-shrink-0" style={{ marginTop: '4px' }}>
                  <span
                    className="font-mono text-gray-700"
                    style={{ fontSize: '10px', letterSpacing: '0.15em' }}
                  >
                    {String(cat.tools.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    </section>
  );
}
