import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Target, Layers, Zap, CheckCircle, FileText, Clock, User, Wrench, Terminal } from 'lucide-react';
import { getMissionBySlug, allMissions } from '../data/missions';
import { useSound } from '../audio/AudioSystem';

export default function MissionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { play } = useSound();
  const mission = getMissionBySlug(slug || '');
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [activeGallery, setActiveGallery] = useState(0);

  // Redirect to /missions if slug doesn't match any mission
  useEffect(() => {
    if (!mission) {
      navigate('/missions', { replace: true });
    }
  }, [mission, navigate]);

  useEffect(() => {
    if (mission) {
      document.title = `${mission.title} | Mission File ${mission.code}`;
    }
    const timer = setTimeout(() => { play('bootComplete'); setIsDecrypting(false); }, 900);
    return () => {
      clearTimeout(timer);
      document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist';
    };
  }, [mission, play]);

  // Find adjacent missions for nav
  const currentIndex = allMissions.findIndex(m => m.slug === slug);
  const prevMission = currentIndex > 0 ? allMissions[currentIndex - 1] : null;
  const nextMission = currentIndex < allMissions.length - 1 ? allMissions[currentIndex + 1] : null;

  // Render nothing while redirect is in-flight
  if (!mission) return null;

  const phaseItems = [
    { icon: FileText, title: 'Problem', body: mission.details.problem, accent: '#FF2A2A' },
    { icon: Target, title: 'Strategy', body: mission.details.strategy, accent: '#00D1FF' },
    { icon: Layers, title: 'Process', body: mission.details.process, accent: 'rgba(255,255,255,0.3)' },
    { icon: Zap, title: 'Solution', body: mission.details.solution, accent: '#C9A86A' },
    { icon: CheckCircle, title: 'Impact', body: mission.details.impact, accent: '#00D1FF' },
  ];

  return (
    <>
      {/* Decryption Overlay */}
      <AnimatePresence>
        {isDecrypting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[#050505] flex items-center justify-center"
          >
            <motion.div
              className="flex flex-col items-center"
              style={{ gap: '1.5rem' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 border-t-2 border-[#FF2A2A] animate-spin" />
                <div className="absolute inset-2 border-b-2 border-[#FF2A2A]/40 animate-spin" style={{ animationDirection: 'reverse' }} />
                <Terminal className="absolute inset-0 m-auto w-5 h-5 text-[#FF2A2A]" />
              </div>
              <div className="font-mono text-[#FF2A2A] uppercase animate-pulse" style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
                Decrypting Case File {mission.code}...
              </div>
              <div className="overflow-hidden bg-white/5" style={{ width: '200px', height: '2px' }}>
                <motion.div
                  className="h-full bg-[#FF2A2A]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 8px rgba(255,42,42,0.6)' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#050505] font-manrope relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none" />

        {/* ── HERO BANNER ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(360px, 55vh, 560px)' }}>
          <img
            src={mission.heroImage}
            alt={mission.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(60%) brightness(0.4)', mixBlendMode: 'luminosity' }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 to-transparent" />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 30% 80%, ${mission.color}10, transparent 60%)` }}
          />
          {/* Scanline texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          {/* Back nav */}
          <motion.div
            className="absolute top-6 left-5 sm:left-8 z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Link
              to="/missions"
              className="flex items-center font-mono text-gray-400 hover:text-white transition-colors uppercase group"
              style={{ fontSize: '10px', letterSpacing: '0.2em', gap: '0.5rem' }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Archives
            </Link>
          </motion.div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1.25rem, 5vw, 3rem)' }}>
            <div className="max-w-7xl mx-auto">
              {/* Classification badge */}
              <motion.div
                className="flex items-center flex-wrap mb-4"
                style={{ gap: '0.75rem' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div
                  className="font-mono font-bold uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.25em',
                    padding: '4px 10px',
                    border: `1px solid ${mission.color}`,
                    color: mission.color,
                    background: `${mission.color}10`,
                  }}
                >
                  CONFIDENTIAL
                </div>
                <span className="font-mono text-gray-500 uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                  CASE: {mission.code}
                </span>
                <span className="font-mono text-gray-600" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                  // {mission.year}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="font-heading font-bold text-white leading-none mb-3"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '0.08em' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                {mission.title}
              </motion.h1>

              {/* Category + metric */}
              <motion.div
                className="flex items-center flex-wrap"
                style={{ gap: '1.5rem' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <span className="font-mono uppercase" style={{ fontSize: '11px', letterSpacing: '0.2em', color: mission.color }}>
                  {mission.category}
                </span>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                  <span className="font-heading font-bold" style={{ fontSize: '20px', color: mission.color }}>
                    {mission.metric}
                  </span>
                  <span className="font-mono text-gray-500 uppercase" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                    {mission.metricLabel}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 max-w-7xl mx-auto" style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3rem)' }}>

          {/* ── META INFO BAR ── */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 mb-16 md:mb-20 overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0A0A0A' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            {[
              { icon: Clock, label: 'Duration', value: mission.duration },
              { icon: User, label: 'Role', value: mission.role },
              { icon: FileText, label: 'Year', value: mission.year },
              { icon: Wrench, label: 'Category', value: mission.category },
            ].map((meta, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{
                  padding: 'clamp(12px, 2vw, 20px) clamp(12px, 2vw, 24px)',
                  gap: '0.75rem',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <meta.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="font-mono text-gray-600 uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>
                    {meta.label}
                  </div>
                  <div className="text-white" style={{ fontSize: '13px' }}>
                    {meta.value}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── MISSION BRIEFING — Problem → Strategy → Process → Solution → Impact ── */}
          <div className="mb-16 md:mb-24">
            <motion.div
              className="flex items-center mb-10"
              style={{ gap: '0.75rem' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-px w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                Mission Briefing
              </span>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {phaseItems.map((phase, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Phase label */}
                    <div
                      className="flex items-center md:items-start md:flex-col md:justify-center flex-shrink-0"
                      style={{
                        padding: 'clamp(12px, 2vw, 20px) clamp(16px, 2vw, 24px)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        borderRight: 'none',
                        minWidth: '0',
                        gap: '0.75rem',
                      }}
                    >
                      <div
                        className="hidden md:block"
                        style={{
                          width: '100%',
                          borderBottom: 'none',
                          borderRight: '1px solid rgba(255,255,255,0.04)',
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                      />
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          width: '36px',
                          height: '36px',
                          background: `${phase.accent}10`,
                          border: `1px solid ${phase.accent}25`,
                        }}
                      >
                        <phase.icon className="w-4 h-4" style={{ color: phase.accent }} />
                      </div>
                      <div>
                        <div className="font-mono text-gray-600 uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>
                          Phase {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="font-heading font-bold text-white" style={{ fontSize: '14px', letterSpacing: '0.06em' }}>
                          {phase.title}
                        </div>
                      </div>
                    </div>

                    {/* Phase content */}
                    <div
                      className="flex-1"
                      style={{
                        padding: 'clamp(12px, 2vw, 20px) clamp(16px, 2vw, 24px)',
                        borderLeft: 'none',
                      }}
                    >
                      {i === phaseItems.length - 1 ? (
                        /* Impact section — highlighted */
                        <div
                          className="rounded-lg"
                          style={{
                            padding: '16px 20px',
                            background: `${mission.color}08`,
                            border: `1px solid ${mission.color}15`,
                          }}
                        >
                          <p className="text-white leading-relaxed" style={{ fontSize: '15px' }}>
                            {phase.body}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-300 leading-relaxed" style={{ fontSize: '15px' }}>
                          {phase.body}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── TOOLS & TECHNOLOGIES ── */}
          <motion.div
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-8" style={{ gap: '0.75rem' }}>
              <div className="h-px w-8 bg-[#00D1FF]" style={{ boxShadow: '0 0 6px rgba(0,209,255,0.5)' }} />
              <span className="font-mono text-[#00D1FF] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                Arsenal Deployed
              </span>
            </div>
            <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
              {mission.tools.map((tool, i) => (
                <motion.div
                  key={tool}
                  className="flex items-center rounded-lg"
                  style={{
                    padding: '8px 16px',
                    background: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    gap: '0.5rem',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="w-1.5 h-1.5" style={{ background: mission.color, opacity: 0.6 }} />
                  <span className="font-mono text-gray-300 uppercase" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                    {tool}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── GALLERY ── */}
          {mission.gallery.length > 0 && (
            <motion.div
              className="mb-16 md:mb-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-8" style={{ gap: '0.75rem' }}>
                <div className="h-px w-8 bg-[#C9A86A]" style={{ boxShadow: '0 0 6px rgba(201,168,106,0.5)' }} />
                <span className="font-mono text-[#C9A86A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                  Visual Evidence
                </span>
              </div>

              {/* Main gallery image */}
              <div
                className="relative overflow-hidden mb-4"
                style={{
                  aspectRatio: '16/9',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: '#0A0A0A',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeGallery}
                    src={mission.gallery[activeGallery].image}
                    alt={mission.gallery[activeGallery].caption}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.85)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="font-mono text-gray-300" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    {mission.gallery[activeGallery].caption}
                  </span>
                  <span className="font-mono text-gray-600" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                    {String(activeGallery + 1).padStart(2, '0')} / {String(mission.gallery.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex" style={{ gap: '0.5rem' }}>
                {mission.gallery.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { play('click'); setActiveGallery(i); }}
                    className="relative overflow-hidden flex-1 transition-all duration-200"
                    style={{
                      aspectRatio: '16/9',
                      border: i === activeGallery
                        ? `1px solid ${mission.color}`
                        : '1px solid rgba(255,255,255,0.06)',
                      opacity: i === activeGallery ? 1 : 0.5,
                      boxShadow: i === activeGallery ? `0 0 12px ${mission.color}25` : 'none',
                    }}
                  >
                    <img src={item.image} alt={item.caption} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── MISSION NAVIGATION ── */}
          <motion.div
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#0A0A0A',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Previous */}
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {prevMission ? (
                  <Link
                    to={`/missions/${prevMission.slug}`}
                    className="flex items-center justify-between group transition-colors duration-200 hover:bg-white/[0.02]"
                    style={{ padding: 'clamp(16px, 3vw, 24px)' }}
                  >
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                      <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                      <div>
                        <div className="font-mono text-gray-600 uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>
                          Previous Mission
                        </div>
                        <div className="font-heading font-bold text-gray-400 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>
                          {prevMission.title}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-gray-700" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                      {prevMission.code}
                    </span>
                  </Link>
                ) : (
                  <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                    <Link
                      to="/missions"
                      className="flex items-center font-mono text-gray-600 hover:text-white transition-colors uppercase"
                      style={{ fontSize: '10px', letterSpacing: '0.2em', gap: '0.5rem' }}
                    >
                      <ArrowLeft className="w-3 h-3" /> All Missions
                    </Link>
                  </div>
                )}
              </div>

              {/* Next */}
              <div>
                {nextMission ? (
                  <Link
                    to={`/missions/${nextMission.slug}`}
                    className="flex items-center justify-between group transition-colors duration-200 hover:bg-white/[0.02]"
                    style={{ padding: 'clamp(16px, 3vw, 24px)' }}
                  >
                    <span className="font-mono text-gray-700" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                      {nextMission.code}
                    </span>
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                      <div className="text-right">
                        <div className="font-mono text-gray-600 uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>
                          Next Mission
                        </div>
                        <div className="font-heading font-bold text-gray-400 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>
                          {nextMission.title}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ) : (
                  <div className="text-right" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                    <Link
                      to="/missions"
                      className="inline-flex items-center font-mono text-gray-600 hover:text-white transition-colors uppercase"
                      style={{ fontSize: '10px', letterSpacing: '0.2em', gap: '0.5rem' }}
                    >
                      All Missions <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
