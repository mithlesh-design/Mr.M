import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSound } from '../../audio/AudioSystem';
import { featuredMissions } from '../../data/missionSummaries';

export default function FeaturedMissions() {
  const { play } = useSound();
  const [emblaRef, emblaApi]   = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex]       = useState(0);
  const [stampVisible, setStampVisible] = useState(false);
  const stampTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((api: EmblaCarouselType) => {
    setScrollProgress(Math.max(0, Math.min(1, api.scrollProgress())));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll(emblaApi);
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());

    emblaApi.on('reInit', onScroll);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onScroll);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onScroll]);

  useEffect(() => {
    return () => {
      if (stampTimerRef.current) {
        clearTimeout(stampTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      className="bg-[#050505] relative overflow-hidden py-12 md:py-20 lg:py-24"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 w-full">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16" style={{ gap: '1.5rem' }}>
          <div>
            <motion.div
              className="flex items-center mb-4"
              style={{ gap: '0.75rem' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onViewportEnter={() => {
                if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
                setStampVisible(true);
                stampTimerRef.current = setTimeout(() => {
                  stampTimerRef.current = null;
                  setStampVisible(false);
                }, 1800);
              }}
            >
              <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
              <span className="font-mono text-[#FF2A2A] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                Archives // Top Secret
              </span>
            </motion.div>
            <div className="relative inline-block">
              <motion.h2
                className="font-heading font-bold text-white leading-none"
                style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '0.09em' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                viewport={{ once: true }}
              >
                MISSION{' '}
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)', color: 'transparent' }}>
                  FILES
                </span>
              </motion.h2>

              {/* "TOP SECRET" stamp */}
              <AnimatePresence>
                {stampVisible && (
                  <motion.div
                    className="absolute pointer-events-none select-none hidden sm:block"
                    style={{
                      top: '50%',
                      left: '110%',
                      transform: 'translateY(-50%) rotate(-12deg)',
                      transformOrigin: 'left center',
                      border: '2px solid rgba(255,42,42,0.7)',
                      padding: '3px 10px',
                    }}
                    initial={{ opacity: 0, x: -20, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <span
                      className="font-mono font-bold uppercase"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.25em',
                        color: 'rgba(255,42,42,0.75)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      TOP SECRET
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Scroll tracker */}
          <motion.div
            className="hidden md:flex flex-col items-end"
            style={{ gap: '0.5rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              {featuredMissions.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ height: '3px', transition: 'all 0.3s ease' }}
                  animate={{
                    width: i === activeIndex ? '24px' : '6px',
                    background: i === activeIndex ? '#FF2A2A' : 'rgba(255,255,255,0.15)',
                    boxShadow: i === activeIndex ? '0 0 8px rgba(255,42,42,0.5)' : 'none',
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(featuredMissions.length).padStart(2, '0')}
            </span>
          </motion.div>
        </div>

        {/* ── CAROUSEL ── */}
        <div
          className="overflow-visible cursor-grab active:cursor-grabbing"
          style={{ margin: '0 -1.5rem' }}
          ref={emblaRef}
        >
          <div className="flex" style={{ gap: '1.5rem', padding: '1rem 1.5rem 2rem' }}>
            {featuredMissions.map((mission, index) => (
              <div
                key={index}
                className="flex-none"
                style={{ flex: '0 0 82%', maxWidth: '380px', minWidth: '280px' }}
              >
                <motion.div
                  className="group"
                  style={{ height: 'clamp(400px, 65vh, 500px)' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
                  viewport={{ once: true }}
                >
                  <Link to={`/missions/${mission.slug}`} className="block h-full">
                    <MissionCard mission={mission} />
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* View All link */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            to="/missions"
            className="flex items-center font-mono text-gray-500 hover:text-white transition-colors uppercase group"
            style={{ fontSize: '11px', letterSpacing: '0.2em', gap: '0.5rem' }}
          >
            View All Missions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

/* ─── Individual Mission Card ─── */
function MissionCard({ mission }: { mission: typeof featuredMissions[0] }) {
  const [hovered, setHovered] = useState(false);
  const { play } = useSound();

  return (
    <div
      className="relative h-full overflow-hidden flex flex-col"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0px)',
        borderColor: hovered ? `${mission.color}35` : 'rgba(255,255,255,0.06)',
        boxShadow: hovered ? `0 20px 60px -10px rgba(0,0,0,0.6), 0 0 30px ${mission.color}10` : 'none',
      }}
      onMouseEnter={() => { setHovered(true); play('hover'); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Code tab */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{
          height: '36px',
          background: '#111',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: hovered ? mission.color : 'rgba(255,255,255,0.25)',
            transition: 'color 0.25s ease',
          }}
        >
          {mission.code}
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}
        >
          {mission.year}
        </span>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '55%' }}>
        <img
          src={mission.image}
          alt={mission.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          style={{
            filter: hovered ? 'grayscale(0%) brightness(0.9)' : 'grayscale(85%) brightness(0.7)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'filter 0.5s ease, transform 0.55s ease',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${mission.color}22, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1" style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <div>
          <div
            className="font-mono uppercase mb-2"
            style={{ fontSize: '9px', letterSpacing: '0.2em', color: mission.color, opacity: 0.8 }}
          >
            // {mission.category}
          </div>
          <h3
            className="font-heading font-bold"
            style={{
              fontSize: '22px',
              letterSpacing: '0.08em',
              color: hovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
              transition: 'color 0.25s ease',
            }}
          >
            {mission.title}
          </h3>
        </div>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px', letterSpacing: '0.15em',
              color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
              transition: 'color 0.25s ease',
            }}
          >
            VIEW CASE FILE
          </span>
          <div
            className="flex items-center font-mono font-bold"
            style={{
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: mission.color,
              gap: '0.4rem',
              opacity: hovered ? 1 : 0.5,
              transition: 'opacity 0.25s ease',
            }}
          >
            {mission.metric}{mission.metricLabel && ` ${mission.metricLabel.split(' ')[0]}`}
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
