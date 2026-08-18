import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Power, Wifi, Home, User, Target, Crosshair, Cpu, Phone, Mail, Signal } from 'lucide-react';
import { usePrecisionMode } from '../../context/PrecisionModeContext';
import MmLogo from '../../assets/icons/MmLogo';

const IntelOverlay = lazy(() =>
  import('../overlays/IntelOverlay').then((module) => ({ default: module.IntelOverlay }))
);

const PENDING_SCROLL_KEY = 'mm-pending-scroll-id';

const navLinks = [
  { name: 'Identity', href: '/identity' },
  { name: 'Missions', href: '/missions' },
  { name: 'Arsenal', href: '/arsenal' },
  { name: 'AI Lab', href: '/ai-lab' },
];

const mobileNavItems = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'Identity', href: '/identity', Icon: User },
  { label: 'Missions', href: '/missions', Icon: Target },
  { label: 'Arsenal', href: '/arsenal', Icon: Crosshair },
  { label: 'AI Lab', href: '/ai-lab', Icon: Cpu },
  { label: 'Uplink', href: '/contact', Icon: Wifi },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { mode, toggleMode, setMode } = usePrecisionMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── ESC key dismisses INTEL mode ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'INTEL') setMode('STORY');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, setMode]);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      sessionStorage.setItem(PENDING_SCROLL_KEY, id);
      navigate('/');
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF2A2A] selection:text-white font-manrope overflow-x-hidden">
      {mode === 'INTEL' && (
        <Suspense fallback={null}>
          <IntelOverlay />
        </Suspense>
      )}

      {/* Navigation System */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#050505]/95 backdrop-blur-sm'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        {/* 1. Top Status Strip */}
        <div className="relative w-full h-[24px] bg-[#020202] border-b border-white/5 flex items-center justify-between px-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="font-mono text-gray-600 text-[9px] tracking-[0.15em] uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FF2A2A] animate-pulse" />
              Secure Uplink: Active
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-mono text-gray-600 text-[9px] tracking-[0.15em] uppercase">
              Clearance: Level 7
            </span>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="w-full border-b border-white/5">
          <div className="max-w-[1920px] mx-auto px-6 h-[70px] flex items-center justify-between">

            {/* Logo Section */}
            <button onClick={() => handleNavClick('hero')} className="flex items-center gap-4 group" aria-label="Go to homepage">
              <div className="relative" style={{ height: '40px', width: '67px' }}>
                <MmLogo />
              </div>
            </button>

            {/* Center Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-[48px]" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative group h-[70px] flex items-center justify-center"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`font-ui font-bold text-[12px] tracking-[2.4px] uppercase transition-colors duration-200 ease-out ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {link.name}
                    </span>
                    {/* Active/Hover Indicator Line (Laser Style) */}
                    <span className={`absolute bottom-[20px] left-0 right-0 h-[1.5px] bg-[#FF2A2A] shadow-[0_0_8px_#FF2A2A] transition-transform duration-200 origin-center ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">

              {/* Online Status Pill */}
              <div className="bg-[#0A0A0A] px-4 h-[32px] border border-white/5 flex items-center gap-3 relative overflow-hidden group hover:border-[#00D1FF]/30 transition-colors duration-300">
                <div className="w-1.5 h-1.5 bg-[#00D1FF] shadow-[0_0_8px_#00D1FF] shrink-0 animate-pulse" />
                <span className="font-mono text-gray-500 text-[10px] tracking-[0.1em] uppercase whitespace-nowrap group-hover:text-gray-300 transition-colors">
                  Online <span className="text-[#00D1FF] opacity-80 ml-1">{currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>

              {/* Story/Intel Toggle */}
              <button
                onClick={toggleMode}
                className={`h-[32px] px-3 border flex items-center gap-2 transition-all duration-200 group relative overflow-hidden ${mode === 'INTEL'
                    ? 'border-[#00D1FF]/50 bg-[#00D1FF]/10 hover:bg-[#00D1FF]/15 shadow-[0_0_12px_rgba(0,209,255,0.12)]'
                    : 'border-white/10 hover:bg-white/5 hover:border-[#00D1FF]/30'
                  }`}
                aria-label={mode === 'INTEL' ? 'Exit Intel Mode (ESC)' : 'Enter Intel Mode'}
                aria-pressed={mode === 'INTEL'}
                title={mode === 'INTEL' ? 'Exit Intel Mode (ESC)' : 'Enter Intel Mode'}
              >
                {/* Animated pulse when active */}
                {mode === 'INTEL' && (
                  <span className="absolute inset-0 animate-pulse" style={{ background: 'rgba(0,209,255,0.04)', pointerEvents: 'none' }} />
                )}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 relative z-10">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-500 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                  <circle cx="8" cy="8" r="2" fill="currentColor" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-500 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                  <line x1="8" y1="0" x2="8" y2="3" stroke="currentColor" strokeWidth="1" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-600 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                  <line x1="8" y1="13" x2="8" y2="16" stroke="currentColor" strokeWidth="1" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-600 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                  <line x1="0" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-600 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                  <line x1="13" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" className={mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-600 group-hover:text-[#00D1FF] transition-colors duration-200'} />
                </svg>
                <span className={`font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-200 relative z-10 ${mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-500 group-hover:text-white'
                  }`}>
                  {mode === 'INTEL' ? 'INTEL ON' : 'INTEL'}
                </span>
                {mode === 'INTEL' && (
                  <span className="relative z-10 w-1.5 h-1.5 bg-[#00D1FF] flex-shrink-0" style={{ boxShadow: '0 0 6px #00D1FF' }} />
                )}
              </button>

              {/* Uplink Button */}
              <Link
                to="/contact"
                className="h-[32px] px-5 border border-[#FF2A2A]/30 flex items-center gap-2 hover:bg-[#FF2A2A] hover:border-[#FF2A2A] transition-all duration-200 group relative overflow-hidden"
              >
                <span className="font-ui font-bold text-[#FF2A2A] text-[10px] tracking-[0.1em] uppercase relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                  UPLINK
                  <Wifi className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                className="text-white hover:text-[#FF2A2A] transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-0 overflow-x-hidden pt-[95px]">
        {/* Global Atmosphere z0 */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
          {/* Subtle Blue Rim Light for Intel Mode */}
          {mode === 'INTEL' && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,209,255,0.05)] pointer-events-none"
              />
              {/* Intel Mode Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,209,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />
            </>
          )}
        </div>

        {children}
      </main>

      {/* Footer System Status */}
      <footer className="bg-[#020202] border-t border-white/5 relative overflow-hidden">
        {mode === 'INTEL' && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        )}

        {/* Status Strip */}
        <div className="w-full h-8 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 text-[9px] font-mono tracking-widest text-gray-700 uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-gray-500">
              <Power className="w-3 h-3 text-[#FF2A2A]" />
              SYSTEM: ONLINE
            </span>
            <span className="hidden sm:inline-block border-l border-white/5 pl-4">LOC: 28.6139° N, 77.2090° E</span>
          </div>
          <div className="flex items-center gap-4">
            {mode === 'INTEL' && (
              <span className="text-[#00D1FF] animate-pulse">ENCRYPTION: AES-256</span>
            )}
            <span className="flex items-center gap-2 border-l border-white/5 pl-4">
              <Wifi className="w-3 h-3" />
              LINK: STABLE
            </span>
          </div>
        </div>

        {/* ── Secure Comms Channel ── */}
        <div className="border-b border-white/[0.04] bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
            {/* Section Label */}
            <div className="flex items-center mb-6 md:mb-8" style={{ gap: '0.75rem' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A2A]" style={{ boxShadow: '0 0 8px rgba(255,42,42,0.6)' }} />
              <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>
                DIRECT COMMS — ENCRYPTED CHANNELS
              </span>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="hidden sm:inline font-mono text-gray-800 uppercase" style={{ fontSize: '7px', letterSpacing: '0.3em' }}>
                E2E SECURED
              </span>
            </div>

            {/* Comms Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>

              {/* Voice Channel — Phone */}
              <a
                href="tel:+917985203818"
                className="group relative overflow-hidden transition-all duration-300 bg-[#0A0A0A] border border-white/[0.06] px-6 py-5 hover:border-[#FF2A2A]/30 hover:shadow-[0_0_30px_rgba(255,42,42,0.08),inset_0_0_30px_rgba(255,42,42,0.02)]"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#FF2A2A] opacity-60" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.4)' }} />
                <div className="absolute top-0 left-0 w-6 h-[2px] bg-[#FF2A2A] opacity-60" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.4)' }} />

                {/* Scan line on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-[-100%] w-full h-full group-hover:left-[100%] transition-all duration-700 ease-in-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,42,42,0.03), transparent)', width: '50%' }} />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col" style={{ gap: '8px' }}>
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Phone className="w-3.5 h-3.5 text-[#FF2A2A] group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                        VOICE UPLINK
                      </span>
                      <div className="hidden sm:flex items-center" style={{ gap: '4px', marginLeft: '4px' }}>
                        <div className="w-1 h-1 rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 4px rgba(34,197,94,0.6)' }} />
                        <span className="font-mono text-[#22c55e]/70" style={{ fontSize: '7px', letterSpacing: '0.15em' }}>ACTIVE</span>
                      </div>
                    </div>
                    <span className="font-mono text-white/90 group-hover:text-[#FF2A2A] transition-colors duration-200" style={{ fontSize: '15px', letterSpacing: '0.08em' }}>
                      +91-7985203818
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col items-end" style={{ gap: '4px' }}>
                    <Signal className="w-4 h-4 text-gray-700 group-hover:text-[#FF2A2A]/50 transition-colors duration-200" />
                    <span className="font-mono text-gray-800" style={{ fontSize: '7px', letterSpacing: '0.15em' }}>
                      FREQ: 7985.203
                    </span>
                  </div>
                </div>
              </a>

              {/* Data Channel — Email */}
              <a
                href="mailto:mr.mishra.ux@gmail.com"
                className="group relative overflow-hidden transition-all duration-300 bg-[#0A0A0A] border border-white/[0.06] px-6 py-5 hover:border-[#00D1FF]/30 hover:shadow-[0_0_30px_rgba(0,209,255,0.08),inset_0_0_30px_rgba(0,209,255,0.02)]"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#00D1FF] opacity-60" style={{ boxShadow: '0 0 6px rgba(0,209,255,0.4)' }} />
                <div className="absolute top-0 left-0 w-6 h-[2px] bg-[#00D1FF] opacity-60" style={{ boxShadow: '0 0 6px rgba(0,209,255,0.4)' }} />

                {/* Scan line on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-[-100%] w-full h-full group-hover:left-[100%] transition-all duration-700 ease-in-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(0,209,255,0.03), transparent)', width: '50%' }} />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col" style={{ gap: '8px' }}>
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Mail className="w-3.5 h-3.5 text-[#00D1FF] group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-mono text-gray-600 uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                        DATA CHANNEL
                      </span>
                      <div className="hidden sm:flex items-center" style={{ gap: '4px', marginLeft: '4px' }}>
                        <div className="w-1 h-1 rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 4px rgba(34,197,94,0.6)' }} />
                        <span className="font-mono text-[#22c55e]/70" style={{ fontSize: '7px', letterSpacing: '0.15em' }}>SECURE</span>
                      </div>
                    </div>
                    <span className="font-mono text-white/90 group-hover:text-[#00D1FF] transition-colors duration-200" style={{ fontSize: '15px', letterSpacing: '0.02em' }}>
                      mr.mishra.ux@gmail.com
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col items-end" style={{ gap: '4px' }}>
                    <Wifi className="w-4 h-4 text-gray-700 group-hover:text-[#00D1FF]/50 transition-colors duration-200" />
                    <span className="font-mono text-gray-800" style={{ fontSize: '7px', letterSpacing: '0.15em' }}>
                      PORT: 443/TLS
                    </span>
                  </div>
                </div>
              </a>

            </div>

            {/* Encryption footer line */}
            <div className="flex items-center justify-center mt-5" style={{ gap: '0.5rem' }}>
              <div className="h-px flex-1 max-w-[60px] bg-white/[0.04]" />
              <span className="font-mono text-gray-800" style={{ fontSize: '7px', letterSpacing: '0.3em' }}>
                ALL TRANSMISSIONS MONITORED // RESPONSE WITHIN 24H
              </span>
              <div className="h-px flex-1 max-w-[60px] bg-white/[0.04]" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 relative z-10">
          {/* Desktop footer — horizontal row */}
          <div className="hidden md:flex justify-between items-center gap-6">
            <div className="text-gray-500 text-sm font-mono flex items-center gap-3">
              <div className="relative" style={{ height: '24px', width: '40px' }}>
                <MmLogo />
              </div>
              <span className="text-gray-600">© 2026 Mithlesh Mishra.</span>
              <span className="w-1 h-1 bg-[#FF2A2A] animate-pulse" />
              <span className="text-gray-400">All Systems Operational.</span>
            </div>
            <div className="flex gap-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-600 hover:text-gray-300 transition-colors duration-200"><Github className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-600 hover:text-gray-300 transition-colors duration-200"><Linkedin className="w-5 h-5" /></a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors duration-200" aria-label="X (Twitter)">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Mobile footer — centered vertical stack */}
          <div className="flex md:hidden flex-col items-center gap-5">
            <div className="relative" style={{ height: '28px', width: '47px' }}>
              <MmLogo />
            </div>
            <div className="flex gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-500 hover:text-gray-300 transition-colors duration-200"><Github className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-gray-300 transition-colors duration-200"><Linkedin className="w-5 h-5" /></a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition-colors duration-200" aria-label="X (Twitter)">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FF2A2A] animate-pulse" />
              <span className="text-gray-400 text-xs font-mono">All Systems Operational.</span>
            </div>
            <span className="text-gray-600 text-xs font-mono">© 2026 Mithlesh Mishra.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Sheet — full navigation + contact */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 340 }}
              className="fixed left-0 right-0 z-50 md:hidden bg-[#080808] overflow-hidden"
              style={{ bottom: 0, borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Red scan accent at top */}
              <div className="absolute top-0 left-8 right-8 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,42,42,0.5) 50%, transparent)' }} />

              {/* Drag handle */}
              <div className="flex justify-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                <div className="w-10 h-1 bg-white/20" />
              </div>

              {/* Mini profile card */}
              <div className="flex items-center border-b border-white/[0.05]"
                style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 16, gap: 16 }}>
                <div className="flex-shrink-0 flex items-center justify-center overflow-hidden bg-[#0A0A0A] border border-white/[0.08]"
                  style={{ width: 44, height: 44, padding: 6 }}>
                  <div className="relative w-full h-full">
                    <MmLogo />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-white" style={{ fontSize: 14, letterSpacing: '0.04em' }}>
                    Mithlesh Mishra
                  </div>
                  <div className="font-mono text-gray-600 uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', marginTop: 2 }}>
                    Senior UX Designer · LVL 7
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center" style={{ gap: 6 }}>
                  <div className="rounded-full bg-[#00D1FF] animate-pulse" style={{ width: 6, height: 6, boxShadow: '0 0 6px #00D1FF' }} />
                  <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(0,209,255,0.7)' }}>
                    Online
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <div className="flex flex-col" style={{ padding: '12px 24px 0' }}>
                {mobileNavItems.map(({ label, href, Icon }) => {
                  const isActive = location.pathname === href;
                  return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/[0.04]' : ''}`}
                      style={{ gap: 14, padding: '13px 12px' }}
                    >
                      <Icon
                        className={isActive ? 'text-[#FF2A2A]' : 'text-gray-600'}
                        style={{ width: 18, height: 18 }}
                      />
                      <span className={`font-ui font-bold uppercase ${isActive ? 'text-white' : 'text-gray-400'}`}
                        style={{ fontSize: 12, letterSpacing: '0.16em' }}>
                        {label}
                      </span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF2A2A]"
                          style={{ boxShadow: '0 0 6px rgba(255,42,42,0.8)' }} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Intel Mode Toggle (Mobile) */}
              <div style={{ padding: '8px 24px 0' }}>
                <button
                  onClick={() => { toggleMode(); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 ${mode === 'INTEL'
                      ? 'bg-[#00D1FF]/[0.08] border border-[#00D1FF]/20'
                      : 'border border-white/[0.05]'
                    }`}
                  style={{ gap: 14, padding: '13px 12px' }}
                >
                  <div className={`flex items-center justify-center rounded-md ${mode === 'INTEL' ? 'bg-[#00D1FF]/20' : 'bg-white/[0.04]'
                    }`} style={{ width: 18, height: 18 }}>
                    <div className="rounded-full" style={{
                      width: 6, height: 6,
                      background: mode === 'INTEL' ? '#00D1FF' : 'rgba(255,255,255,0.3)',
                      boxShadow: mode === 'INTEL' ? '0 0 6px #00D1FF' : 'none',
                    }} />
                  </div>
                  <span className={`font-ui font-bold uppercase ${mode === 'INTEL' ? 'text-[#00D1FF]' : 'text-gray-400'
                    }`} style={{ fontSize: 12, letterSpacing: '0.16em' }}>
                    {mode === 'INTEL' ? 'Intel Active' : 'Intel Mode'}
                  </span>
                  {mode === 'INTEL' && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D1FF]"
                      style={{ boxShadow: '0 0 6px rgba(0,209,255,0.8)' }} />
                  )}
                </button>
              </div>

              {/* Social + timestamp */}
              <div className="flex items-center justify-between border-t border-white/[0.05]" style={{ padding: '16px 24px', marginTop: 8 }}>
                <div className="flex" style={{ gap: 20 }}>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-600 hover:text-gray-300 transition-colors duration-200"><Github className="w-5 h-5" /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-600 hover:text-gray-300 transition-colors duration-200"><Linkedin className="w-5 h-5" /></a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors duration-200" aria-label="X (Twitter)">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                </div>
                <span className="font-mono text-gray-700" style={{ fontSize: 9, letterSpacing: '0.12em' }}>
                  {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
