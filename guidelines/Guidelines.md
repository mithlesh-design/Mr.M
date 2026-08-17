# Mithlesh Portfolio — Figma Make Guidelines (AI + John Wick + Premium)

## 0) Non-negotiables (must follow)

* Build an award-level, cinematic, tactical-luxury portfolio experience.
* Avoid generic “template portfolio” layouts, gradients, and stock UI patterns.
* Design must feel like a “classified AI system” (minimal, precise, premium).
* 80% minimal + 15% cinematic + 5% experimental (controlled, not gimmicky).
* Everything must be responsive and implementable (realistic frontend).

## 1) Visual Style (John Wick x AI)

* Base background: near-black (#050505) with subtle charcoal gradients (#0B0B0B → #111111).
* Accents (use sparingly):

  * Action/Primary: Neon Red #FF2A2A
  * Intelligence/Secondary: Electric Blue #00D1FF
  * Premium hint (very subtle): Warm Gold #C9A86A
* Use soft bloom / glow only on accents (do not glow everything).
* Use subtle grain texture + low-contrast particles; keep them minimal.

## 2) Typography

* Body font: Manrope (or Inter if Manrope not available).
* Headings: a bold condensed/futuristic style (keep readable).
* Clear hierarchy:

  * H1 72–88px (tight line height)
  * H2 48–56px
  * H3 28–32px
  * Body 16–18px
* Hero headings: slight letter spacing (0.5–1.5px). No excessive tracking.

## 3) Layout System

* Desktop frame: 1440px width, 12-column grid.
* Spacing: 8pt system (8/16/24/32/48/64/96/120/160).
* Section vertical spacing: 120–160px.
* Prefer Auto-Layout, Flex, and Grid; use absolute positioning only when necessary.

## 4) Component Styling Rules

* Card radius: 16px (large, premium).
* Button radius: 12px.
* Card borders: 1px rgba(255,255,255,0.08) (very subtle).
* Glass panels allowed only in AI Lab / overlays:

  * background rgba(255,255,255,0.03–0.06)
  * blur small (8–16px), not heavy
* Shadows: minimal; rely on contrast + glow edges instead.

## 5) Motion & Interaction Principles (Cinematic)

* No bouncy animations. No playful easing.
* Use smooth cinematic easing (ease-out, soft).
* Only 3–4 WOW moments max across the site:

  1. Intro “boot” scene
  2. Mission (case study) open transition
  3. AI Lab reveal
  4. Optional: Precision Mode toggle effect
* Microinteractions:

  * Hover: subtle lift (2–4px) + edge glow
  * Buttons: glow expands slightly on hover
  * Cards: border glow + slight scale (1.02–1.03)

## 6) IA / Pages (must include)

Top nav:

* Home
* Identity (About)
* Missions (Projects)
* Arsenal (Skills)
* AI Lab
* Insights (optional)
* Contact

Home sections:

1. Boot/Intro (short)
2. Hero (headline, subtext, CTAs, abstract AI object)
3. Impact metrics (4 items)
4. Featured missions (3 cards)
5. Arsenal preview (skills pillars)
6. AI Lab teaser
7. Contact CTA

Projects (Missions):

* Grid with filters (AI / SaaS / Healthcare / Enterprise)
* Case study template: Problem → Strategy → Process → Solution → Impact → Gallery

## 7) Content Tone

* Confident, precise, elite, outcome-driven.
* Avoid fluff. Use measurable impact where possible.

## 8) Accessibility & Performance

* Maintain strong contrast.
* Provide reduced motion option (or keep motion subtle by default).
* Keep visuals optimized; avoid heavy effects everywhere.
