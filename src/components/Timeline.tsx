'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EVENTS = [
  {
    year: '2021',
    title: 'Started Coding',
    desc: 'Picked up Python, fell down the programming rabbit hole. No going back.',
    color: '#00FF88',
    icon: '🚀',
    type: 'milestone',
  },
  {
    year: '2022',
    title: 'Android Development',
    desc: 'Began building native Android apps with Kotlin. Started with small utilities, grew to full apps.',
    color: '#7F52FF',
    icon: '🤖',
    type: 'skill',
  },
  {
    year: '2022',
    title: 'Published First App',
    desc: 'Deployed Baoiam Inventory Management App for Baoiam Pvt. Ltd. First real-world software project.',
    color: '#0EA5E9',
    icon: '📦',
    type: 'work',
  },
  {
    year: '2023',
    title: 'Flutter Mastery',
    desc: 'Completed Flutter course, built Cross_Chat app. Started cross-platform development journey.',
    color: '#00B4D8',
    icon: '🦋',
    type: 'skill',
  },
  {
    year: '2023',
    title: 'Published pub.dev Package',
    desc: 'Released is_even_new on pub.dev — a Flutter package using bit masking. First open-source package!',
    color: '#00FF88',
    icon: '📦',
    type: 'milestone',
  },
  {
    year: '2023',
    title: 'CSIR-NPL Hardware Project',
    desc: 'Built Android app for CSIR-NPL lab to read voltage and magnetic induction via BLE from Arduino Nano.',
    color: '#FF6B35',
    icon: '⚡',
    type: 'work',
  },
  {
    year: '2023',
    title: 'GDG Campus Connect',
    desc: 'Contributed to GDG Campus Connect application. Engaged with the open-source community.',
    color: '#FEBC2E',
    icon: '🌐',
    type: 'community',
  },
  {
    year: '2024',
    title: 'GDGoC GLAU Organizer',
    desc: 'Became the Organizer of Google Developer Groups on Campus at GLA University — leading tech events, workshops, and the developer community on campus.',
    color: '#4285F4',
    icon: '🧑‍💻',
    type: 'community',
  },
  {
    year: '2024',
    title: 'AI & ML Exploration',
    desc: 'Built Keras OCR Model, MediaPipe gesture recognition, and CloudCode AI dev tool in TypeScript.',
    color: '#7C3AED',
    icon: '🧠',
    type: 'skill',
  },
  {
    year: '2024',
    title: 'Jetpack Compose Deep Dive',
    desc: 'Built Epsilon Player — feature-rich Android media player using Jetpack Compose + Media3/ExoPlayer.',
    color: '#7F52FF',
    icon: '🎵',
    type: 'project',
  },
  {
    year: '2025',
    title: 'Swift & iOS Journey',
    desc: 'Expanding into iOS native development with Swift. DoomScrollingApp ships on the App Store.',
    color: '#FA7343',
    icon: '🍎',
    type: 'skill',
  },
  {
    year: '2026',
    title: 'Exploring Web3 & Rust',
    desc: 'Diving into blockchain development and systems programming. Always chasing new frontiers.',
    color: '#64748B',
    icon: '🔭',
    type: 'future',
  },
]

const TYPE_COLORS: Record<string, string> = {
  milestone: '#00FF88',
  skill: '#0EA5E9',
  work: '#7C3AED',
  community: '#FEBC2E',
  project: '#FF6B35',
  future: '#64748B',
}

export default function Timeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="timeline" ref={ref} className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-[#7C3AED] text-sm mb-3">05 — TIMELINE</div>
          <h2 className="section-heading text-white">
            The <span className="gradient-text">Story</span> So Far
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00FF88]/50 via-[#7C3AED]/50 to-transparent" />

          {EVENTS.map((event, i) => {
            const isRight = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className={`relative flex items-start mb-10 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Dot */}
                <div
                  className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 z-10 mt-4"
                  style={{
                    borderColor: event.color,
                    background: event.color + '30',
                    boxShadow: `0 0 10px ${event.color}60`,
                  }}
                />

                {/* Year — desktop */}
                <div className={`hidden md:flex w-[calc(50%-2rem)] ${isRight ? 'pr-8 justify-end' : 'pl-8 justify-start'}`}>
                  <div
                    className="font-mono text-sm font-bold px-3 py-1 rounded-full"
                    style={{ color: event.color, background: event.color + '10' }}
                  >
                    {event.year}
                  </div>
                </div>

                {/* Card */}
                <div className={`ml-10 md:ml-0 w-full md:w-[calc(50%-2rem)] ${isRight ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div
                    className="glass-card rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    style={{ borderColor: event.color + '20' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{event.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#E2E8F0] text-sm">{event.title}</span>
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: TYPE_COLORS[event.type] + '15', color: TYPE_COLORS[event.type] }}
                          >
                            {event.type}
                          </span>
                          {/* Mobile year */}
                          <span className="md:hidden font-mono text-xs ml-auto" style={{ color: event.color }}>{event.year}</span>
                        </div>
                        <p className="text-[#64748B] text-xs leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
