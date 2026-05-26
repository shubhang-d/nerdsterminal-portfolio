'use client'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { NodeId } from './types'
import About from '../About'
import Skills from '../Skills'
import Projects from '../Projects'
import Contact from '../Contact'

const Timeline = dynamic(() => import('../Timeline'), { ssr: false })

const CCEXTRACTOR_LINK =
  'https://github.com/issues?q=is%3Aissue+author%3Ashubhang-d&issue=CCExtractor%7Cultimate_alarm_clock%7C721'

function OpenSourceContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="font-mono text-[#34D399] text-sm mb-3 tracking-widest">07 — OPEN SOURCE</div>
          <h2 className="text-white font-bold leading-none mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
            Giving Back to the{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #34D399, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Community
            </span>
          </h2>
          <p className="text-[#64748B] text-base leading-relaxed max-w-xl">
            Contributing to open source is how I learn, grow, and give back. Here&apos;s where my code has landed outside my own repos.
          </p>
        </motion.div>

        {/* CCExtractor card */}
        <motion.a
          href={CCEXTRACTOR_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="block rounded-2xl p-6 md:p-8 cursor-pointer group"
          style={{
            background: 'rgba(10,10,30,0.6)',
            border: '1px solid rgba(52,211,153,0.25)',
            boxShadow: '0 0 40px rgba(52,211,153,0.07)',
            backdropFilter: 'blur(8px)',
          }}
          whileHover={{
            borderColor: 'rgba(52,211,153,0.6)',
            boxShadow: '0 0 60px rgba(52,211,153,0.15)',
          }}
        >
          <div className="flex items-start justify-between gap-6 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* GitHub icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#34D399">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="font-bold text-white text-lg">CCExtractor</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: '#34D39920', color: '#34D399', border: '1px solid #34D39940' }}>
                  Contributor
                </span>
              </div>
              <div className="font-mono text-[#64748B] text-sm">ultimate_alarm_clock · Issue #721</div>
            </div>

            {/* Arrow */}
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: '#34D39915', border: '1px solid #34D39940' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>
          </div>

          <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
            Contributed to <span className="text-white font-medium">CCExtractor&apos;s ultimate_alarm_clock</span> — an open-source alarm clock app.
            Opened and worked on Issue #721, collaborating with the global CCExtractor community on improving the project.
          </p>

          <div className="flex flex-wrap gap-2">
            {['Open Source', 'CCExtractor', 'Flutter', 'Community', 'Issue #721'].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full font-mono"
                style={{ background: '#34D39912', color: '#34D399', border: '1px solid #34D39930' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-white/5 font-mono text-xs text-[#34D399] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            View on GitHub →
          </div>
        </motion.a>

        {/* More coming soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-xl p-5 font-mono text-sm text-center"
          style={{ background: 'rgba(10,10,30,0.4)', border: '1px dashed rgba(52,211,153,0.15)' }}
        >
          <span className="text-[#64748B]">More contributions incoming </span>
          <span className="text-[#34D399] animate-pulse">▌</span>
        </motion.div>
      </div>
    </div>
  )
}

function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
      >
        <div className="font-mono text-[#00FF88] text-sm mb-4 tracking-widest">
          ● AVAILABLE FOR FREELANCE & COLLABORATION
        </div>
        <h1
          className="font-bold leading-none mb-2 tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            color: '#fff',
            textShadow: '0 0 40px rgba(0,255,136,0.3)',
          }}
        >
          SHUBHANG
        </h1>
        <h1
          className="font-bold leading-none mb-8 tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            background: 'linear-gradient(135deg, #00FF88, #0EA5E9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          DIXIT
        </h1>

        <p className="font-mono text-[#64748B] text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          <span className="text-[#0EA5E9]">$ </span>
          Mobile Developer · Flutter · Kotlin · Swift
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <a
            href="https://github.com/shubhang-d"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[#00FF88]/40 text-[#00FF88] font-semibold rounded-full hover:bg-[#00FF88]/10 transition-all text-sm font-mono"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/shubhang-dixit/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[#0EA5E9]/40 text-[#0EA5E9] font-semibold rounded-full hover:bg-[#0EA5E9]/10 transition-all text-sm font-mono"
          >
            LinkedIn
          </a>
          <a
            href="https://nerdsterminal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[#7C3AED]/40 text-[#A78BFA] font-semibold rounded-full hover:bg-[#7C3AED]/10 transition-all text-sm font-mono"
          >
            Blog
          </a>
        </div>

        <div className="font-mono text-[#64748B] text-xs tracking-widest animate-pulse">
          ↑ ↓ ← → USE D-PAD TO EXPLORE
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-10 mt-16"
      >
        {[
          { n: '47', l: 'Repositories' },
          { n: '5+', l: 'Languages' },
          { n: '3+', l: 'Years Coding' },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-[#00FF88] font-bold text-2xl leading-none">{s.n}</div>
            <div className="text-[#64748B] font-mono text-xs mt-1">{s.l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const CONTENT: Record<NodeId, React.ComponentType> = {
  home: HomeContent,
  about: About,
  skills: Skills,
  projects: Projects,
  contact: Contact,
  timeline: Timeline,
  opensource: OpenSourceContent,
}

interface Props {
  nodeId: NodeId
  traveling: boolean
}

export default function NodeContent({ nodeId, traveling }: Props) {
  const Component = CONTENT[nodeId]

  return (
    <AnimatePresence mode="wait">
      {!traveling && (
        <motion.div
          key={nodeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="fixed inset-0 z-10 overflow-y-auto pointer-events-auto"
          style={{
            background: 'rgba(5,5,16,0.82)',
            backdropFilter: 'blur(1px)',
          }}
        >
          <Component />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
