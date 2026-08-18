import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, Atom, Eye, BrainCircuit, Zap, Bot, Cpu, Sparkles, ArrowRight, Lock } from 'lucide-react';

const experiments = [
  { 
    id: 1, 
    title: 'Generative UI', 
    code: 'EXP-01',
    icon: BrainCircuit, 
    desc: 'Interfaces that adapt in real-time based on user intent and behavioral patterns.',
    status: 'ACTIVE',
    detail: 'Leveraging LLM context to dynamically reconfigure layouts, content priorities, and interaction patterns per user session.',
    accentColor: '#00D1FF'
  },
  { 
    id: 2, 
    title: 'Autonomous Agents', 
    code: 'EXP-02',
    icon: Atom, 
    desc: 'Visualizing and orchestrating multi-agent AI workflows and real-time collaboration.',
    status: 'BETA',
    detail: 'A visual canvas for designing, monitoring, and iterating on autonomous agent chains for complex design tasks.',
    accentColor: '#FF2A2A'
  },
  { 
    id: 3, 
    title: 'Neural Typography', 
    code: 'EXP-03',
    icon: Eye, 
    desc: 'Variable fonts and typographic parameters controlled by real-time sentiment analysis.',
    status: 'RESEARCH',
    detail: 'Proof-of-concept connecting text sentiment scores to OpenType variable font axes — weight, width, slant.',
    accentColor: '#C9A86A'
  },
];

const capabilities = [
  { icon: Bot, label: 'Agentic Design', desc: 'AI agents that execute design tasks autonomously' },
  { icon: Sparkles, label: 'Prompt-to-UI', desc: 'Natural language to high-fidelity interfaces' },
  { icon: Cpu, label: 'Neural Prototyping', desc: 'ML-informed interaction models' },
  { icon: Zap, label: 'Real-time Synthesis', desc: 'Live data driving adaptive layouts' },
];

const statusColors: Record<string, string> = {
  ACTIVE: '#00D1FF',
  BETA: '#C9A86A',
  RESEARCH: '#FF2A2A',
};

export default function AILab() {
  const [expandedExp, setExpandedExp] = useState<number | null>(null);

  React.useEffect(() => {
    document.title = 'AI Lab | Mithlesh Mishra — Neural Experiments';
    return () => { document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist'; };
  }, []);

  return (
    <div className="pt-5 md:pt-32 pb-12 md:pb-24 min-h-screen bg-[#050505] px-4 md:px-12 relative overflow-hidden font-manrope">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00D1FF]/5 via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF2A2A]/4 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00D1FF]/10 border border-[#00D1FF]/20 relative">
                <FlaskConical className="w-7 h-7 text-[#00D1FF] relative z-10" />
                <div className="absolute inset-0 bg-[#00D1FF] blur-[15px] opacity-20" />
              </div>
              <div>
                <span className="text-[#00D1FF] text-xs font-bold tracking-[0.25em] uppercase font-mono block mb-1">Restricted Access // Level 5</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-gray-600" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Proceed with authorization</span>
                </div>
              </div>
            </div>

            <h1 className="font-heading font-bold text-white leading-none" style={{ fontSize: 'clamp(36px, 7vw, 96px)', letterSpacing: '0.09em' }}>
              NEURAL{' '}
              <span style={{ WebkitTextStroke: '1px rgba(0,209,255,0.4)', color: 'transparent' }}>LAB</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-[#00D1FF]/20 pl-6 relative">
              <span className="absolute left-[-2px] top-0 h-8 w-[2px] bg-[#00D1FF] shadow-[0_0_12px_#00D1FF]" />
              A sandbox for experimental interfaces and next-generation interaction models.
              Exploring the frontier where human intuition meets machine intelligence.
            </p>
          </div>
        </motion.div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {experiments.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
            >
              <button
                type="button"
                className={`group relative w-full text-left bg-[#0A0A0A] border overflow-hidden cursor-pointer transition-all duration-200 ${
                  expandedExp === exp.id
                    ? 'border-[#00D1FF]/40 shadow-[0_0_40px_rgba(0,209,255,0.06)]'
                    : 'border-white/5 hover:border-white/15'
                }`}
                aria-expanded={expandedExp === exp.id}
                aria-label={`Toggle details for ${exp.title}`}
                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
              >
                {/* Card header accent bar */}
                <div 
                  className="h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                  style={{ backgroundColor: exp.accentColor }}
                />

                <div className="p-8">
                  {/* Status + Code */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest border border-white/10 px-2 py-0.5">
                      {exp.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-1.5 h-1.5 animate-pulse"
                        style={{ backgroundColor: statusColors[exp.status] }}
                      />
                      <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: statusColors[exp.status] }}>
                        {exp.status}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative w-fit">
                    <div 
                      className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 scale-150"
                      style={{ backgroundColor: exp.accentColor }}
                    />
                    <exp.icon 
                      className="w-12 h-12 text-gray-500 group-hover:text-white transition-colors duration-200 relative z-10" 
                      style={{ color: expandedExp === exp.id ? exp.accentColor : undefined }}
                    />
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-[#00D1FF] transition-colors duration-200" style={{ letterSpacing: '0.08em' }}>
                    {exp.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 group-hover:text-gray-400 transition-colors duration-200">
                    {exp.desc}
                  </p>

                  {/* Expand detail */}
                  <AnimatePresence>
                    {expandedExp === exp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 pt-4 mt-2">
                          <p className="text-gray-400 text-xs font-mono leading-relaxed">
                            {exp.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between">
                    <div 
                      className="px-3 py-1.5 border text-[10px] uppercase tracking-widest font-bold transition-all duration-200 relative group/badge cursor-help"
                      style={{
                        borderColor: `${exp.accentColor}30`,
                        color: exp.accentColor,
                        backgroundColor: `${exp.accentColor}08`
                      }}
                      title="This experiment is in prototype stage — a design-led proof of concept not yet available as a public product."
                    >
                      Prototype Only
                      {/* Tooltip */}
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                        style={{
                          background: 'rgba(10,10,10,0.96)',
                          border: '1px solid rgba(255,255,255,0.10)',
                          backdropFilter: 'blur(12px)',
                          fontSize: '10px',
                          letterSpacing: '0.02em',
                          color: 'rgba(255,255,255,0.7)',
                          maxWidth: '220px',
                          whiteSpace: 'normal',
                          lineHeight: '1.5',
                        }}
                      >
                        <div className="font-bold text-white mb-1" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>PROTOTYPE STATUS</div>
                        Design-led proof of concept — not yet available as a public product.
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                          style={{
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: '5px solid rgba(255,255,255,0.10)',
                          }}
                        />
                      </div>
                    </div>
                    <ArrowRight 
                      className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                    />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Capabilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-t border-white/5 pt-16"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] w-8 bg-[#00D1FF]" />
            <span className="text-xs font-mono text-[#00D1FF] uppercase tracking-[0.3em]">Active Capabilities</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-6 bg-[#0A0A0A] border border-white/5 hover:border-[#00D1FF]/30 hover:bg-[#00D1FF]/3 transition-all duration-200 cursor-default"
              >
                <cap.icon className="w-7 h-7 text-gray-600 group-hover:text-[#00D1FF] transition-colors duration-200 mb-4" />
                <h4 className="text-sm font-heading font-bold text-white mb-2 group-hover:text-[#00D1FF] transition-colors duration-200">
                  {cap.label}
                </h4>
                <p className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors duration-200 leading-relaxed">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
