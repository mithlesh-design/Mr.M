import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, Cpu, Code, Layers, Brain, Layout, PenTool,
  Cloud, Zap, Terminal,
  MessageSquare, Search, Sparkles, Flame, Heart,
  Monitor, Share2, Eye, Image, Film, Video,
  Code2, Paintbrush, Circle,
} from 'lucide-react';
import { usePrecisionMode } from '../context/PrecisionModeContext';
import ExperimentalLoadoutBay from '../features/arsenal/ExperimentalLoadoutBay';

// ─── Data ────────────────────────────────────────────────────────────────────

const competencies = [
  {
    category: 'UX Strategy & Leadership',
    icon: Brain,
    desc: 'Driving product vision and cross-functional alignment.',
    items: ['Product Thinking', 'Strategic Problem Solving', 'Stakeholder Management'],
    accent: '#FF2A2A',
  },
  {
    category: 'Design Systems',
    icon: Layers,
    desc: 'Architecting scalable component libraries.',
    items: ['Atomic Design', 'Token Architecture', 'Documentation'],
    accent: '#00D1FF',
  },
  {
    category: 'AI & Automation',
    icon: Cpu,
    desc: 'Integrating intelligence into user workflows.',
    items: ['Generative UI', 'LLM Prompting', 'AI Workflows'],
    accent: '#C9A86A',
  },
  {
    category: 'Interaction Design',
    icon: Zap,
    desc: 'Creating fluid, responsive digital experiences.',
    items: ['Prototyping', 'Micro-interactions', 'Motion Design'],
    accent: '#FF2A2A',
  },
  {
    category: 'Creative Direction',
    icon: PenTool,
    desc: 'Leading visual identity and brand campaigns.',
    items: ['Visual Design', 'Brand Strategy', 'Campaign Management'],
    accent: '#00D1FF',
  },
  {
    category: 'Usability Testing',
    icon: ShieldCheck,
    desc: 'Validating decisions with user research.',
    items: ['User Interviews', 'A/B Testing', 'Heuristic Evaluation'],
    accent: '#C9A86A',
  },
];

const tools = [
  {
    category: 'AI Research & Generation',
    items: ['ChatGPT', 'Perplexity', 'Google AI Studio'],
  },
  {
    category: 'AI Design & Automation',
    items: ['Adobe Firefly', 'Nano Banana', 'Antigravity', 'Relume', 'Lovable', 'Gamma', 'Gemini CLI'],
  },
  {
    category: 'Product Design & Interface',
    items: ['Figma', 'Sketch', 'Miro', 'FigJam', 'Framer'],
  },
  {
    category: 'Prototyping & Collaboration',
    items: ['Adobe XD', 'Zeplin', 'InVision'],
  },
  {
    category: 'Visual & Motion',
    items: ['Photoshop', 'Illustrator', 'After Effects', 'Adobe Premiere Pro'],
  },
  {
    category: 'Technical Foundations',
    items: ['HTML5', 'CSS3', 'Responsive Design', 'AWS Basics'],
  },
];

const toolIcons: Record<string, React.ElementType> = {
  ChatGPT:            MessageSquare,
  Perplexity:         Search,
  'Google AI Studio': Sparkles,
  'Adobe Firefly':    Flame,
  'Nano Banana':      Zap,
  Antigravity:        Layers,
  Relume:             Layout,
  Lovable:            Heart,
  Gamma:              Monitor,
  'Gemini CLI':       Terminal,
  Figma:              PenTool,
  Sketch:             Layers,
  Miro:               Layout,
  FigJam:             Sparkles,
  Framer:             Code,
  'Adobe XD':         Cpu,
  Zeplin:             Share2,
  InVision:           Eye,
  Photoshop:          Image,
  Illustrator:        Paintbrush,
  'After Effects':    Film,
  'Adobe Premiere Pro': Video,
  HTML5:              Code2,
  CSS3:               Paintbrush,
  'Responsive Design': Monitor,
  'AWS Basics':       Cloud,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Arsenal() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { mode } = usePrecisionMode();

  React.useEffect(() => {
    document.title = 'Arsenal | Mithlesh Mishra — Capabilities';
    return () => { document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist'; };
  }, []);

  return (
    <div className="pt-5 md:pt-32 pb-12 md:pb-24 min-h-screen bg-[#050505] px-4 md:px-12 font-manrope">

      {/* Subtle ambient top glow — purely decorative, page-scoped (not fixed) */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '500px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,42,42,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Page header ── */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center mb-5" style={{ gap: '0.75rem' }}>
              <div className="h-px w-6 bg-[#FF2A2A]" />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
                Operational Capabilities
              </span>
            </div>
            <h1
              className="font-heading font-bold text-white leading-none"
              style={{ fontSize: 'clamp(36px, 6vw, 80px)', letterSpacing: '0.09em', marginBottom: '1.5rem' }}
            >
              CAPABILITY{' '}
              <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)', color: 'transparent' }}>ARSENAL</span>
            </h1>
            <p
              className="text-gray-500 max-w-xl"
              style={{ fontSize: '15px', lineHeight: 1.7, borderLeft: '1px solid rgba(255,42,42,0.3)', paddingLeft: '1rem' }}
            >
              A comprehensive suite of skills and tools deployed to execute high-stakes digital projects with precision.
            </p>
          </motion.div>
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.28em' }}>
            01 — Core Competencies
          </span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* ── 1. Core Competencies Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px mb-32"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          {competencies.map((skill, index) => {
            const isActive = activeCard === index;
            const num = String(index + 1).padStart(2, '0');

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.5, ease: 'easeOut' }}
                className="relative cursor-default outline-none"
                style={{
                  background: isActive ? '#0d0d0d' : '#080808',
                  transition: 'background 180ms ease-out',
                }}
                tabIndex={0}
                onPointerEnter={() => setActiveCard(index)}
                onPointerLeave={() => setActiveCard(null)}
                onFocus={() => setActiveCard(index)}
                onBlur={() => setActiveCard(null)}
              >
                {/* Accent top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{
                    background: isActive
                      ? `linear-gradient(to right, ${skill.accent}, transparent 70%)`
                      : 'transparent',
                    transition: 'background 200ms ease-out',
                  }}
                />

                <div className="p-8 flex flex-col h-full" style={{ minHeight: '260px' }}>

                  {/* Number + icon row */}
                  <div className="flex items-start justify-between mb-7">
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        color: isActive ? skill.accent : 'rgba(255,255,255,0.12)',
                        transition: 'color 180ms ease-out',
                      }}
                    >
                      {num}
                    </span>
                    <skill.icon
                      strokeWidth={1.25}
                      style={{
                        width: 20,
                        height: 20,
                        color: isActive ? skill.accent : 'rgba(255,255,255,0.22)',
                        transition: 'color 180ms ease-out',
                      }}
                    />
                  </div>

                  {/* Heading */}
                  <h3
                    className="font-heading font-bold mb-2 leading-tight"
                    style={{
                      fontSize: '17px',
                      letterSpacing: '0.04em',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.85)',
                      transition: 'color 180ms ease-out',
                    }}
                  >
                    {skill.category}
                  </h3>

                  {/* Description */}
                  <p
                    className="leading-relaxed mb-6"
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}
                  >
                    {skill.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap mt-auto" style={{ gap: '6px' }}>
                    {skill.items.map((item, i) => (
                      <span
                        key={i}
                        className="font-mono"
                        style={{
                          fontSize: '10px',
                          padding: '4px 10px',
                          letterSpacing: '0.08em',
                          color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                          transition: 'color 180ms ease-out, border-color 180ms ease-out',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {mode === 'INTEL' && (
                    <span className="absolute top-4 right-4 text-[8px] text-gray-700 font-mono tracking-widest">SYS.OK</span>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 2. Tactical Loadout ── */}
        <div className="mb-28">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-14">
            <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.28em' }}>
              02 — Tactical Loadout
            </span>
            <div className="flex-1 h-px bg-white/5" />
            <Terminal className="w-3.5 h-3.5 text-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {tools.map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
              >
                {/* Category heading */}
                <div className="mb-5">
                  <span
                    className="font-mono uppercase text-white"
                    style={{ fontSize: '10px', letterSpacing: '0.22em' }}
                  >
                    {group.category}
                  </span>
                  <div className="mt-2 h-px bg-white/5" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((tool, i) => {
                    const ToolIcon = toolIcons[tool] ?? Circle;
                    return (
                      <button
                        type="button"
                        key={i}
                        className="group flex items-center gap-2 cursor-pointer outline-none"
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.07)',
                          transition: 'border-color 160ms ease-out',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                      >
                        <ToolIcon
                          strokeWidth={1.5}
                          style={{
                            width: 12,
                            height: 12,
                            color: 'rgba(255,255,255,0.2)',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          className="text-gray-400 whitespace-nowrap"
                          style={{ fontSize: '12px', letterSpacing: '0.02em' }}
                        >
                          {tool}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 3. Experimental Loadout Bay ── */}
        <ExperimentalLoadoutBay />

      </div>
    </div>
  );
}
