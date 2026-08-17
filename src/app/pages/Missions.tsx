import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Target, FileText, Activity, ArrowRight } from 'lucide-react';
import { useSound } from '../audio/AudioSystem';
import { missionSummaries } from '../data/missionSummaries';

const categories = ['All', 'AI', 'SaaS', 'Healthcare', 'Enterprise', 'Mobile'];

export default function Missions() {
  const [filter, setFilter] = useState('All');
  const { play } = useSound();

  React.useEffect(() => {
    document.title = 'Missions | Mithlesh Mishra — Case Files';
    return () => { document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist'; };
  }, []);

  const filteredMissions = filter === 'All' 
    ? missionSummaries
    : missionSummaries.filter(m => m.tags.includes(filter) || m.category.includes(filter));

  return (
    <div className="pt-5 md:pt-32 pb-12 md:pb-24 min-h-screen bg-[#050505] px-4 md:px-12 relative overflow-hidden font-manrope">

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div>
            <span className="text-[#FF2A2A] text-xs font-bold tracking-[0.2em] uppercase block mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Classified Archive
            </span>
            <h1 className="font-heading font-bold text-white leading-none" style={{ fontSize: 'clamp(32px, 6vw, 72px)', letterSpacing: '0.09em' }}>
              MISSION{' '}
              <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)', color: 'transparent' }}>FILES</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { play('click'); setFilter(cat); }}
                className={`font-mono uppercase transition-all duration-200 ${
                  filter === cat
                    ? 'bg-[#FF2A2A] border border-[#FF2A2A] text-white shadow-[0_0_16px_rgba(255,42,42,0.3)]'
                    : 'border border-white/10 text-gray-500 hover:border-[#FF2A2A]/40 hover:text-white hover:bg-white/5'
                }`}
                style={{ padding: '6px 14px', fontSize: '10px', letterSpacing: '0.15em' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className={`grid gap-8 ${filteredMissions.length === 1 ? 'grid-cols-1 max-w-md' : filteredMissions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          <AnimatePresence mode="popLayout">
            {filteredMissions.map((mission) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={mission.id}
              >
                <Link to={`/missions/${mission.slug}`} className="block">
                  <Card 
                    className="h-full group cursor-pointer bg-[#0A0A0A] border-white/5 hover:border-[#FF2A2A]/40 transition-all duration-300 relative overflow-hidden"
                    glowColor="#FF2A2A"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-gray-900 border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 opacity-60" />
                      <motion.img
                        src={mission.image}
                        alt={mission.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.style.display = 'none';
                          const placeholder = t.parentElement?.querySelector('[data-img-fallback]') as HTMLElement | null;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      {/* Fallback shown when image fails to load */}
                      <div
                        data-img-fallback
                        className="absolute inset-0 items-center justify-center bg-[#0a0a0a] border border-white/5"
                        style={{ display: 'none' }}
                        aria-hidden="true"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">IMAGE UNAVAILABLE</span>
                      </div>
                      
                      {/* Category Chip - Tactical Tag */}
                      <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#00D1FF] tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                         <div className="w-1 h-1 bg-[#00D1FF] animate-pulse" />
                         {mission.category}
                      </div>

                      {/* Code tag */}
                      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-black/60 text-[9px] font-mono text-gray-500 tracking-widest uppercase">
                         {mission.code}
                      </div>

                      {/* Hover Scan Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF2A2A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                    </div>

                    <div className="relative z-20 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#FF2A2A] transition-colors duration-300">
                              {mission.title}
                          </h3>
                          <Activity className="w-4 h-4 text-gray-600 group-hover:text-[#FF2A2A] transition-colors" />
                      </div>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l border-white/10 pl-3 group-hover:border-[#FF2A2A]/50 transition-colors">
                          {mission.impactLine}
                      </p>

                      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                          <span className="group-hover:text-white transition-colors flex items-center gap-1.5">
                            <FileText className="w-3 h-3" />
                            VIEW CASE FILE
                          </span>
                          <div className="flex items-center gap-2">
                             <span className="font-bold" style={{ color: mission.color }}>{mission.metric}</span>
                             <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
