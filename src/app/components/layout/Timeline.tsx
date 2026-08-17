import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineProps {
  activeSection: string;
}

const chapters = [
  { id: 'hero',     label: 'OPERATIVE', code: '01' },
  { id: 'impact',   label: 'METRICS',   code: '02' },
  { id: 'identity', label: 'IDENTITY',  code: '03' },
  { id: 'missions', label: 'ARCHIVES',  code: '04' },
  { id: 'arsenal',  label: 'ARSENAL',   code: '05' },
  { id: 'tools',    label: 'LOADOUT',   code: '06' },
  { id: 'ailab',    label: 'NEURAL',    code: '07' },
  { id: 'contact',  label: 'UPLINK',    code: '08' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function ScrambleText({ text, run }: { text: string; run: boolean }) {
  const [display, setDisplay] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!run) { setDisplay(''); return; }

    let frame = 0;
    const maxFrames = 5;

    const tick = () => {
      const locked = Math.floor((frame / maxFrames) * text.length);
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < locked) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      frame++;
      if (frame <= maxFrames) {
        timerRef.current = setTimeout(tick, 22);
      } else {
        setDisplay(text);
      }
    };

    tick();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [run, text]);

  return <>{display || text}</>;
}

export function Timeline({ activeSection }: TimelineProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const currentIndex = chapters.findIndex(c => c.id === activeSection);
  const progressPct = currentIndex !== -1 ? (currentIndex / (chapters.length - 1)) * 100 : 0;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      className="fixed left-6 top-1/2 z-40 hidden xl:flex flex-col items-center"
      style={{ transform: 'translateY(-50%)', gap: 0 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
      aria-label="Page section navigation"
    >
      {/* Top label */}
      <span
        className="font-mono text-gray-700 mb-3"
        style={{ fontSize: '7px', letterSpacing: '0.22em', writingMode: 'horizontal-tb' }}
      >
        MM
      </span>

      {/* ── VERTICAL TRACK ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: '1px', height: '380px', background: 'rgba(255,255,255,0.06)' }}
      >
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{ background: 'linear-gradient(to bottom, #FF2A2A, rgba(255,42,42,0.2))' }}
          animate={{ height: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* ── SECTION MARKERS ── */}
        {chapters.map((chapter, index) => {
          const isActive = activeSection === chapter.id;
          const isPast = currentIndex > index;
          const positionPct = (index / (chapters.length - 1)) * 100;
          const isHovered = hovered === chapter.id;
          const showLabel = isActive || isHovered;

          return (
            <button
              key={chapter.id}
              type="button"
              className="absolute flex items-center cursor-pointer"
              style={{
                top: `${positionPct}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                background: 'transparent',
                border: 0,
                padding: 0,
                height: '16px',
              }}
              onClick={() => scrollTo(chapter.id)}
              onMouseEnter={() => setHovered(chapter.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(chapter.id)}
              onBlur={() => setHovered(null)}
              aria-label={`Navigate to ${chapter.label}`}
            >
              {/* Dot marker */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: '16px', height: '16px' }}
              >
                <motion.div
                  animate={{
                    width:  isActive ? 7 : 4,
                    height: isActive ? 7 : 4,
                    background: isActive
                      ? '#FF2A2A'
                      : isPast
                        ? 'rgba(255,42,42,0.4)'
                        : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive ? '0 0 8px rgba(255,42,42,0.8)' : 'none',
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ borderRadius: isActive ? '50%' : '1px', position: 'relative' }}
                >
                  {isActive && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: '-1px',
                        borderRadius: '50%',
                        background: '#FF2A2A',
                      }}
                      animate={{ scale: [1, 3.2], opacity: [0.35, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Label popup */}
              <AnimatePresence>
                {showLabel && (
                  <motion.div
                    className="flex items-center"
                    style={{ marginLeft: '10px', gap: '5px', pointerEvents: 'none', height: '16px' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    {/* Tick mark */}
                    <span
                      style={{
                        width: '12px',
                        height: '1px',
                        background: isActive ? 'rgba(255,42,42,0.6)' : 'rgba(255,255,255,0.1)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />

                    {/* Code */}
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '8px',
                        letterSpacing: '0.12em',
                        color: isActive ? '#FF2A2A' : 'rgba(255,42,42,0.45)',
                        lineHeight: 1,
                      }}
                    >
                      {chapter.code}
                    </span>

                    {/* Label */}
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '8px',
                        letterSpacing: '0.2em',
                        color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      <ScrambleText text={chapter.label} run={showLabel} />
                    </span>

                    {isActive && (
                      <motion.span
                        style={{
                          width: '3px',
                          height: '3px',
                          borderRadius: '50%',
                          background: '#FF2A2A',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Progress counter */}
      <div
        className="font-mono text-gray-700 mt-3 text-center"
        style={{ fontSize: '7px', letterSpacing: '0.18em' }}
      >
        {String(currentIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(chapters.length).padStart(2, '0')}
      </div>
    </motion.div>
  );
}
