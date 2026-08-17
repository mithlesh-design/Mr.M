import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';

export type PrecisionMode = 'STORY' | 'INTEL';

interface PrecisionModeContextType {
  mode: PrecisionMode;
  /** True for ~350ms after a toggle, useful for transition animations */
  isTransitioning: boolean;
  toggleMode: () => void;
  setMode: (mode: PrecisionMode) => void;
}

const PrecisionModeContext = createContext<PrecisionModeContextType | undefined>(undefined);

export function PrecisionModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeRaw] = useState<PrecisionMode>('STORY');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();

  const setMode = useCallback((next: PrecisionMode) => {
    if (next === mode) return;
    setIsTransitioning(true);
    setModeRaw(next);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setIsTransitioning(false), 350);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(mode === 'STORY' ? 'INTEL' : 'STORY');
  }, [mode, setMode]);

  useEffect(() => {
    return () => clearTimeout(transitionTimer.current);
  }, []);

  return (
    <PrecisionModeContext.Provider value={{ mode, isTransitioning, toggleMode, setMode }}>
      {children}
    </PrecisionModeContext.Provider>
  );
}

export function usePrecisionMode() {
  const context = useContext(PrecisionModeContext);
  if (context === undefined) {
    throw new Error('usePrecisionMode must be used within PrecisionModeProvider');
  }
  return context;
}
