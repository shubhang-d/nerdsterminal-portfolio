'use client'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

const PROJECTS = [
  {
    id: 'epsilon',
    name: 'Epsilon Player',
    tagline: 'Android Media Player',
    desc: 'Feature-rich media player built with Kotlin and Jetpack Compose. Uses Media3/ExoPlayer library for smooth playback, custom UI components, and Material You theming.',
    tags: ['Kotlin', 'Jetpack Compose', 'Media3', 'Android'],
    color: '#7C3AED',
    accent: '#A78BFA',
    github: 'https://github.com/shubhang-d/Epsilon-Player',
    screenLines: ['Epsilon Player', '▶ Now Playing', 'Bohemian Rhapsody', '━━━━●──────', '3:21 / 5:55', '⏮  ⏸  ⏭'],
    platform: 'android',
  },
  {
    id: 'crosschat',
    name: 'Cross Chat',
    tagline: 'Cross-Platform Messaging',
    desc: 'A cross-platform chat application built with Flutter and Firebase. Real-time messaging, authentication, and a beautiful Material Design UI that works on iOS, Android and web.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Cross-Platform'],
    color: '#0EA5E9',
    accent: '#38BDF8',
    github: 'https://github.com/shubhang-d/Cross_Chat',
    screenLines: ['Cross Chat', '─────────────', '• Alice: Hey! 👋', '• You: Hey there!', '• Alice: What\'s up?', '[Type a message...]'],
    platform: 'both',
  },
  {
    id: 'cloudcode',
    name: 'CloudCode',
    tagline: 'AI Legacy Code Remover',
    desc: 'An AI-powered tool built in TypeScript that analyzes codebases for legacy patterns and suggests modern replacements. Integrates with LLMs to provide context-aware refactoring.',
    tags: ['TypeScript', 'AI', 'LLM', 'Developer Tool'],
    color: '#00FF88',
    accent: '#6EE7B7',
    github: 'https://github.com/shubhang-d/CloudCode',
    screenLines: ['CloudCode AI', '$ analyze ./src', '  Scanning...', '  Found 12 issues', '  Auto-fix? [Y/n]', '  ✓ Done in 1.2s'],
    platform: 'web',
  },
  {
    id: 'doomscroll',
    name: 'DoomScrollingApp',
    tagline: 'iOS App (Swift)',
    desc: 'A native iOS application built with Swift. Demonstrates understanding of UIKit, SwiftUI patterns, and iOS ecosystem development.',
    tags: ['Swift', 'iOS', 'UIKit', 'Native'],
    color: '#FF6B35',
    accent: '#FCA87E',
    github: 'https://github.com/shubhang-d/DoomScrollingApp',
    screenLines: ['DoomScroll', '─────────────', '📱 Feed', '  Post by @user', '  ♡ 142  💬 23', '  ↻ Scroll for more'],
    platform: 'ios',
  },
  {
    id: 'csir',
    name: 'CSIR-NPL BLE App',
    tagline: 'Hardware + Bluetooth',
    desc: 'Android app that reads real-time voltage and magnetic induction data from an Arduino Nano via Bluetooth (HC-05). Built for CSIR-NPL research lab.',
    tags: ['Android', 'Bluetooth', 'Arduino', 'C++', 'IoT'],
    color: '#FEBC2E',
    accent: '#FDE68A',
    github: 'https://github.com/shubhang-d/CSIR---NPL',
    screenLines: ['CSIR-NPL', '─────────────', '● BLE Connected', 'Voltage: 3.14V', 'Mag: 0.023 mT', '📊 Graph View →'],
    platform: 'android',
  },
  {
    id: 'keras',
    name: 'Keras OCR Model',
    tagline: 'ML / Computer Vision',
    desc: 'High-accuracy Optical Character Recognition model using Keras and TensorFlow. Trained on custom datasets, achieves high accuracy on printed and handwritten text.',
    tags: ['Python', 'Keras', 'TensorFlow', 'OCR', 'ML'],
    color: '#FF6B35',
    accent: '#FCA87E',
    github: 'https://github.com/shubhang-d/Keras-OCR-Model',
    screenLines: ['Keras OCR', '─────────────', '> Input: image.png', '> Processing...', '> "Hello World"', '> Confidence: 97%'],
    platform: 'web',
  },
]

function TiltCard({ children, color }: { children: React.ReactNode; color: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-60, 60], [-6, 6]), { stiffness: 300, damping: 30 })
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
    glowOpacity.set(1)
  }

  const handleMouseLeave = () => {
    x.set(0); y.set(0); glowOpacity.set(0)
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Holographic shimmer overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: `linear-gradient(135deg, ${color}15 0%, transparent 40%, ${color}08 60%, transparent 100%)`,
          zIndex: 1,
        }}
      />
      {children}
    </motion.div>
  )
}

function PhoneMockup({ project, platform }: { project: typeof PROJECTS[0]; platform: string }) {
  return (
    <div className="relative flex justify-center">
      <div className="relative" style={{ width: 200, height: 400 }}>
        {/* Phone body */}
        <div
          className="absolute inset-0 rounded-[2.5rem] border-4 shadow-2xl"
          style={{
            borderColor: project.color + '40',
            background: 'linear-gradient(145deg, #0D0D1A, #050510)',
            boxShadow: `0 0 40px ${project.color}30, inset 0 0 20px rgba(0,0,0,0.5)`,
          }}
        />

        {/* Screen */}
        <div
          className="absolute top-4 left-4 right-4 bottom-4 rounded-[2rem] overflow-hidden"
          style={{ background: '#050510' }}
        >
          {/* Status bar */}
          <div className="flex justify-between items-center px-4 py-2">
            <span className="text-[10px] font-mono text-[#64748B]">9:41</span>
            <div className="w-16 h-3 rounded-full bg-black absolute top-2 left-1/2 -translate-x-1/2" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-[#64748B]" />
              <div className="w-1 h-1 rounded-full bg-[#64748B]" />
              <div className="w-3 h-2 rounded-sm border border-[#64748B] bg-[#64748B]/50" />
            </div>
          </div>

          {/* App content */}
          <div className="px-3 py-2">
            {project.screenLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`font-mono leading-6 ${
                  i === 0
                    ? 'text-sm font-bold mb-2'
                    : 'text-xs text-[#94A3B8]'
                }`}
                style={i === 0 ? { color: project.color } : {}}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Side button */}
        <div
          className="absolute right-[-6px] top-24 w-1.5 h-12 rounded-full"
          style={{ background: project.color + '40' }}
        />
        <div
          className="absolute left-[-6px] top-20 w-1.5 h-8 rounded-full"
          style={{ background: project.color + '30' }}
        />
        <div
          className="absolute left-[-6px] top-32 w-1.5 h-8 rounded-full"
          style={{ background: project.color + '30' }}
        />

        {/* Platform badge */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono border"
          style={{ borderColor: project.color + '40', color: project.color, background: project.color + '15' }}
        >
          {platform === 'android' ? '🤖 Android' : platform === 'ios' ? '🍎 iOS' : platform === 'both' ? '📱 Cross-Platform' : '🌐 Web/AI'}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const project = PROJECTS[selected]

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${project.color}08 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-[#FF6B35] text-sm mb-3">03 — PROJECTS</div>
          <h2 className="section-heading text-white">
            What I&apos;ve <span className="gradient-text">Shipped</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Project list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 space-y-3"
          >
            {PROJECTS.map((p, i) => (
              <TiltCard key={p.id} color={p.color}>
                <button
                  onClick={() => setSelected(i)}
                  className={`w-full text-left rounded-xl p-5 transition-all duration-300 cursor-pointer border ${
                    selected === i
                      ? 'border-opacity-100 scale-[1.01]'
                      : 'border-transparent hover:border-white/5'
                  }`}
                  style={selected === i
                    ? { borderColor: p.color + '40', background: p.color + '08', boxShadow: `0 0 30px ${p.color}15` }
                    : { background: 'rgba(10,10,30,0.4)' }
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="font-semibold text-[#E2E8F0]">{p.name}</span>
                        <span className="font-mono text-xs text-[#64748B]">{p.tagline}</span>
                      </div>
                      <p className="text-[#64748B] text-sm leading-relaxed">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tags.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: p.color + '15', color: p.accent }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 p-2 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                      title="View on GitHub"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#64748B] hover:text-[#E2E8F0]">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </a>
                  </div>
                </button>
              </TiltCard>
            ))}
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 flex justify-center sticky top-32"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <PhoneMockup project={project} platform={project.platform} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
