# nerdsterminal-portfolio

> "Building apps for Humans" — the personal portfolio of **Shubhang Dixit**, mobile developer from Mathura, India.

Live at **[nerdsterminal.com](https://nerdsterminal.com)**

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2 + React 19 |
| Styling | Tailwind CSS v4 |
| 3D / WebGL | Three.js 0.183, @react-three/fiber, @react-three/drei |
| Animation | Framer Motion 12, GSAP 3.14 |
| Smooth scroll | Lenis 1.3 (synced to GSAP ScrollTrigger) |
| Fonts | Space Grotesk (body), JetBrains Mono (code) |

---

## Features

- OS-style **boot screen** animation on first load
- Fullscreen **Three.js hero** — holographic rings, floating code fragments, mouse-reactive particle field, glowing data orbs
- Interactive **terminal** in the About section (type `help`, `whoami`, `ls skills/`, etc.)
- Animated **skill bars** + **3D rotating skill orbs** scene
- **Project showcase** with 3D magnetic tilt cards and holographic shimmer
- **Horizontal scroll roadmap** (GSAP ScrollTrigger pinned section) — learning journey from 2021 → future
- **Timeline** — career milestones with alternating layout
- **Custom cursor** with lagging ring and mix-blend-difference dot
- Glitch text effect, scanline overlay, noise texture

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── globals.css        # design tokens, animations, utilities
│   ├── layout.tsx         # fonts + metadata
│   └── page.tsx
└── components/
    ├── BootScreen.tsx      # OS boot animation
    ├── Navigation.tsx      # floating pill navbar
    ├── Hero.tsx            # hero section + typewriter
    ├── HeroScene.tsx       # Three.js canvas (ssr:false)
    ├── About.tsx           # interactive terminal + profile card
    ├── Skills.tsx          # skill bars + tab switcher
    ├── SkillsScene3D.tsx   # Three.js skill orbs (ssr:false)
    ├── Projects.tsx        # project showcase with tilt cards
    ├── TechRoadmap.tsx     # GSAP horizontal scroll roadmap (ssr:false)
    ├── Timeline.tsx        # career timeline
    ├── Contact.tsx         # terminal-style contact section
    ├── CustomCursor.tsx    # custom cursor (ssr:false)
    └── PortfolioContent.tsx# root client wrapper (Lenis + GSAP init)
```

---

## Links

- GitHub — [github.com/shubhang-d](https://github.com/shubhang-d)
- LinkedIn — [linkedin.com/in/shubhang-dixit](https://linkedin.com/in/shubhang-dixit)
- Twitter — [@shubhang_dixit](https://twitter.com/shubhang_dixit)
- Blog — [nerdsterminal.com](https://nerdsterminal.com)
