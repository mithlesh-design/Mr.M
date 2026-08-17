import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import BootIntro from './components/sections/BootIntro';
import { AnimatePresence } from 'motion/react';
import { PrecisionModeProvider } from './context/PrecisionModeContext';
import { SoundProvider } from './audio/AudioSystem';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

/* ── Lazy-loaded pages (code-split on navigation) ─────────────────────── */
const Layout = lazy(() => import('./components/layout/Layout').then((module) => ({ default: module.Layout })));
const Home = lazy(() => import('./pages/Home'));
const Identity = lazy(() => import('./pages/Identity'));
const Missions = lazy(() => import('./pages/Missions'));
const MissionDetail = lazy(() => import('./pages/MissionDetail'));
const Arsenal = lazy(() => import('./pages/Arsenal'));
const AILab = lazy(() => import('./pages/AILab'));
const Contact = lazy(() => import('./pages/Contact'));

/* ── Minimal loading spinner matching the app theme ───────────────────── */
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#050505]"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center" style={{ gap: '1rem' }}>
        <div
          className="w-5 h-5 border border-[#FF2A2A]/50 animate-spin"
          style={{ borderTopColor: '#FF2A2A' }}
        />
        <span
          className="font-mono text-gray-600 uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.25em' }}
        >
          LOADING...
        </span>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [bootComplete, setBootComplete] = useState(false);

  const handleBootComplete = () => {
    setBootComplete(true);
  };

  useEffect(() => {
    document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist';
  }, []);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootIntro key="boot" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {bootComplete && (
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/identity" element={<Identity />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/missions/:slug" element={<MissionDetail />} />
                <Route path="/arsenal" element={<Arsenal />} />
                <Route path="/ai-lab" element={<AILab />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <PrecisionModeProvider>
        <SoundProvider>
          <AppContent />
        </SoundProvider>
      </PrecisionModeProvider>
    </HashRouter>
  );
}
