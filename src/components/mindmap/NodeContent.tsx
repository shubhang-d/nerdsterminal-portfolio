'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { NodeId, NODES } from './types'

interface PanelCtx { onClose?: () => void; onNavigate?: (id: NodeId) => void }
const PanelContext = createContext<PanelCtx>({})

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ── Shared panel wrapper ──────────────────────────────────────────────────────

interface PanelProps {
  nodeId: NodeId
  children: React.ReactNode
}

function Panel({ nodeId, children }: PanelProps) {
  const node = NODES[nodeId]
  const isMobile = useIsMobile()
  const { onClose, onNavigate } = useContext(PanelContext)

  if (isMobile) {
    const navEntries = Object.entries(node.nav) as [string, NodeId][]
    const DIR_ARROWS: Record<string, string> = { up: '▲', down: '▼', left: '◀', right: '▶' }

    return (
      <motion.div
        key={nodeId}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        className="fixed inset-0 z-30 flex flex-col"
        style={{ background: '#050510' }}
      >
        {/* Header with close */}
        <div className="shrink-0 flex items-center gap-3 px-5 pt-5 pb-4 border-b"
          style={{ borderColor: `${node.color}18` }}>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-[#64748B] text-lg leading-none">←</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9px] tracking-widest mb-0.5" style={{ color: node.color }}>NODE</div>
            <div className="font-bold text-lg leading-tight truncate"
              style={{ color: node.color, textShadow: `0 0 14px ${node.color}60` }}>
              {node.label}
            </div>
            <div className="font-mono text-[11px] text-[#64748B] mt-0.5 truncate">{node.subtitle}</div>
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse shrink-0"
            style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {children}
        </div>

        {/* Footer nav */}
        {navEntries.length > 0 && onNavigate && (
          <div className="shrink-0 px-5 py-4 border-t flex gap-2 overflow-x-auto"
            style={{ borderColor: `${node.color}12`, paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <span className="font-mono text-[10px] text-[#64748B] self-center shrink-0">Go to:</span>
            {navEntries.map(([dir, targetId]) => {
              const target = NODES[targetId]
              return (
                <motion.button key={dir} onClick={() => { onNavigate(targetId); onClose?.() }}
                  whileTap={{ scale: 0.92 }}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${target.color}30`, color: target.color }}>
                  <span style={{ fontSize: 9 }}>{DIR_ARROWS[dir]}</span>
                  {target.label}
                </motion.button>
              )
            })}
          </div>
        )}
      </motion.div>
    )
  }

  // Desktop panel — slides in from right
  return (
    <motion.div
      key={nodeId}
      initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed top-0 right-0 h-full z-10 flex flex-col"
      style={{ width: 'min(480px, 45vw)', background: 'rgba(5,5,16,0.92)',
        borderLeft: `1px solid ${node.color}30`, backdropFilter: 'blur(14px)',
        boxShadow: `-20px 0 60px ${node.color}10` }}
    >
      <div className="shrink-0 px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: `${node.color}18` }}>
        <div>
          <div className="font-mono text-[9px] tracking-widest mb-0.5" style={{ color: node.color }}>NODE</div>
          <div className="font-bold text-lg tracking-wide leading-tight"
            style={{ color: node.color, textShadow: `0 0 14px ${node.color}60` }}>
            {node.label}
          </div>
          <div className="font-mono text-[11px] text-[#64748B] mt-0.5">{node.subtitle}</div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
          style={{ background: node.color, boxShadow: `0 0 10px ${node.color}` }} />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

// ── Section label helper ──────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return <div className="font-mono text-[10px] tracking-widest text-[#64748B] uppercase mb-2">{text}</div>
}

// ── HOME ──────────────────────────────────────────────────────────────────────

function HomePanel() {
  return (
    <Panel nodeId="home">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#00FF88]/40 ring-offset-2 ring-offset-[#050510]">
            <Image src="/avatar.jpg" alt="Shubhang" width={56} height={56} className="object-cover object-top w-full h-full" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00FF88] border-2 border-[#050510]" />
        </div>
        <div>
          <div className="font-bold text-white text-base">Shubhang Dixit</div>
          <div className="font-mono text-xs text-[#00FF88] mt-0.5">● Available for work</div>
          <div className="text-[#64748B] text-xs mt-0.5">Mobile Developer · Mathura, India</div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)' }}>
        <p className="text-[#94A3B8] text-sm leading-relaxed">
          &quot;Building apps for Humans&quot; — I turn ideas into polished mobile experiences using Flutter, Kotlin &amp; Swift.
        </p>
      </div>

      {/* Stats */}
      <div>
        <SectionLabel text="Stats" />
        <div className="grid grid-cols-3 gap-2">
          {[{ n: '47', l: 'Repos' }, { n: '5+', l: 'Languages' }, { n: '3+', l: 'Years' }].map(s => (
            <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: 'rgba(10,10,30,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[#00FF88] font-bold text-lg leading-none">{s.n}</div>
              <div className="text-[#64748B] font-mono text-[10px] mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div>
        <SectionLabel text="Primary Stack" />
        <div className="flex flex-wrap gap-2">
          {['Flutter', 'Kotlin', 'Swift', 'TypeScript', 'Python'].map(t => (
            <span key={t} className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: '#00FF8812', color: '#00FF88', border: '1px solid #00FF8830' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <SectionLabel text="Links" />
        <div className="space-y-2">
          {[
            { label: 'GitHub', href: 'https://github.com/shubhang-d', color: '#E2E8F0' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shubhang-dixit/', color: '#0EA5E9' },
            { label: 'nerdsterminal.com', href: 'https://nerdsterminal.com', color: '#FF6B35' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{ background: 'rgba(10,10,30,0.5)', border: `1px solid ${l.color}20` }}
            >
              <span className="font-mono text-sm" style={{ color: l.color }}>{l.label}</span>
              <span className="text-[#64748B] text-xs">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="font-mono text-[9px] text-[#64748B]/40 tracking-widest text-center pt-2">
        USE D-PAD OR ARROWS TO EXPLORE NODES
      </div>
    </Panel>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────

function AboutPanel() {
  return (
    <Panel nodeId="about">
      {/* Bio */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
        <div className="font-mono text-xs text-[#A78BFA] mb-2">$ cat about.txt</div>
        <p className="text-[#94A3B8] text-sm leading-relaxed">
          Hey, I&apos;m Shubhang — a mobile developer who believes in building apps that actually feel good to use.
          I work primarily with Flutter &amp; Dart for cross-platform, Kotlin for native Android, and Swift for iOS.
          I also dabble in TypeScript, Python, and whatever catches my curiosity at 2am.
        </p>
      </div>

      {/* Info grid */}
      <div>
        <SectionLabel text="Info" />
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Location', value: 'Mathura, India' },
            { label: 'Status', value: 'Open to work' },
            { label: 'Primary stack', value: 'Flutter + Kotlin' },
            { label: 'Also builds', value: 'TypeScript / Python' },
            { label: 'Published pkg', value: 'is_even_new' },
            { label: 'Blog', value: 'nerdsterminal.com' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-3" style={{ background: 'rgba(10,10,30,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[#64748B] font-mono text-[9px] uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-[#E2E8F0] text-xs font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently learning */}
      <div>
        <SectionLabel text="Currently Exploring" />
        <div className="flex flex-wrap gap-2">
          {['Jetpack Compose', 'SwiftUI', 'Web3', 'LangChain', 'Rust'].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ background: '#7C3AED15', color: '#A78BFA', border: '1px solid #7C3AED25' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div>
        <SectionLabel text="Community" />
        <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(10,10,30,0.5)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <span className="text-xl">🧑‍💻</span>
          <div>
            <div className="text-[#E2E8F0] text-sm font-semibold">GDGoC GLAU Organizer</div>
            <div className="text-[#64748B] text-xs mt-0.5">Leading tech events &amp; workshops at GLA University</div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

// ── SKILLS ────────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    id: 'mobile', label: 'Mobile', color: '#00FF88',
    skills: [
      { name: 'Flutter', level: 90 }, { name: 'Dart', level: 88 },
      { name: 'Kotlin', level: 82 }, { name: 'Jetpack Compose', level: 72 },
      { name: 'Swift', level: 65 }, { name: 'SwiftUI', level: 55 },
    ],
  },
  {
    id: 'web', label: 'Web', color: '#0EA5E9',
    skills: [
      { name: 'TypeScript', level: 75 }, { name: 'React / Next.js', level: 70 },
      { name: 'JavaScript', level: 74 }, { name: 'Firebase', level: 78 },
    ],
  },
  {
    id: 'ai', label: 'AI & HW', color: '#7C3AED',
    skills: [
      { name: 'Python', level: 68 }, { name: 'TensorFlow/Keras', level: 58 },
      { name: 'MediaPipe', level: 60 }, { name: 'Arduino/C++', level: 55 },
    ],
  },
]

function SkillsPanel() {
  const [activeTab, setActiveTab] = useState('mobile')
  const cat = SKILL_CATEGORIES.find(c => c.id === activeTab)!

  return (
    <Panel nodeId="skills">
      {/* Tabs */}
      <div className="flex gap-2">
        {SKILL_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className="flex-1 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer"
            style={activeTab === c.id
              ? { background: c.color, color: '#050510', fontWeight: 700 }
              : { background: 'rgba(10,10,30,0.5)', color: '#64748B', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Skill bars */}
      <div className="space-y-3">
        {cat.skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-[#E2E8F0] text-xs font-medium">{skill.name}</span>
              <span className="font-mono text-[10px] text-[#64748B]">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.7, delay: i * 0.05 + 0.1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Highlights */}
      <div>
        <SectionLabel text="Highlights" />
        <div className="grid grid-cols-2 gap-2">
          {[
            { tag: 'PUBLISHED', color: '#00FF88', title: 'pub.dev Package', desc: 'is_even_new' },
            { tag: 'HARDWARE', color: '#FF6B35', title: 'BLE + Arduino', desc: 'CSIR-NPL bridge' },
            { tag: 'AI/ML', color: '#7C3AED', title: 'Keras OCR', desc: 'High-accuracy OCR' },
            { tag: 'OPEN SOURCE', color: '#0EA5E9', title: 'GDG Contributor', desc: 'Campus Connect' },
          ].map(h => (
            <div key={h.title} className="rounded-xl p-3" style={{ background: 'rgba(10,10,30,0.5)', border: `1px solid ${h.color}15` }}>
              <div className="font-mono text-[9px] mb-1" style={{ color: h.color }}>{h.tag}</div>
              <div className="text-[#E2E8F0] text-xs font-semibold">{h.title}</div>
              <div className="text-[#64748B] text-[10px] mt-0.5">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────

const PROJECTS = [
  { name: 'Epsilon Player', tagline: 'Android Media Player', tags: ['Kotlin', 'Compose', 'Media3'], color: '#7C3AED', github: 'https://github.com/shubhang-d/Epsilon-Player', desc: 'Feature-rich media player with Jetpack Compose + ExoPlayer.' },
  { name: 'Cross Chat', tagline: 'Cross-Platform Messaging', tags: ['Flutter', 'Firebase'], color: '#0EA5E9', github: 'https://github.com/shubhang-d/Cross_Chat', desc: 'Real-time chat app running on iOS, Android and web.' },
  { name: 'CloudCode', tagline: 'AI Legacy Code Remover', tags: ['TypeScript', 'AI', 'LLM'], color: '#00FF88', github: 'https://github.com/shubhang-d/CloudCode', desc: 'Analyzes codebases for legacy patterns, suggests modern rewrites.' },
  { name: 'DoomScrollingApp', tagline: 'iOS App', tags: ['Swift', 'UIKit'], color: '#FF6B35', github: 'https://github.com/shubhang-d/DoomScrollingApp', desc: 'Native iOS app built with Swift.' },
  { name: 'CSIR-NPL BLE App', tagline: 'Hardware + Bluetooth', tags: ['Android', 'BLE', 'Arduino'], color: '#FEBC2E', github: 'https://github.com/shubhang-d/CSIR---NPL', desc: 'Reads real-time sensor data from Arduino via Bluetooth for CSIR-NPL.' },
  { name: 'Keras OCR Model', tagline: 'ML / Computer Vision', tags: ['Python', 'Keras', 'OCR'], color: '#FF6B35', github: 'https://github.com/shubhang-d/Keras-OCR-Model', desc: 'High-accuracy OCR using TensorFlow trained on custom datasets.' },
]

function ProjectsPanel() {
  return (
    <Panel nodeId="projects">
      <div className="space-y-3">
        {PROJECTS.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="block rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: 'rgba(10,10,30,0.55)', border: `1px solid ${p.color}20` }}
            whileHover={{ borderColor: `${p.color}60` }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="text-[#E2E8F0] text-sm font-semibold">{p.name}</span>
                </div>
                <span className="font-mono text-[10px] text-[#64748B]">{p.tagline}</span>
              </div>
              <span className="text-[#64748B] text-xs shrink-0">↗</span>
            </div>
            <p className="text-[#64748B] text-xs leading-relaxed mb-2">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map(t => (
                <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${p.color}12`, color: p.color }}>{t}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </Panel>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────

function ContactPanel() {
  return (
    <Panel nodeId="contact">
      {/* Tagline */}
      <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(254,188,46,0.05)', border: '1px solid rgba(254,188,46,0.12)' }}>
        <div className="text-[#E2E8F0] font-semibold text-sm mb-1">Let&apos;s build something together</div>
        <div className="text-[#64748B] text-xs">Open to freelance, full-time &amp; collabs</div>
      </div>

      {/* Email */}
      <div>
        <SectionLabel text="Email" />
        <a
          href="mailto:shubhangd205@gmail.com"
          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
          style={{ background: 'rgba(10,10,30,0.55)', border: '1px solid rgba(0,255,136,0.2)' }}
        >
          <span className="font-mono text-sm text-[#00FF88]">shubhangd205@gmail.com</span>
          <span className="text-[#64748B] text-xs">↗</span>
        </a>
      </div>

      {/* Links */}
      <div>
        <SectionLabel text="Profiles" />
        <div className="space-y-2">
          {[
            { label: 'GitHub', sub: 'github.com/shubhang-d', href: 'https://github.com/shubhang-d', color: '#E2E8F0' },
            { label: 'LinkedIn', sub: 'linkedin.com/in/shubhang-dixit', href: 'https://www.linkedin.com/in/shubhang-dixit/', color: '#0077B5' },
            { label: 'Twitter / X', sub: '@shubhang_dixit', href: 'https://twitter.com/shubhang_dixit', color: '#1DA1F2' },
            { label: 'Blog', sub: 'nerdsterminal.com', href: 'https://nerdsterminal.com', color: '#FF6B35' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
              style={{ background: 'rgba(10,10,30,0.55)', border: `1px solid ${l.color}18` }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: l.color }}>{l.label}</div>
                <div className="font-mono text-[10px] text-[#64748B] truncate">{l.sub}</div>
              </div>
              <span className="text-[#64748B] text-xs shrink-0">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <SectionLabel text="Open to" />
        <div className="space-y-1.5">
          {['Freelance mobile projects', 'Full-time Flutter/Kotlin/Swift roles', 'Open-source collaboration', 'Interesting side projects'].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span className="text-[#00FF88]">✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── TIMELINE ──────────────────────────────────────────────────────────────────

const EVENTS = [
  { year: '2021', title: 'Started Coding', icon: '🚀', color: '#00FF88', type: 'milestone', desc: 'Picked up Python, fell down the rabbit hole.' },
  { year: '2022', title: 'Android Dev', icon: '🤖', color: '#7F52FF', type: 'skill', desc: 'Native Android with Kotlin.' },
  { year: '2022', title: 'First App Shipped', icon: '📦', color: '#0EA5E9', type: 'work', desc: 'Baoiam Inventory App for Baoiam Pvt. Ltd.' },
  { year: '2023', title: 'Flutter Mastery', icon: '🦋', color: '#00B4D8', type: 'skill', desc: 'Built Cross_Chat, started cross-platform journey.' },
  { year: '2023', title: 'pub.dev Package', icon: '📦', color: '#00FF88', type: 'milestone', desc: 'Released is_even_new on pub.dev.' },
  { year: '2023', title: 'CSIR-NPL Project', icon: '⚡', color: '#FF6B35', type: 'work', desc: 'BLE hardware bridge for CSIR-NPL lab.' },
  { year: '2024', title: 'GDGoC Organizer', icon: '🧑‍💻', color: '#4285F4', type: 'community', desc: 'Leading developer community at GLA University.' },
  { year: '2024', title: 'AI & ML Exploration', icon: '🧠', color: '#7C3AED', type: 'skill', desc: 'Keras OCR, MediaPipe, CloudCode AI tool.' },
  { year: '2024', title: 'Epsilon Player', icon: '🎵', color: '#7F52FF', type: 'project', desc: 'Android media player with Compose + Media3.' },
  { year: '2025', title: 'Swift & iOS', icon: '🍎', color: '#FA7343', type: 'skill', desc: 'DoomScrollingApp ships on App Store.' },
  { year: '2026', title: 'Web3 & Rust', icon: '🔭', color: '#64748B', type: 'future', desc: 'Exploring blockchain and systems programming.' },
]

function TimelinePanel() {
  return (
    <Panel nodeId="timeline">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #00FF88, #7C3AED, transparent)' }} />

        <div className="space-y-4 pl-10">
          {EVENTS.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className="absolute -left-[2.15rem] top-2 w-3 h-3 rounded-full border-2"
                style={{ borderColor: e.color, background: `${e.color}30`, boxShadow: `0 0 6px ${e.color}60` }}
              />

              <div className="rounded-xl p-3" style={{ background: 'rgba(10,10,30,0.5)', border: `1px solid ${e.color}15` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{e.icon}</span>
                  <span className="text-[#E2E8F0] text-xs font-semibold">{e.title}</span>
                  <span className="font-mono text-[9px] ml-auto" style={{ color: e.color }}>{e.year}</span>
                </div>
                <p className="text-[#64748B] text-[11px] leading-relaxed">{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── OPEN SOURCE ───────────────────────────────────────────────────────────────

const CCEXTRACTOR_LINK = 'https://github.com/issues?q=is%3Aissue+author%3Ashubhang-d&issue=CCExtractor%7Cultimate_alarm_clock%7C721'

function OpenSourcePanel() {
  return (
    <Panel nodeId="opensource">
      <p className="text-[#94A3B8] text-sm leading-relaxed">
        Contributing to open source is how I learn, grow, and give back. Here&apos;s where my code has landed outside my own repos.
      </p>

      {/* CCExtractor card */}
      <motion.a
        href={CCEXTRACTOR_LINK}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="block rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.01]"
        style={{ background: 'rgba(10,10,30,0.55)', border: '1px solid rgba(52,211,153,0.25)', boxShadow: '0 0 30px rgba(52,211,153,0.05)' }}
        whileHover={{ borderColor: 'rgba(52,211,153,0.55)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#34D399">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="text-white font-bold text-sm">CCExtractor</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full" style={{ background: '#34D39920', color: '#34D399', border: '1px solid #34D39940' }}>Contributor</span>
          </div>
          <span className="text-[#64748B] text-xs shrink-0">↗</span>
        </div>

        <div className="font-mono text-[#64748B] text-[10px] mb-3">ultimate_alarm_clock · Issue #721</div>

        <p className="text-[#94A3B8] text-xs leading-relaxed mb-3">
          Contributed to CCExtractor&apos;s <span className="text-white">ultimate_alarm_clock</span> — an open-source alarm clock app. Opened and worked on Issue #721, collaborating with the global community.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {['Open Source', 'CCExtractor', 'Flutter', 'Issue #721'].map(t => (
            <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#34D39912', color: '#34D399', border: '1px solid #34D39930' }}>{t}</span>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 font-mono text-[10px] flex items-center gap-1.5" style={{ color: '#34D399' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          View on GitHub
        </div>
      </motion.a>

      {/* Placeholder */}
      <div className="rounded-xl p-4 text-center font-mono text-xs text-center" style={{ background: 'rgba(10,10,30,0.4)', border: '1px dashed rgba(52,211,153,0.15)' }}>
        <span className="text-[#64748B]">More contributions incoming </span>
        <span className="text-[#34D399] animate-pulse">▌</span>
      </div>
    </Panel>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────

const PANELS: Record<NodeId, React.ComponentType> = {
  home: HomePanel,
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  contact: ContactPanel,
  timeline: TimelinePanel,
  opensource: OpenSourcePanel,
}

interface Props {
  nodeId: NodeId
  traveling: boolean
  contentOpen: boolean
  onClose: () => void
  onNavigate: (id: NodeId) => void
}

export default function NodeContent({ nodeId, traveling, contentOpen, onClose, onNavigate }: Props) {
  const isMobile = useIsMobile()
  const PanelComponent = PANELS[nodeId]

  // Desktop: always show panel when not traveling
  // Mobile: only show when contentOpen
  const show = isMobile ? contentOpen && !traveling : !traveling

  return (
    <PanelContext.Provider value={{ onClose, onNavigate }}>
      <AnimatePresence mode="wait">
        {show && <PanelComponent key={`${nodeId}-${isMobile ? 'm' : 'd'}`} />}
      </AnimatePresence>
    </PanelContext.Provider>
  )
}
