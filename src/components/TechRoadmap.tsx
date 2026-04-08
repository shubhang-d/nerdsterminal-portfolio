'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ROADMAP = [
  { year: '2021', tech: 'Python', color: '#3776AB', desc: 'First steps into programming', icon: '🐍', status: 'mastered' },
  { year: '2022', tech: 'Java', color: '#ED8B00', desc: 'Object-oriented foundations', icon: '☕', status: 'mastered' },
  { year: '2022', tech: 'Kotlin', color: '#7F52FF', desc: 'Android dev begins', icon: '🟣', status: 'advanced' },
  { year: '2022', tech: 'Android SDK', color: '#3DDC84', desc: 'Native Android apps', icon: '🤖', status: 'advanced' },
  { year: '2023', tech: 'Flutter', color: '#00B4D8', desc: 'Cross-platform mastery', icon: '🦋', status: 'expert' },
  { year: '2023', tech: 'Dart', color: '#00D1FF', desc: 'Flutter language depth', icon: '🎯', status: 'expert' },
  { year: '2023', tech: 'Firebase', color: '#FFCA28', desc: 'Backend-as-a-Service', icon: '🔥', status: 'advanced' },
  { year: '2023', tech: 'JavaScript', color: '#F7DF1E', desc: 'Web scripting', icon: '🟡', status: 'intermediate' },
  { year: '2024', tech: 'TypeScript', color: '#3178C6', desc: 'Type-safe JS', icon: '📘', status: 'intermediate' },
  { year: '2024', tech: 'React', color: '#61DAFB', desc: 'Component-based UI', icon: '⚛️', status: 'intermediate' },
  { year: '2024', tech: 'Swift', color: '#FA7343', desc: 'iOS native dev', icon: '🍎', status: 'learning' },
  { year: '2024', tech: 'Jetpack Compose', color: '#7F52FF', desc: 'Modern Android UI', icon: '🏗️', status: 'intermediate' },
  { year: '2025', tech: 'ML / AI', color: '#FF6B35', desc: 'Keras, MediaPipe, LLMs', icon: '🧠', status: 'intermediate' },
  { year: '2025', tech: 'Next.js', color: '#E2E8F0', desc: 'Full-stack React', icon: '▲', status: 'intermediate' },
  { year: '2026', tech: 'Web3', color: '#F6851B', desc: 'Decentralized apps', icon: '⛓️', status: 'learning' },
  { year: '2026', tech: 'Rust', color: '#CE422B', desc: 'Systems programming', icon: '⚙️', status: 'exploring' },
]

const STATUS_COLORS: Record<string, string> = {
  expert:       '#00FF88',
  advanced:     '#0EA5E9',
  intermediate: '#7C3AED',
  learning:     '#FF6B35',
  exploring:    '#64748B',
  mastered:     '#00FF88',
}

const STATUS_LABELS: Record<string, string> = {
  expert:       'Expert',
  advanced:     'Advanced',
  intermediate: 'Proficient',
  learning:     'Learning',
  exploring:    'Exploring',
  mastered:     'Mastered',
}

export default function TechRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const headingRef   = useRef(null)
  const inView       = useInView(headingRef, { once: true, margin: '-100px' })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      return () => tween.kill()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} id="roadmap" className="bg-[#050510]">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 60%)' }}
      />

      {/* Heading */}
      <div ref={headingRef} className="relative px-8 md:px-16 pt-24 pb-10 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="font-mono text-[#00FF88] text-sm mb-2">04 — ROADMAP</div>
          <h2 className="section-heading text-white">
            The Learning <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-[#64748B] text-sm mt-2 font-mono">↕ scroll to travel through time</p>
        </motion.div>
      </div>

      {/* Horizontal track */}
      <div className="relative overflow-hidden" style={{ height: 380 }}>
        <div
          ref={trackRef}
          className="flex items-center h-full px-16 gap-0 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* START node */}
          <div className="flex flex-col items-center shrink-0 mr-10">
            <div className="w-12 h-12 rounded-full bg-[#00FF88] flex items-center justify-center text-[#050510] font-bold text-xs glow-green">
              START
            </div>
            <div className="font-mono text-xs text-[#64748B] mt-2">2021</div>
          </div>

          {/* Nodes */}
          {ROADMAP.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: i % 2 === 0 ? 30 : -30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.04 * i, duration: 0.5 }}
              className="flex flex-col items-center relative shrink-0"
              style={{ width: 150 }}
            >
              {/* Connector line */}
              <div
                className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2"
                style={{
                  background: `linear-gradient(90deg, ${i === 0 ? '#00FF88' : ROADMAP[i - 1].color}, ${node.color})`,
                  opacity: 0.35,
                }}
              />

              {/* Card — even: above center line, odd: below */}
              <div
                className={`flex flex-col items-start absolute ${i % 2 === 0 ? '-top-[138px]' : 'top-[22px]'}`}
                style={{ width: 128 }}
              >
                <div className="font-mono text-[10px] text-[#64748B] mb-1">{node.year}</div>
                <div
                  className="rounded-xl p-3 border w-full transition-all duration-300 hover:scale-105 cursor-default"
                  style={{
                    borderColor: node.color + '30',
                    background:  node.color + '08',
                    boxShadow:   `0 0 12px ${node.color}15`,
                  }}
                >
                  <div className="text-lg mb-1">{node.icon}</div>
                  <div className="font-semibold text-[#E2E8F0] text-xs mb-1 leading-tight">{node.tech}</div>
                  <div className="text-[#64748B] text-[10px] leading-tight mb-2">{node.desc}</div>
                  <div
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-full inline-block"
                    style={{ background: STATUS_COLORS[node.status] + '18', color: STATUS_COLORS[node.status] }}
                  >
                    {STATUS_LABELS[node.status]}
                  </div>
                </div>
              </div>

              {/* Centre dot */}
              <div
                className="relative z-10 w-3.5 h-3.5 rounded-full border-2 shrink-0"
                style={{
                  borderColor: node.color,
                  background:  node.color + '30',
                  boxShadow:   `0 0 8px ${node.color}60`,
                }}
              />
            </motion.div>
          ))}

          {/* END node */}
          <div className="flex flex-col items-center shrink-0 ml-10">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#64748B] flex items-center justify-center text-[#64748B] font-bold text-xs animate-pulse">
              ???
            </div>
            <div className="font-mono text-xs text-[#64748B] mt-2">Future</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative px-16 mt-6">
        <div className="h-[2px] bg-[#0A0A1E] rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[#00FF88] via-[#0EA5E9] to-[#7C3AED] rounded-full origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="relative flex flex-wrap gap-4 px-16 mt-4 pb-16">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[key] }} />
            <span className="font-mono text-xs text-[#64748B]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
