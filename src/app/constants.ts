/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SHARED CONSTANTS — Mr. M Design System
 *  Single source of truth for values used across multiple components.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ── Easing ─────────────────────────────────────────────────────────────── */
/** Cinematic ease-out used by Hero, ImpactMetrics, Layout, BootIntro */
export const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Color Palette ──────────────────────────────────────────────────────── */
export const COLORS = {
    /** Near-black background */
    bg: '#050505',
    bgAlt: '#0A0A0A',
    /** Tactical red — primary accent, CTAs */
    primary: '#FF2A2A',
    primaryGlow: 'rgba(255,42,42,0.5)',
    /** Cyan — data/intel highlights */
    secondary: '#00D1FF',
    secondaryGlow: 'rgba(0,209,255,0.5)',
    /** Gold — premium/awards */
    accent: '#C9A86A',
    accentGlow: 'rgba(201,168,106,0.5)',
    /** Text */
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
} as const;

/* ── Section IDs (for scroll and Timeline) ──────────────────────────────── */
export const SECTION_IDS = [
    'hero', 'impact', 'identity', 'missions',
    'arsenal', 'tools', 'ailab', 'contact',
] as const;

export type SectionId = typeof SECTION_IDS[number];

/* ── Shared Transition Presets ──────────────────────────────────────────── */
export const TRANSITION = {
    /** Standard UI feedback (hover, focus) */
    fast: 'all 0.22s ease-out',
    /** Card lifts, panel fades */
    medium: 'all 0.35s ease-out',
} as const;
