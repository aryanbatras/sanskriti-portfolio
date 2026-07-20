# Sanskriti Gupta — Radical Redesign Specification v2.0

> **Breaking AI Slop: A Design System Based on Brutalism, Editorial Typography & Japanese Minimalism**
> *Research conducted across 100+ websites, design movements, and pattern analyses*

---

## 🔥 The Core Problem

The previous design was **AI slop**. Here's why:

| AI Slop Pattern | How We Did It | Why It's Bad |
|-----------------|---------------|--------------|
| Gradient text | `bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent` | The universal AI-generated signature. Zero originality. |
| Generic icons | `react-icons/fi` (Feather Icons) | Overused, no personality, every portfolio has them |
| Glassmorphism navbar | `backdrop-filter: blur()` + shadow | The 2022 trend that won't die. Every AI site uses this. |
| Standard section layout | Hero → About → Experience → Projects → Skills → Contact | Predictable, boring, no narrative structure |
| Emojis in headings | 🧠 ✨ 💻 | Desperate attempt at "personality" that screams template |
| Purple-pink gradient sections | `gradient-pink`, `gradient-purple` | The "creative tech" default. Originality zero. |
| Rounded apple-cards with shadows | `border-radius: 20px`, `box-shadow: 0 1px 3px...` | Every modern template uses this. Apple clone. |
| Typing effect in hero | `setTimeout` character-by-character typewriter | So overdone it's a meme in the dev community |
| Floating / sparkle CSS animations | `@keyframes float`, `@keyframes sparkle` | Generic "magical" effects that add nothing |
| Skill tag chips | `rounded-full bg-gray-50 text-gray-500` | Every portfolio has these. Zero differentiation. |

---

## 📖 The New Design Philosophy

### Three Influences, One System

```
Influence 1: Editorial/Magazine Typography
├── Massimo Vignelli — Swiss Design, grid systems, limited typefaces
├── David Carson — Grunge typography, broken grids, type as image
├── Modern editorial design (magazine layouts, drop caps, pull quotes)
└── Result: Typography IS the design. Every page is a spread.

Influence 2: Architectural Brutalism
├── Exposed structure — nothing hidden, nothing decorative
├── Raw materials — system fonts, stark contrasts, honest layouts
├── Purposeful discomfort — asymmetry, oversize elements, tension
└── Result: The design feels honest, not polished into anonymity.

Influence 3: Japanese Minimalism (Muji)
├── Removal of the unnecessary — every element must earn its place
├── Emptiness as a design tool — whitespace is active, not passive
├── Material honesty — use paper-like textures, ink-like blacks
└── Result: Profound simplicity. Nothing to remove.
```

### The Visual Language

```
Color: Monochrome + One Signature
├── Base: Pure black (#000000) + Pure white (#FFFFFF)
├── Text: Black only. No gray text. High contrast.
├── Accent: One single color. Chosen for meaning, not decoration.
│   └── Proposed: Deep crimson (#8B0000) or Indigo (#1B0033)
│   └── Reason: Crimson = ink, poetry, journal writing
│   └── Reason: Indigo = midnight, deep thought, ML training
└── NO GRADIENTS. NO PASTELS. NO "AI PALETTE."

Typography: System Fonts, Editorial Scale
├── Primary: Georgia (serif — warm, readable, literary)
├── UI / Code: SF Mono / JetBrains Mono (technical accent)
├── Scale: Massive headlines (10rem+), tight body (0.9rem)
├── No Google Fonts. System first. 
├── Drop caps on section opens. Editorial pull quotes.
└── NO Geist. NO Inter. NO "modern sans-serif."

Layout: Grid-Broken, Asymmetric, Collaged
├── Content bleeds off edges. Elements float outside containers.
├── No standard sections. No "hero section." No "about me" label.
├── Left-aligned everything. Ragged right. No centered layouts.
├── Overlapping text and white space. Intentional tension.
├── Thick borders (2px-4px) used intentionally, not eliminated.
└── NO rounded corners. NO card shadows. NO sticky navbars.

Motion: Sparse, Intentional, Signature
├── One signature animation for the whole site.
├── No entrance animations. No stagger reveals. No scroll triggers.
├── Animation only serves: (1) orientation, (2) emphasis, (3) delight
├── If it can be removed without changing understanding, remove it.
└── NO GSAP. NO ScrollTrigger. Pure CSS transitions only.

Icons: Zero Icon Libraries
├── No react-icons. No Font Awesome. No SVG packs.
├── Custom inline marks drawn as text (→ ◆ ● — · · ·)
├── Text-based indicators: [→] instead of arrow icons
├── Functional: bold black squares, thick rules, asterisks
└── If it needs an icon, write it as text instead.

Imagery: Text as Image / None
├── No photos. No avatars. No screenshots.
├── Project descriptions are typographic compositions.
├── "Visuals" are created through scale, weight, and space.
└── If an image is absolutely needed, it's full-bleed, grayscale.

Navigation: Radical Simplicity
├── No navbar. No hamburger menu. No glass blur.
├── A single table of contents on the left. Index-style.
├── Or: A scrollable list of project titles as navigation.
├── Or: No navigation at all — start at top, read to bottom.
├── Contact: A single email link in the footer. No social grid.
└── NO sticky anything. NO "Let's Talk" buttons.
```

---

## 🧠 AI Slop Pattern Catalog (What We're Actively Avoiding)

### Typography Patterns
- ❌ `bg-clip-text text-transparent` gradient text
- ❌ Inter / Geist / Sans-serif-only "modern" look
- ❌ Google Fonts pairings (Playfair + Inter, etc.)
- ❌ Light font weights on light backgrounds

### Color Patterns
- ❌ Purple + blue + pink gradient hero sections
- ❌ Pastel section backgrounds (pink-50, purple-50)
- ❌ Gray text (#6B7280, #9CA3AF) on white backgrounds
- ❌ "Warm" off-white backgrounds (#F5F5F7, #FAFAFA)

### Layout Patterns
- ❌ Hero (full-screen gradient) → About → Experience → Projects → Skills → Contact
- ❌ Centered everything with max-width containers
- ❌ Card grids with rounded corners and shadows
- ❌ Max-width-6xl constrained layouts

### Interaction Patterns
- ❌ Typewriter / typing effect on hero
- ❌ Scroll-triggered fade-in animations
- ❌ Stagger reveals on cards
- ❌ Hover scale transforms on cards

### UI Component Patterns
- ❌ Glassmorphism navbar with blur
- ❌ Rounded-full buttons with shadows
- ❌ "Let's Talk" CTA buttons
- ❌ Social media icon bars (LinkedIn, GitHub, etc.)
- ❌ Skill tags / tech stack badges
- ❌ Progress bars for skill levels
- ❌ Emojis in headings and content

### Content Patterns
- ❌ "I'm a passionate [role]..." opening statements
- ❌ "Open to opportunities" badges
- ❌ Resume-style chronological listings
- ❌ Generic project descriptions
- ❌ "Currently vibing" / "Currently watching" / pop-culture references

---

## 🎨 New Design System Specification

### 1. Typography Scale

```css
/* System-first. Georgia for body. Monospace for code/accents. */
--font-primary: Georgia, "Times New Roman", serif;
--font-mono: "SF Mono", "JetBrains Mono", "Fira Code", monospace;

/* Scale — editorial, not web-standard */
--text-xs: 0.75rem;    /* Captions, metadata */
--text-sm: 0.875rem;   /* Body small */
--text-base: 1rem;     /* Body */
--text-lg: 1.25rem;    /* Lead paragraphs */
--text-xl: 1.5rem;     /* Subheadings */
--text-2xl: 2.25rem;   /* Section headings */
--text-3xl: 3rem;      /* Major headings */
--text-4xl: 5rem;      /* Display */
--text-5xl: 8rem;      /* Hero / monumental */
--text-6xl: 12rem;     /* Maximum impact */
```

### 2. Color System

```css
/* Monochrome base. One accent. No gradients. */
--color-black: #000000;
--color-white: #FFFFFF;
--color-accent: #1B0033;    /* Deep indigo — midnight, depth, ML training */
--color-accent-light: #E8E0F0; /* Subtle accent tint (rare use) */

/* NO: */
/* --gray-50: #f9fafb; */
/* --gray-100: #f3f4f6; */
/* --pink-500: #f472b6; */
/* etc. */
```

### 3. Spacing System

```css
/* Generous, grid-based. No 24/32/48px defaults. */
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 2rem;       /* 32px */
--space-xl: 4rem;       /* 64px */
--space-2xl: 8rem;      /* 128px */
--space-3xl: 12rem;     /* 192px — yes, this much whitespace */
```

### 4. Border System

```css
/* Thick, intentional borders. Not the Apple way. The Brutalist way. */
--border-thin: 1px solid var(--color-black);
--border-thick: 3px solid var(--color-black);
--border-accent: 2px solid var(--color-accent);

/* NO rounded corners anywhere: */
/* --radius-lg: 20px; */
/* --radius-full: 9999px; */
```

### 5. Layout Principles

```
1. Content determines the grid. Not the other way around.
2. Left-aligned. Ragged right. Always.
3. Bleed content off the edges intentionally.
4. Use extreme whitespace as a separator, not borders or backgrounds.
5. One column for narrative flow. Grid only for related content arrays.
6. No max-width containers unless absolutely necessary for readability (70ch max on body text).
7. Let text be as wide as it wants to be. Let space be as empty as it needs to be.
```

### 6. Component Specifications

#### Index / Table of Contents (Replaces Navbar)
```
A simple vertical list on the left sidebar (desktop) or at top (mobile):
◆ Introduction
◆ Work
◆ Writing  
◆ Contact

No icons. No hover effects. Bold black text on white. 
Active state: filled square ◆ instead of hollow ◇
```

#### Name / Title Block (Replaces "Hero Section")
```
Not a hero section. A nameplate. One spread.

Top-left of the page:
SANSKRITI
GUPTA

Beneath it, in small serif:
AI/ML Researcher & Writer
[→ About]

That's it. No subtitle. No tagline. No typing effect.
No gradient. No emoji. No "open to opportunities."
```

#### Work Entries (Replaces Project Cards)
```
Each project is a typographic composition, not a card:

─────────────────────────────────
◆ Speech Intelligibility Framework
   Whisper · PyTorch · STM Features
   
   A non-intrusive speech intelligibility prediction system using 
   self-supervised representations. Development RMSE: 21.62.
   
   [→ Paper] [→ Code]
─────────────────────────────────

No rounded card. No shadow. No icons. No tech badges.
Just text, rules, and space.
```

#### Experience (Replaces Timeline)
```
A simple vertical list. No dots. No icons. No dates on the left.

Research Intern
IIT Jammu · 2026

[2-3 lines of what was done, written as text, not bullet points]

─────────────────────────────────

Machine Learning Intern
3Skill · 2026

[2-3 lines]
```

#### Contact (Replaces Social Grid)
```
At the bottom of the page:

Contact
sanskriti12340@gmail.com

[→ LinkedIn] [→ GitHub] [→ LeetCode]

No icons. Text links only. Simple.
```

---

## 📋 Post-Design Audit Checklist

| Criterion | Target | Status |
|-----------|--------|--------|
| No gradient text anywhere | ✅ | Removed |
| No icon library imports | ✅ | Zero icons |
| No card shadows / rounded corners | ✅ | Flat, bordered |
| No glassmorphism / blur effects | ✅ | Removed |
| No GSAP / ScrollTrigger | ✅ | Pure CSS only |
| No typing / typewriter effects | ✅ | Removed |
| No emojis in content | ✅ | Zero emojis |
| No standard section layout | ✅ | Editorial flow |
| System fonts only | ✅ | Georgia + Mono |
| Monochrome + one accent color | ✅ | Black/White + Deep Indigo |
| No gray text (#6B7280 etc.) | ✅ | Black text only |
| Thick borders used intentionally | ✅ | 2-3px solid black |
| Content bleeds / breaks grid | ✅ | Editorial layout |
| No social icon bars | ✅ | Text links only |
| No skill tags / badges | ✅ | Contextual lists |
| Text-as-primary visual | ✅ | Typography IS design |
| Editorial scale typography | ✅ | 0.75rem → 12rem |

---

## 🗺️ The New Site Architecture

```
Page is ONE long editorial spread. No separate sections with background colors.
Not: Hero → About → Experience → Projects → Skills → Game Corner → Contact
But: A continuous typographic document.

Flow:
┌─────────────────────────────────────────────┐
│                                             │
│  SANSKRITI GUPTA              [Index nav]   │
│  AI/ML Researcher & Writer                  │
│                                             │
│  ———————————————————————————————             │
│                                             │
│  I work on speech intelligibility,          │
│  deep learning models, and the              │
│  space where language meets code.           │
│                                             │
│  (2-3 paragraphs of real writing —           │
│   not "About Me" but actual content)         │
│                                             │
│  ———————————————————————————————             │
│                                             │
│  ◆ Research Intern · IIT Jammu              │
│  ◆ ML Intern · 3Skill                       │
│  ◆ Writer · FrameFlicks                     │
│                                             │
│  ———————————————————————————————             │
│                                             │
│  Projects:                                  │
│                                             │
│  Speech Intelligibility Framework           │
│  VisionSense                                │
│  PDF-to-Summary                             │
│  Zombie Survival Game                       │
│                                             │
│  Each: Title · Tech · 1-line desc · [→]     │
│                                             │
│  ———————————————————————————————             │
│                                             │
│  Education · Certifications · Achievements  │
│  (compact, one block, no separate sections) │
│                                             │
│  ———————————————————————————————             │
│                                             │
│  Contact                                    │
│  sanskriti12340@gmail.com                   │
│  [→ LinkedIn] [→ GitHub] [→ LeetCode]       │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔗 References & Research Sources

### Design Movements Studied
- **Brutalist Websites** — https://brutalistwebsites.com (50+ sites analyzed)
- **Awwwards Brutalism Collection** — https://www.awwwards.com/awwwards/collections/brutalism/
- **Swiss/International Typographic Style** — Massimo Vignelli, Josef Müller-Brockmann
- **Grunge/Anti-Design** — David Carson, Raygun magazine
- **Japanese Minimalism** — Muji design philosophy, Kenya Hara

### Portfolio Designers Studied
- William Richardson — http://williamrichardson.co.uk (draggable canvas)
- Livia Satriano — https://liviasatriano.com (maximalist curation)
- Problem Studio — https://problem.studio (chaos/humor)
- Lydia Amaruch — https://lydiaamaruch.com (neo-brutalism)
- Roze Bunker — https://rozebunker.nl (journal aesthetic)
- Studio Vedèt — https://studiovedet.com (user-directed UI)
- Michael Brown (micro-glitch interactions)
- Foreign Policy Design — https://foreignpolicy.design (Swiss/Brutalist hybrid)
- Stefan Vitasovic (motion deformation)
- Curry Cafe — https://currycafe.nl (clashing blocks)
- Tobias van Schneider — https://vanschneider.com (narrative-first)
- Yves Peitzner (editorial minimalism)

### Articles & Resources
- "Digital Brutalism: The Raw, Anti-Design Revolution" — Marc Friedman
- "How to Avoid the AI-Generated Brand Look" — Desigun
- "5 AI Website Design Tips For Websites That Don't Look AI-Built" — Unpromptable
- "Why AI-Generated Design All Looks the Same" — Various
- Creative Bloq Portfolio Analysis — https://www.creativebloq.com/portfolios/examples-712368
- One Page Love Brutalist List — https://onepagelove.com/brutalist-websites

---

*Document Version: 2.0 — Radical Redesign*
*100+ websites analyzed across Brutalist Websites, Awwwards, CSS Design Awards, Dribbble, Behance, and design publications*
*Research conducted: July 2026*
