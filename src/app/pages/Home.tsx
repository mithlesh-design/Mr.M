import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import { Timeline } from '../components/layout/Timeline';
import { useSound } from '../audio/AudioSystem';
import { SECTION_IDS } from '../constants';

const ImpactMetrics = lazy(() => import('../components/sections/ImpactMetrics'));
const IdentitySection = lazy(() => import('../components/sections/IdentitySection'));
const FeaturedMissions = lazy(() => import('../components/sections/FeaturedMissions'));
const ArsenalSection = lazy(() => import('../components/sections/ArsenalSection'));
const ToolsSequence = lazy(() => import('../components/sections/ToolsSequence'));
const AILabSection = lazy(() => import('../components/sections/AILabSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

const sectionIds = SECTION_IDS;
const PENDING_SCROLL_KEY = 'mm-pending-scroll-id';

/** Thin "classified brief" page-turn marker between sections */
function SectionDivider({
  code, label, page, total,
}: { code: string; label: string; page: number; total: number }) {
  return (
    <motion.div
      className="relative overflow-hidden bg-[#050505]"
      style={{ padding: '0 16px', height: '28px', borderTop: '1px solid rgba(255,255,255,0.035)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="max-w-7xl mx-auto h-full flex items-center"
        style={{ gap: '0.5rem' }}
      >
        {/* Page counter */}
        <span
          className="font-mono text-gray-700 flex-shrink-0"
          style={{ fontSize: '8px', letterSpacing: '0.22em' }}
        >
          {String(page).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </span>

        {/* Left line */}
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.025)', minWidth: '8px' }} />

        {/* Section code + label */}
        <span
          className="font-mono text-gray-700 flex-shrink-0"
          style={{ fontSize: '8px', letterSpacing: '0.25em' }}
        >
          // {code} <span className="hidden sm:inline">· {label}</span>
        </span>

        {/* Right line */}
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.025)', minWidth: '8px' }} />

        {/* Redacted stamp — hidden on small mobile to prevent overflow */}
        <span
          className="hidden sm:inline font-mono text-gray-800 flex-shrink-0"
          style={{ fontSize: '7px', letterSpacing: '0.3em' }}
        >
          [CLASSIFIED]
        </span>
      </div>

      {/* Scanning beam — very subtle */}
      <motion.div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: '60px',
          background: 'linear-gradient(to right, transparent, rgba(255,42,42,0.04), transparent)',
        }}
        animate={{ left: ['-10%', '110%'] }}
        transition={{ duration: 12, ease: 'linear', repeat: Infinity, delay: page * 1.2 }}
      />
    </motion.div>
  );
}

function SectionFallback() {
  return (
    <div className="bg-[#050505]" style={{ minHeight: '32vh' }} />
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const { play, muted } = useSound();
  const prevSectionRef = useRef('hero');
  const enteredSections = useRef<Set<string>>(new Set(['hero']));

  useEffect(() => {
    const handleScroll = () => {
      let current = 'hero';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = id;
          }
        }
      }
      setActiveSection(current);

      // Play sectionEnter sound when entering a new section for the first time
      if (current !== prevSectionRef.current) {
        if (!enteredSections.current.has(current)) {
          enteredSections.current.add(current);
          play('sectionEnter');
        }
        prevSectionRef.current = current;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [play]);

  useEffect(() => {
    const pendingId = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (!pendingId) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      if (cancelled) return;
      const element = document.getElementById(pendingId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        sessionStorage.removeItem(PENDING_SCROLL_KEY);
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) requestAnimationFrame(tryScroll);
    };

    requestAnimationFrame(tryScroll);
    return () => {
      cancelled = true;
    };
  }, [location.key]);

  return (
    <div className="bg-[#050505] min-h-screen relative">
      <Timeline activeSection={activeSection} />

      {/* ── 01 HERO ── */}
      <div id="hero">
        <Hero />
      </div>

      <SectionDivider code="INTEL" label="IMPACT METRICS" page={2} total={8} />

      {/* ── 02 IMPACT ── */}
      <div id="impact">
        <Suspense fallback={<SectionFallback />}>
          <ImpactMetrics />
        </Suspense>
      </div>

      <SectionDivider code="DOSSIER" label="OPERATIVE IDENTITY" page={3} total={8} />

      {/* ── 03 IDENTITY ── */}
      <div id="identity">
        <Suspense fallback={<SectionFallback />}>
          <IdentitySection />
        </Suspense>
      </div>

      <SectionDivider code="ARCHIVE" label="MISSION FILES" page={4} total={8} />

      {/* ── 04 MISSIONS ── */}
      <div id="missions">
        <Suspense fallback={<SectionFallback />}>
          <FeaturedMissions />
        </Suspense>
      </div>

      <SectionDivider code="OPS" label="CAPABILITY ARSENAL" page={5} total={8} />

      {/* ── 05 ARSENAL ── */}
      <div id="arsenal">
        <Suspense fallback={<SectionFallback />}>
          <ArsenalSection />
        </Suspense>
      </div>

      <SectionDivider code="CALIBRATION" label="TACTICAL LOADOUT" page={6} total={8} />

      {/* ── 06 TOOLS ── */}
      <div id="tools">
        <Suspense fallback={<SectionFallback />}>
          <ToolsSequence />
        </Suspense>
      </div>

      <SectionDivider code="NEURAL" label="AI LAB" page={7} total={8} />

      {/* ── 07 AI LAB ── */}
      <div id="ailab">
        <Suspense fallback={<SectionFallback />}>
          <AILabSection />
        </Suspense>
      </div>

      <SectionDivider code="COMMS" label="SECURE UPLINK" page={8} total={8} />

      {/* ── 08 CONTACT ── */}
      <div id="contact">
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </div>
    </div>
  );
}
