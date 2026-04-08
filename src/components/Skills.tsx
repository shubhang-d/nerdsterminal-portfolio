'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import dynamic from 'next/dynamic'

const SkillsScene3D = dynamic(() => import('./SkillsScene3D'), { ssr: false })

const SKILL_CATEGORIES = [
  {
    id: 'mobile',
    label: 'Mobile',
    color: '#00FF88',
    skills: [
      { name: 'Flutter', level: 90, icon: '🦋', desc: 'Cross-platform apps' },
      { name: 'Dart', level: 88, icon: '🎯', desc: 'Flutter language' },
      { name: 'Kotlin', level: 82, icon: '🟣', desc: 'Native Android' },
      { name: 'Swift', level: 65, icon: '🍎', desc: 'Native iOS' },
      { name: 'Jetpack Compose', level: 72, icon: '🏗️', desc: 'Modern Android UI' },
      { name: 'SwiftUI', level: 55, icon: '📱', desc: 'Modern iOS UI' },
    ],
  },
  {
    id: 'web',
    label: 'Web & Backend',
    color: '#0EA5E9',
    skills: [
      { name: 'TypeScript', level: 75, icon: '📘', desc: 'Typed JavaScript' },
      { name: 'React / Next.js', level: 70, icon: '⚛️', desc: 'Web frameworks' },
      { name: 'JavaScript', level: 74, icon: '🟡', desc: 'Web scripting' },
      { name: 'Node.js', level: 62, icon: '🟢', desc: 'Server-side JS' },
      { name: 'Firebase', level: 78, icon: '🔥', desc: 'BaaS platform' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Hardware',
    color: '#7C3AED',
    skills: [
      { name: 'Python', level: 68, icon: '🐍', desc: 'Scripting & ML' },
      { name: 'TensorFlow/Keras', level: 58, icon: '🧠', desc: 'ML models' },
      { name: 'MediaPipe', level: 60, icon: '👁️', desc: 'Vision AI' },
      { name: 'Arduino/C++', level: 55, icon: '⚡', desc: 'Hardware + BLE' },
      { name: 'LangChain', level: 45, icon: '🔗', desc: 'LLM chaining' },
    ],
  },
]

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-[#E2E8F0] text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-[#64748B]">{level}%</span>
      </div>
      <div className="h-1.5 bg-[#0A0A1E] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}


export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('mobile')

  const active = SKILL_CATEGORIES.find(c => c.id === activeTab)!

  return (
    <section id="skills" ref={ref} className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-[#0EA5E9] text-sm mb-3">02 — SKILLS</div>
          <h2 className="section-heading text-white">
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: skill bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Category tabs */}
            <div className="flex gap-2 mb-8">
              {SKILL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-full font-mono text-xs transition-all cursor-pointer ${
                    activeTab === cat.id
                      ? 'text-[#050510] font-bold'
                      : 'text-[#64748B] border border-[#ffffff10] hover:text-[#E2E8F0]'
                  }`}
                  style={activeTab === cat.id ? { background: cat.color } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {active.skills.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} color={active.color} delay={0.1 + i * 0.08} />
            ))}
          </motion.div>

          {/* Right: orbit + extra info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-center gap-10"
          >
            <SkillsScene3D />

            {/* Additional info cards */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {HIGHLIGHTS.map(h => (
                <div key={h.title} className="glass-card rounded-xl p-4">
                  <div className="text-xs font-mono mb-1" style={{ color: h.color }}>{h.tag}</div>
                  <div className="text-[#E2E8F0] text-sm font-semibold">{h.title}</div>
                  <div className="text-[#64748B] text-xs mt-1">{h.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const HIGHLIGHTS = [
  { tag: 'PUBLISHED', color: '#00FF88', title: 'pub.dev Package', desc: 'is_even_new — Flutter package' },
  { tag: 'HARDWARE', color: '#FF6B35', title: 'BLE + Arduino', desc: 'CSIR-NPL hardware bridge' },
  { tag: 'AI/ML', color: '#7C3AED', title: 'Keras OCR Model', desc: 'High-accuracy OCR with Python' },
  { tag: 'OPEN SOURCE', color: '#0EA5E9', title: 'GDG Contributor', desc: 'GDG Campus Connect app' },
]
