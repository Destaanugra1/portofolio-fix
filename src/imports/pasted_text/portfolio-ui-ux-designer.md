Create a modern personal portfolio website for a UI/UX Designer with full Light/Dark mode 
toggle, custom cursor, and programming skills section. Animate every section.

---

## 🎨 DUAL COLOR SYSTEM

### DARK MODE (default)
- Background: #0d0d0d
- Surface/Card: #1a1a1a
- Primary Accent: #00e676 (bright green)
- Text Primary: #ffffff
- Text Secondary: #888888
- Nav: #111111
- Button filled: #00e676 bg + #000 text
- Button outlined: transparent + #00e676 border + #00e676 text

### LIGHT MODE
- Background: #f5f5f5
- Surface/Card: #ffffff
- Primary Accent: #8b0000 (dark maroon red)
- Text Primary: #1a1a1a
- Text Secondary: #666666
- Nav: #ffffff with subtle shadow
- Button filled: #8b0000 bg + #fff text
- Button outlined: transparent + #8b0000 border + #8b0000 text
- Decorative shapes: maroon tones at low opacity

Use CSS variables for ALL colors so toggling mode just swaps the root variables.
Mode toggle button: top-right area of navbar, sun/moon icon, smooth 0.4s transition on ALL colors.

---

## 🖱️ CUSTOM CURSOR

Hide default cursor globally: cursor: none on all elements.

Create two cursor layers:
1. CURSOR DOT — small filled circle, 10px
   - Dark mode: #00e676 fill
   - Light mode: #8b0000 fill
   - Follows mouse position instantly (0ms delay)

2. CURSOR RING — hollow circle, 32px, 2px border
   - Dark mode: #00e676 border
   - Light mode: #8b0000 border
   - Follows mouse with 80ms smooth lag (lerp effect)

Cursor states:
- Default: dot + ring as described
- Hover on button/link: ring expands to 52px, fills with accent color at 15% opacity, dot disappears
- Hover on image/card: ring expands to 64px, label "VIEW" appears inside ring (12px, bold, accent color)
- On click: dot bursts scale 2x then shrinks back, 0.2s spring animation
- Cursor color transitions smoothly when mode is toggled (0.3s)

---

## 🔤 TYPOGRAPHY
- Headings: Bold, 56–72px
- Accent word: accent color, same size
- Body: 14–16px, secondary text color
- Overline: 11px uppercase letter-spacing 3px, accent color

---

## SECTION 1 — HERO

Layout: Two-column (50/50), full viewport height

Left column:
- Overline: "HELLO, I'M A"
- Heading: "UI & UX" (primary text) + "Designer." (accent color, italic)
- Body text: short intro, secondary color
- CTA Button: filled accent, "VIEW PORTFOLIO"
- Scroll hint: "Scroll Down to Explore" + animated down arrow

Right column:
- Circular blob (accent color, 60% opacity) as background
- Person photo cutout overlapping blob
- Decorative dots grid (top-right)
- Floating geometric shapes: triangle outline, hexagon outline, circle outline

Background:
- Large hexagon wireframe (left, very subtle)
- Dotted grid pattern (top-right)

ANIMATIONS:
- Page load stagger: overline → heading → body → button, each 0.6s ease-out, 100ms apart
- Photo: slide in from right + fade, 0.8s
- Blob: scale 0→1 spring bounce, 1s delay
- Floating shapes: continuous slow rotation (360deg, 8s infinite), each different speed
- CTA hover: scale 1.05 + accent glow box-shadow

---

## SECTION 2 — ABOUT ME

Layout: Two-column

Left:
- Circular photo, person in suit
- 3 floating stat badges (dark pill with white text + accent number):
  · "16+ Years of Experience" (top-right of photo)
  · "215+ Projects Completed" (left)
  · "97+ Happy Clients" (bottom-right)
- Thin dashed accent-colored ring around photo, rotating continuously

Right:
- Overline: "LET ME INTRODUCE MYSELF"
- Heading: "About me" (accent color)
- Subheading: bold white/dark
- Body paragraph
- Email in accent color
- Buttons: "HIRE ME" (filled) + "DOWNLOAD CV" (outlined)

ANIMATIONS:
- Scroll-triggered section reveal
- Stat badges: count-up animation 0→final number, 1.5s
- Dashed ring: infinite clockwise rotation, 20s
- Text: stagger fade from right, 150ms apart

---

## SECTION 3 — SERVICES

3-column card grid
Overline: "WHAT I WILL DO FOR YOU"
Title: "Services" (accent color, centered)

Card 1 (accent color background — highlighted):
- Icon: lightbulb outline (white)
- "198 PROJECTS" label
- Title: "UI & UX Design"
- Body description

Card 2 (surface color):
- Icon: layers outline (accent color)
- "55 PROJECTS"
- "Graphic Design"

Card 3 (surface color):
- Icon: monitor outline (accent color)
- "112 PROJECTS"
- "Web Design"

ANIMATIONS:
- Scroll-triggered: cards slide up, stagger 200ms
- Hover: translateY -8px + accent glow shadow
- Icon: pulse scale on card hover

---

## SECTION 4 — PROGRAMMING SKILLS

Overline: "WHAT I WORK WITH"
Title: "Tech Stack & Skills" (accent color, centered)

Layout: Two-column

Left column — Language Proficiency (horizontal progress bars):
Each bar has: language name left + percentage right + filled progress bar (accent color)

- HTML/CSS .............. 95%
- JavaScript ............. 88%
- TypeScript ............. 75%
- Python ................. 80%
- PHP .................... 70%
- Dart/Flutter ........... 65%

Progress bar style:
- Track: surface/card color, rounded, height 8px
- Fill: accent color gradient (accent → accent 70%), rounded
- Percentage label: accent color, bold

Right column — Tools & Frameworks (icon grid):
3x3 or 4x2 grid of tech icons with label below each:
- React, Vue, Node.js, Figma, Git, Firebase, MySQL, Tailwind CSS, Docker

Icon card: surface background, rounded 12px, accent color icon, 
label below in secondary text

ANIMATIONS:
- Scroll-triggered: progress bars fill from 0% → final value, 1.2s ease-out with 100ms stagger
- Icon cards: fade in grid style, stagger 80ms each
- Icon hover: scale 1.1 + accent color glow, 0.2s

---

## SECTION 5 — PORTFOLIO

Title: "Portfolio" (accent color)
Filter tabs: "All" | "UI & UX Design" | "Branding