import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Briefcase, Award, Code, Database, Cpu, Target, Zap, Layout, Terminal } from 'lucide-react';

const timeline = [
  { 
    year: 'Nov 2020 – Present', 
    role: 'Senior UX Designer', 
    company: 'Appzlogic Mobility Solutions',
    companyUrl: 'https://www.linkedin.com/company/appzlogic/',
    desc: 'Led end-to-end product strategy and UX design across mobile apps, SaaS platforms, dashboards, and enterprise systems.',
    impact: 'Delivered +25% engagement; +15% usability; built design systems and AI workflows; reduced delivery timelines by 10%.'
  },
  { 
    year: '2023', 
    role: 'Creative Head', 
    company: 'Legends Cricket League (LLC)',
    companyUrl: 'https://www.linkedin.com/company/legends-cricket-league/',
    desc: 'Led creative direction and national campaign branding; delivered sponsor creatives, stadium branding, banners, print ads; built scalable brand guidelines.',
    impact: 'Designed cohesive brand identity for a national sports league.'
  },
  { 
    year: 'Dec 2018 – Nov 2020', 
    role: 'UI & Graphic Designer', 
    company: 'Loantube Technologies Pvt Ltd',
    companyUrl: 'https://www.linkedin.com/company/loantube/',
    desc: 'Built UI solutions and branding assets for digital platforms; supported product growth and campaign performance.',
    impact: 'Established key visual assets for fintech growth.'
  },
];

const achievements = [
  { label: 'Experience', value: '7+ Years' },
  { label: 'Product Engagement', value: '+25%' },
  { label: 'Usability Boost', value: '+15%' },
  { label: 'Delivery Speed', value: '+10%' },
];

const strengths = [
  'UX Strategy', 'Product Thinking', 'Design Systems', 'AI & Automation', 
  'Interaction Design', 'Usability Testing', 'Creative Direction', 'Strategic Problem Solving'
];

export default function Identity() {
  React.useEffect(() => {
    document.title = 'Identity | Mithlesh Mishra — Senior UX Designer';
    return () => { document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist'; };
  }, []);

  return (
    <div className="pt-5 md:pt-32 pb-12 md:pb-24 min-h-screen bg-[#050505] px-4 md:px-12 relative overflow-hidden font-manrope">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-16 border-b border-white/5 pb-6 md:pb-8"
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
             <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>Identity Protocol // Verified</span>
          </div>
          <h1 className="font-heading font-bold text-white leading-none" style={{ fontSize: 'clamp(28px, 6vw, 80px)', letterSpacing: '0.09em', marginBottom: '1rem' }}>
            OPERATIVE{' '}
            <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)', color: 'transparent' }}>DOSSIER</span>
          </h1>
          <h2 className="text-base md:text-2xl text-gray-400 font-light mb-4 md:mb-6 tracking-wide border-l border-[#00D1FF]/30 pl-4 md:pl-6">
            Senior UX Designer // Product Strategist // Creative Head
          </h2>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-3xl">
            Strategic product design leader with 7+ years driving measurable outcomes across SaaS, AI, and enterprise platforms. 
            Expert in scalable design systems, cross-functional leadership, and transforming complex business problems into high-adoption user experiences.
          </p>
        </motion.div>

        {/* Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Column: Stats & Skills (4 Cols) */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12">
             {/* Profile Card */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-[#0A0A0A] border border-white/10 p-6 relative overflow-hidden group hover:border-[#FF2A2A]/30 transition-colors"
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <User className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-4 relative z-10">
                   <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</div>
                      <div className="text-sm font-bold text-[#00D1FF] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#00D1FF] animate-pulse" />
                        OPERATIONAL
                      </div>
                   </div>
                   <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-white text-sm">New Delhi / Ghaziabad, India</div>
                   </div>
                   <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Clearance</div>
                      <div className="text-white text-sm">Level 7 (Verified)</div>
                   </div>
                </div>
             </motion.div>

             {/* Impact Metrics */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="space-y-4"
             >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-3 h-3 text-[#FF2A2A]" />
                   Verified Impact
                </h3>
                <div className="grid grid-cols-1 gap-3">
                   {achievements.map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-3 flex justify-between items-center group hover:border-[#FF2A2A]/20 transition-colors">
                         <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
                         <span className="text-sm font-bold text-white font-mono group-hover:text-[#FF2A2A] transition-colors">{stat.value}</span>
                      </div>
                   ))}
                </div>
             </motion.div>

             {/* Core Competencies Chips */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
             >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Zap className="w-3 h-3 text-[#FF2A2A]" />
                   Core Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                   {strengths.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-[#111] border border-white/10 text-[10px] text-gray-300 uppercase tracking-wider hover:text-white hover:border-[#FF2A2A] transition-colors cursor-crosshair">
                         {skill}
                      </span>
                   ))}
                </div>
             </motion.div>
          </div>

          {/* Right Column: Experience Timeline (8 Cols) */}
          <div className="lg:col-span-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-[#080808]/50 border border-white/5 p-5 md:p-8 relative"
             >
               <div className="absolute top-0 right-0 p-4">
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest border border-white/10 px-2 py-1">
                     Mission Log
                  </span>
               </div>

               <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 md:mb-10 flex items-center gap-2">
                   <Briefcase className="w-4 h-4 text-[#FF2A2A]" />
                   Operations History
                </h3>
                
                <div className="space-y-8 md:space-y-12 relative border-l border-white/10 ml-3">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative pl-6 md:pl-8 group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] bg-[#050505] border border-gray-600 group-hover:border-[#FF2A2A] group-hover:bg-[#FF2A2A] transition-colors z-10" />
                      {/* Active Pulse (First Item) */}
                      {index === 0 && (
                         <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] bg-[#FF2A2A] animate-ping opacity-75" />
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-1">
                        <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#FF2A2A] transition-colors">{item.role}</h4>
                        <span className="font-mono text-xs text-[#FF2A2A] bg-[#FF2A2A]/10 px-2 py-0.5 border border-[#FF2A2A]/20">{item.year}</span>
                      </div>
                      
                      <div className="text-gray-400 text-sm mb-4 font-mono tracking-wide flex items-center gap-2">
                         <span className="w-1 h-1 bg-gray-500" />
                         <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF2A2A] transition-colors">{item.company}</a>
                      </div>
                      
                      <p className="text-gray-400 leading-relaxed text-sm max-w-2xl mb-3">
                         {item.desc}
                      </p>

                      <div className="flex items-start gap-2 text-xs text-gray-500 font-mono mt-2 bg-white/5 p-3 border-l-2 border-white/20">
                         <span className="text-[#FF2A2A] uppercase font-bold shrink-0">Impact:</span>
                         {item.impact}
                      </div>
                    </div>
                  ))}
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
