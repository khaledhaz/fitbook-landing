# FitBook Landing Page — Premium Rebuild Plan

> Research complete. 20+ searches across Lusion.co, Linear.app, Stripe, Vercel, Awwwards, Codrops, and multiple technical resources.

---

## 1. Visual Inventory — Every Effect & How It's Built

| # | Effect | Implementation |
|---|--------|---------------|
| 1 | **Noise grain texture** | SVG `<feTurbulence>` filter inlined as `body::before` at 2% opacity, `position:fixed`, `pointer-events:none`, `z-index:9999` |
| 2 | **Gradient mesh orbs** | 4-5 absolutely positioned divs, each 500-900px, `border-radius:50%`, `filter:blur(80-120px)`, radial-gradient fills at 3-6% opacity. Mouse-tracked via RAF lerp (factor 0.02-0.03) |
| 3 | **Dot grid pattern** | CSS `background-image` with two `linear-gradient` lines at ~3% white opacity, 72px grid, masked with `radial-gradient` via `-webkit-mask-image` to fade at edges |
| 4 | **Particle system** | HTML5 `<canvas>` with 80-120 particles (desktop) / 40 (mobile). Each particle: random position, velocity (0.05-0.2px/frame), size (1-3px), opacity (0.1-0.5). Connection lines between particles within 120px distance. Edge fade at 20px boundary. Mouse attraction with magnetism factor. **Spatial grid** for O(n) neighbor lookup. `IntersectionObserver` to pause when offscreen |
| 5 | **Scroll parallax** | Single RAF loop reads `window.scrollY`, applies `transform: translateY(scrollY * speed)` to elements with `data-speed` attribute. Speeds range -0.3 to 0.3. Hero text at 0.2 (moves up slower), hero phone at -0.1 (moves down slower) |
| 6 | **3D card tilt** | `mousemove` on card calculates `x = (mouseX - centerX) / width - 0.5`, same for Y. Apply `transform: perspective(800px) rotateX(y * -intensity) rotateY(x * intensity)`. Intensity per element type: cards=8°, panels=5°, scenes=12°. `preserve-3d` on parent, inner elements at different `translateZ` depths for parallax-within-tilt |
| 7 | **Cursor-tracking spotlight** | Per-card div (`.fc-shine`) positioned absolute, 300px circle, `radial-gradient(rgba(gold, .08), transparent 60%)`, `filter:blur(40px)`. JS moves it to `e.clientX - rect.left`, `e.clientY - rect.top` on mousemove. Opacity 0→1 on hover |
| 8 | **Magnetic buttons** | On `mousemove` within button, calculate distance from center, translate button by `distance * 0.2` toward cursor. On `mouseleave`, spring back with `transition: transform 0.5s ease`. Scale to 1.05 on proximity |
| 9 | **Custom cursor** | Two elements: outer ring (20px, border only) + inner dot (6px, solid gold). Both `position:fixed`, `pointer-events:none`. Outer follows with 0.15 lerp factor, inner follows at 0.3 (snappier). Scale up on hover over interactive elements. Hide on mobile |
| 10 | **Text split reveal** | JS splits headline text into `<span>` per character. Each span gets `opacity:0; transform:translateY(40px) rotateX(15deg)`. On IntersectionObserver trigger, each span animates to `opacity:1; transform:none` with `transition-delay: index * 30ms`. Total stagger over ~0.8s for a full line |
| 11 | **Scroll progress bar** | Fixed div at top, `height:3px`, gold gradient background, `width:0%`. JS calculates `scrollY / (docHeight - windowHeight) * 100` in RAF loop, applies as `scaleX()` transform (GPU-friendly vs width) |
| 12 | **Counter animation** | IntersectionObserver with 0.5 threshold. On trigger, RAF loop with easeOutQuart easing: `1 - (1-t)^4`. Duration 2.2s. Formats with `.toLocaleString()` for comma separators |
| 13 | **Staggered reveal** | All `.an` elements observed. On intersection, add `.v` class. CSS handles the animation: `opacity:0 → 1`, `translateY(50px) → 0`, `rotateX(6deg) → 0`. `data-d` attribute sets `transition-delay` in 100ms increments (0-600ms) |
| 14 | **Section divider glows** | `::after` pseudo on each section: 1px height, horizontal gradient `transparent → gold(6%) → gold(10%) → gold(6%) → transparent`. Pulsing `opacity` via `@keyframes` over 4s |
| 15 | **Phone mockup 3D** | Main phone: continuous RAF-driven rotation tracking mouse (±10° Y, ±6° X) with 0.04 lerp. Float animation: 7s `@keyframes` with translateY and rotateZ micro-wobble. Side phones: `perspective(1200px) rotateY(±22deg) translateZ(-100px)`, brightness filter for atmospheric perspective |
| 16 | **Animated gradient border** | `conic-gradient(from 0deg, gold, transparent 30%, transparent 70%, gold(40%))` on `::before` pseudo, `animation: rotate 5s linear infinite`. Creates spinning light edge |
| 17 | **Shimmer sweep** | Card `::after` with diagonal `linear-gradient(60deg, transparent 35%, white(4%) 50%, transparent 65%)`. Transform from `translateX(-100%)` to `translateX(80%)` on hover with 1s transition |
| 18 | **Horizontal showcase auto-scroll** | `overflow-x:auto` container with `scroll-snap-type:x mandatory`. JS RAF auto-scrolls at 0.5px/frame. Pauses on hover/touch. Phones alternate `rotateY(±3deg)` for depth |
| 19 | **Glassmorphism testimonials** | `backdrop-filter:blur(16px)`, `background:rgba(255,255,255,0.02)`, `border:1px solid rgba(255,255,255,0.10)`. Top edge highlight via `::before` gradient. 3D tilt on hover |
| 20 | **Floating geometric shapes** | 6-8 small decorative elements (rings, diamonds, dots) at very low opacity. CSS `@keyframes` with randomized durations (12-35s). `data-speed` attribute for scroll parallax at different rates |

---

## 2. Section-by-Section Blueprint

### Section 0: Navigation
- Fixed header, transparent initially, gains `backdrop-filter:blur(28px)` + dark bg at 85% opacity + bottom border after 40px scroll
- Logo: gold icon that rotates slowly (30s CSS animation), pauses on hover
- Links: animated underline on hover (width 0→100%, gold, 0.35s ease)
- CTA: pill-shaped, gold bg, magnetic hover effect, ring expand + shadow bloom
- Mobile: burger icon with X animation, slide-down menu with blur bg
- **Scroll progress bar**: 3px fixed at top of viewport, gold gradient, scaleX driven by scroll %

### Section 1: Hero (100vh+)
**What the user sees:** Full viewport. Headline text reveals character by character from the left. Below it, subtitle fades in, then CTAs slide up. To the right (or below on mobile), a cluster of 3 phone mockups showing the FitBook app — center phone dominant, two flanking at angles with depth blur. Behind everything, slow-drifting gradient orbs, a particle field on canvas, and a dot grid pattern.

**Scroll behavior:**
- Hero text parallaxes up at 0.2x speed and fades to 0 over 600px
- Phone cluster parallaxes down at -0.1x, creating divergence
- Dot grid moves at 0.15x
- Particles drift independently (velocity-based, not scroll-linked)
- Orbs track mouse position with heavy lerp smoothing

**Hover/interaction:**
- Phone main frame tracks mouse (±10° tilt)
- Side phones spread apart when cluster is hovered
- CTAs have magnetic pull + scale effect
- Custom cursor visible (gold dot + outer ring)

**Stats strip at bottom:** Counter numbers animate when scrolled into view. Gold text-shadow glow pulses on hover.

### Section 2: Features (6 cards with mini-app mockups)
**What the user sees:** Section heading with gold "tag" label, large title, subtitle. Below: 3×2 grid of cards, each containing a mini-app mockup (workout log, meal planner, chat, progress chart, AI generator, offline status) built with HTML/CSS above the card's title and description.

**Scroll behavior:**
- Section header fades up on intersection
- Cards stagger in: first row 0-200ms, second row 300-500ms
- Cards scale from 0.95→1.0 as they enter viewport center (scroll-driven scale)
- Background orb drifts on the right side

**Hover/interaction:**
- Each card tilts 3D on mouse position (±8°, preserve-3d)
- Inner visual/title/body sit at different translateZ depths (24px/14px/8px) — parallax within the tilt
- Cursor-tracking gold spotlight follows mouse inside each card
- Shimmer sweep on the mini-app mockup
- Border shifts to gold 18%, card lifts 8px, deep shadow appears
- Top edge light highlight fades out, replaced by glow overlay

### Section 3: How It Works (4 steps with visual scenes)
**What the user sees:** Heading with gold emphasis. 4 cards in a row, each with a visual scene (mini phone showing role selection, connection diagram, progress chart, trophy) above numbered step with title and description.

**Scroll behavior:**
- Steps stagger in with 3D entrance (rotateX reducing from 6° to 0°)
- Visual scenes parallax slightly relative to text

**Hover/interaction:**
- Scene boxes tilt dramatically (±14°) with inner elements at different Z depths
- Trophy emoji scales 1.2x and lifts to translateZ(24px)
- Step number glows brighter

### Section 4: App Showcase (horizontal scroll strip)
**What the user sees:** Section heading, then a full-width horizontal scroll area with 6 phone mockups (Home, Schedule, Workout, Meals, Progress, Chat) each with recognizable UI inside. Phones alternate slight rotateY for visual rhythm. Captions below each.

**Scroll behavior:**
- Auto-scrolls at 0.5px/frame via RAF
- Pauses on hover or touch
- Phones scale up slightly as they pass through the viewport center

**Hover/interaction:**
- Hovered phone lifts 16px, rotates forward 5°, scales 1.05, gains deep shadow
- 3D tilt tracks mouse position

### Section 5: For Trainers (split layout)
**What the user sees:** Left: tag, heading with gold italic emphasis, description, checklist with gold checkmark icons. Right: macOS-style "Client Dashboard" panel with traffic light dots, 4 client rows with colored avatars, names, plan details, and status badges.

**Scroll behavior:**
- Text block slides in from left (translateX -40px → 0)
- Panel slides in from right (translateX 40px → 0), slightly delayed
- Background orb drifts on left side

**Hover/interaction:**
- Panel tilts 3D (±5°) with body content at translateZ(4px)
- Client rows have subtle hover highlight
- Panel lifts 10px on hover with enhanced shadow

### Section 6: For Trainees (split layout, reversed)
Same pattern as Trainers but mirrored. Panel shows "Today's Schedule" with time-based rows, active workout highlighted with gold tint and "LIVE" badge that pulses.

### Section 7: Testimonials (3 glass cards)
**What the user sees:** 3 cards with frosted glass effect, large quotation mark, quote text, avatar circle with gradient and initials, name and role.

**Scroll behavior:**
- Cards stagger in with 3D entrance
- Scale slightly based on distance from viewport center

**Hover/interaction:**
- 3D tilt (±6°) with inner elements at different Z depths
- Border shifts to gold, deep shadow + ambient glow
- Glass effect intensifies (blur increases)

### Section 8: Waitlist CTA (climax section)
**What the user sees:** Extra tall section (260px+ padding). Two gradient orbs create atmosphere behind a centered form. Tag, large heading, social proof counter ("2,400+"), oversized email input (64px) + gold submit button, fine print, App Store + Google Play badges.

**Scroll behavior:**
- Content fades in as one unit
- Orbs react to scroll position

**Hover/interaction:**
- Input: gold focus ring with pulsing animation (4px → 8px shadow)
- Button: magnetic pull, ring expand, shadow bloom
- Store badges: 3D tilt, lift 3px on hover
- On submit: button turns green, text swaps to "✓ You're in!", resets after 3.5s

### Section 9: Footer
- 4-column grid: brand + tagline, Product links, Audience links, Legal links
- Subtle top border
- Link hover: gold color transition
- Bottom bar: copyright, muted color

---

## 3. Technical Architecture

### File Structure
```
fitbook-landing/
├── index.html      # Semantic HTML, data attributes for JS hooks
├── style.css       # All styles, no preprocessor
├── main.js         # All behavior, no dependencies
└── PLAN.md         # This document
```

### JavaScript Architecture

```
main.js
├── Config
│   ├── PARTICLE_COUNT (desktop: 100, mobile: 0)
│   ├── LERP_FACTORS { mouse: 0.03, phone: 0.04, cursor: { dot: 0.3, ring: 0.15 } }
│   └── PARALLAX_ENABLED (respects prefers-reduced-motion)
│
├── State
│   ├── scrollY, lastScrollY, scrollProgress (0-1)
│   ├── mouseX, mouseY (normalized -1 to 1)
│   ├── smoothMouse { x, y } (lerp-smoothed)
│   ├── isDesktop, isMobile, prefersReducedMotion
│   └── particles[] (particle objects array)
│
├── Systems
│   ├── ScrollRevealSystem
│   │   ├── init(): querySelectorAll('.an'), create IntersectionObserver
│   │   └── observer callback: add '.v' class
│   │
│   ├── ParticleSystem
│   │   ├── init(canvas): create particles, setup resize observer
│   │   ├── createParticle(): returns { x, y, vx, vy, size, alpha, magnetism }
│   │   ├── update(particle): move, bounce, apply mouse attraction, edge fade
│   │   ├── draw(): clear canvas, update all, draw dots + connection lines
│   │   └── pause()/resume(): via IntersectionObserver on canvas
│   │
│   ├── ParallaxSystem
│   │   ├── Elements: querySelectorAll('[data-speed]')
│   │   ├── update(scrollY): for each el, apply translateY(offset * speed)
│   │   └── Hero-specific: text opacity fade, grid translateY, phone divergence
│   │
│   ├── TiltSystem
│   │   ├── register(selector, intensity, liftY, scale)
│   │   ├── onMouseMove(e): calculate rotateX/Y from mouse position in element
│   │   ├── onMouseLeave(): reset with spring transition
│   │   └── Spotlight: move .fc-shine div to cursor position within card
│   │
│   ├── CursorSystem (desktop only)
│   │   ├── Elements: outer ring div, inner dot div
│   │   ├── update(): lerp both toward mouse position (different factors)
│   │   ├── onHoverInteractive(): scale up cursor elements
│   │   └── Visibility: hide via CSS on mobile, show on desktop
│   │
│   ├── TextSplitSystem
│   │   ├── init(selector): split text into <span> per character
│   │   ├── Each span: inline-block, opacity:0, translateY, rotateX, transition-delay
│   │   └── trigger(el): add class to parent, children animate via CSS
│   │
│   ├── CounterSystem
│   │   ├── IntersectionObserver at 0.5 threshold
│   │   ├── animate(el, target): RAF loop with easeOutQuart
│   │   └── Format: toLocaleString() + suffix
│   │
│   ├── MagneticSystem
│   │   ├── register(selector)
│   │   ├── onMouseMove: translate toward cursor by distance * 0.2
│   │   └── onMouseLeave: spring-reset with 0.5s transition
│   │
│   └── ShowcaseScrollSystem
│       ├── RAF auto-scroll at 0.5px/frame
│       ├── Pause on hover/touch
│       └── Resume with position sync after 2s delay
│
├── Master RAF Loop
│   ├── requestAnimationFrame(masterLoop)
│   ├── Update smoothMouse (lerp)
│   ├── Update scrollProgress
│   ├── ParallaxSystem.update(scrollY)
│   ├── ParticleSystem.draw()
│   ├── CursorSystem.update()
│   ├── PhoneFrame rotation (mouse-reactive)
│   └── Side phone spread (scroll-reactive)
│
└── Init
    ├── Check prefers-reduced-motion → disable animations if true
    ├── Check viewport → set isDesktop/isMobile
    ├── Initialize all systems
    └── Start masterLoop
```

### CSS Architecture

```
style.css
├── Tokens (:root variables)
│   ├── Colors: 12 semantic tokens (gold palette, bg palette, text palette, accent)
│   ├── Spacing: clamp-based (section padding, content max-width, horizontal padding)
│   ├── Radii: 4 levels (sm=12, md=16, lg=20, xl=24, full=999)
│   ├── Timing: ease curve, ease-out curve
│   └── Breakpoints (in media queries): 1080px, 768px, 480px
│
├── Reset + Base
├── Typography (tag, titles, body, gold accent)
├── Layout (.w container)
├── Buttons (gold, ghost, xl sizing, ::after highlight overlay)
├── Navigation (fixed, scroll state, mobile menu)
│
├── Hero
│   ├── Background layers (grid, orbs, particles canvas)
│   ├── Content (pill badge, h1, subtitle, CTAs)
│   └── Phone cluster (main frame, side phones, inner screen UI)
│
├── Feature Cards (3D transforms, shine, shimmer, mini-app mockups)
├── How It Works (visual scenes, step layout)
├── Showcase (horizontal scroll, phone frames)
├── Split Sections (grid layout, panels, client rows, schedule rows)
├── Testimonials (glassmorphism, glass tilt)
├── Waitlist (oversized inputs, atmospheric glows)
├── Footer
│
├── Animations
│   ├── Scroll reveal (.an → .v transition)
│   ├── Float keyframes (phone, shapes)
│   ├── Pulse keyframes (badge dot, live indicator)
│   ├── Shimmer sweep
│   ├── Border rotate (conic gradient)
│   ├── Glow pulse (section dividers)
│   └── Cursor blink
│
└── Responsive
    ├── 1080px: stack hero, 2-col features, single-col splits
    ├── 768px: hide nav links, single-col features, smaller phones
    └── 480px: stack everything, hide particles, reduce motion
```

---

## 4. Performance Budget

### Targets
- **60fps** on 2020+ desktop hardware
- **30fps minimum** on iPhone 12+ / equivalent Android
- **First paint < 1.5s** on 3G
- **Total JS < 15KB** gzipped
- **Total CSS < 12KB** gzipped

### GPU-Accelerated Properties Only
All animations use ONLY `transform` and `opacity`. Never animate: `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`, `box-shadow` (animated via `filter` instead where needed), `background-position`.

### `will-change` Strategy
Apply `will-change: transform` to:
- Parallax elements (while in viewport, remove when out)
- Phone frames (always, since continuously animated)
- Particle canvas (always)
- Custom cursor elements (always)
- Do NOT apply to all `.an` elements — only during their transition

### Particle System Budget
- Desktop: 100 particles max, 120px connection distance, spatial grid with 60px cells
- Tablet: 60 particles, 100px connection distance
- Mobile: **no particles** (canvas hidden, saves battery)
- `IntersectionObserver` pauses drawing when canvas not visible
- `ResizeObserver` for canvas sizing (18x faster than resize event per benchmarks)

### Scroll Event Strategy
- ONE scroll listener sets `scrollY` variable
- ONE RAF loop reads it and updates all systems
- No per-element scroll listeners
- `passive: true` on all scroll/touch listeners

### Image Budget
- Zero image files — everything is CSS/SVG/canvas
- SVG noise texture is inlined as data URI (~200 bytes)
- Phone UI is pure HTML/CSS

### Accessibility
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Skip: particles, parallax, tilt, cursor, text split, float animations
  // Keep: scroll reveals (instant, no transform), counters (instant), hover color changes
}
```

---

## 5. Responsive Strategy

### Desktop (>1080px)
- Full experience: particles, parallax, tilt, cursor, text split, all 3 phones
- Hero: side-by-side text + phone cluster
- Features: 3-column grid
- How It Works: 4-column grid
- Splits: 2-column with panel

### Tablet (768-1080px)
- Particles reduced to 60
- Custom cursor hidden
- Hero: stacked (text above, phone below), side phones hidden
- Phone tilt: forward-only (rotateX), no mouse tracking
- Features: 2-column grid
- How It Works: 2-column grid
- Splits: stacked, panel centered with max-width

### Mobile (<768px)
- **No particles** (canvas hidden)
- **No custom cursor**
- **No parallax** (all speeds set to 0)
- **No 3D tilt** (hover:hover media query gates it)
- **No text split** (full text renders immediately)
- Scroll reveals: simplified translateY(32px) → 0 (no rotateX)
- Hero: stacked, single phone, smaller frame (220px wide)
- Features: single column, mini-apps still render (they're small HTML)
- How It Works: 2-column then 1-column at 480px
- Showcase: horizontal scroll still works (touch-native)
- Waitlist: stacked input + button
- Nav: burger menu with blur background

### Small Mobile (<480px)
- Stats strip: stacked vertically
- Store badges: stacked
- Footer: single column
- Phone frame: 200px wide
- Showcase phones: 160px wide

---

## 6. Key Differentiators from Current Build

| Current | Planned |
|---------|---------|
| CSS-only background effects | Canvas particle system with mouse attraction |
| Simple translateY scroll reveal | Character-by-character text split reveal with 3D rotation |
| No custom cursor | Gold dot + ring cursor with lerp smoothing |
| No scroll progress indicator | 3px gold gradient bar at top |
| Basic hover lift on cards | 3D perspective tilt with inner-element depth parallax + spotlight |
| Static gradient orbs | Mouse-tracked orbs with 0.02 lerp factor + scroll parallax |
| No section transition effects | Gradient glow dividers with pulsing animation |
| Phone floats with CSS only | Phone rotation driven by mouse position via RAF |
| Same animation for all reveals | Staggered delays with 3D rotateX entrance per element |
| No social proof emphasis | Animated counter numbers with easeOutQuart curve |

---

## Research Sources

- [Lusion Awwwards Case Study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html)
- [Codrops: Lusion Curly Tubes with Three.js](https://tympanus.net/codrops/2021/05/17/curly-tubes-from-the-lusion-website-with-three-js/)
- [Codrops: Lusion Digital Craft](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
- [The Linear Look — Frontend Horse](https://frontend.horse/articles/the-linear-look/)
- [Linear Style Design Origins — Medium](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [Stripe Gradient Effect — Kevin Hufnagl](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/)
- [Vercel Design Guidelines](https://vercel.com/design/guidelines)
- [Cruip: Canvas Particle Animation Tutorial](https://cruip.com/how-to-create-a-beautiful-particle-animation-with-html-canvas/)
- [Canvas Particles JS — Spatial Grid Optimization](https://khoeckman.github.io/canvasparticles-js/)
- [Magnetic Hover Effect — Init HTML](https://en.inithtml.com/resources/magnetic-hover-effect-creating-cursor-attracted-buttons-with-vanilla-javascript/)
- [CSS Spotlight Effect — Frontend Masters](https://frontendmasters.com/blog/css-spotlight-effect/)
- [Dark Glassmorphism: UI in 2026 — Medium](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f)
- [Grainy CSS Backgrounds — freeCodeCamp](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/)
- [SaaS Landing Page Trends 2026 — SaaSFrame](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [Scroll-Linked Parallax — Builder.io](https://www.builder.io/blog/parallax-scrolling-effect)
- [CSS GPU Acceleration Guide — Lexo](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/)
- [Stagger Reveal Animations — Codrops](https://tympanus.net/codrops/2020/06/17/making-stagger-reveal-animations-for-text/)
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
