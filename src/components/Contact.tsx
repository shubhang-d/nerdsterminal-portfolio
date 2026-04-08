'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

type Line = { type: 'input' | 'output' | 'error' | 'success'; text: string }

const CONTACT_COMMANDS: Record<string, Line[]> = {
  help: [
    { type: 'output', text: '' },
    { type: 'output', text: '  Available commands:' },
    { type: 'output', text: '  github        — Open GitHub profile' },
    { type: 'output', text: '  linkedin      — Open LinkedIn profile' },
    { type: 'output', text: '  twitter       — Open Twitter/X' },
    { type: 'output', text: '  blog          — Open nerdsterminal.com' },
    { type: 'output', text: '  email         — Show email address' },
    { type: 'output', text: '  hire          — Are you hiring?' },
    { type: 'output', text: '  whoami        — About Shubhang' },
    { type: 'output', text: '  clear         — Clear terminal' },
    { type: 'output', text: '' },
  ],
  github: [
    { type: 'success', text: '  → Opening github.com/shubhang-d...' },
    { type: 'output', text: '  47 public repositories' },
    { type: 'output', text: '  Flutter, Kotlin, Swift, TypeScript, Python' },
  ],
  linkedin: [
    { type: 'success', text: '  → Opening linkedin.com/in/shubhang-dixit...' },
    { type: 'output', text: '  Mobile Developer | Building apps for Humans' },
  ],
  twitter: [
    { type: 'success', text: '  → Opening @shubhang_dixit on X...' },
    { type: 'output', text: '  Tweets about tech, apps, and random nerdy stuff.' },
  ],
  blog: [
    { type: 'success', text: '  → Opening nerdsterminal.com...' },
    { type: 'output', text: '  Tech blog by Shubhang — code, apps, and more.' },
  ],
  email: [
    { type: 'output', text: '' },
    { type: 'success', text: '  ┌──────────────────────────────────────┐' },
    { type: 'success', text: '  │  shubhangd205@gmail.com              │' },
    { type: 'success', text: '  └──────────────────────────────────────┘' },
    { type: 'output', text: '' },
  ],
  hire: [
    { type: 'output', text: '' },
    { type: 'success', text: '  ✓ Yes! Open to:' },
    { type: 'output', text: '  • Freelance mobile development projects' },
    { type: 'output', text: '  • Full-time Flutter/Kotlin/Swift roles' },
    { type: 'output', text: '  • Open-source collaboration' },
    { type: 'output', text: '  • Interesting side projects' },
    { type: 'output', text: '' },
    { type: 'success', text: '  → DM on LinkedIn to chat!' },
    { type: 'output', text: '' },
  ],
  whoami: [
    { type: 'output', text: '' },
    { type: 'success', text: '  Shubhang Dixit' },
    { type: 'output', text: '  Mobile Developer from Mathura, India' },
    { type: 'output', text: '  "Building apps for Humans"' },
    { type: 'output', text: '  Flutter • Kotlin • Swift • TypeScript' },
    { type: 'output', text: '' },
  ],
}

const OPEN_LINKS: Record<string, string> = {
  github: 'https://github.com/shubhang-d',
  linkedin: 'https://www.linkedin.com/in/shubhang-dixit/',
  twitter: 'https://twitter.com/shubhang_dixit',
  blog: 'https://nerdsterminal.com',
  email: 'mailto:shubhangd205@gmail.com',
}

export default function Contact() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '' },
    { type: 'output', text: '  ╔════════════════════════════════╗' },
    { type: 'output', text: '  ║    SHUBHANG CONTACT TERMINAL   ║' },
    { type: 'output', text: '  ╚════════════════════════════════╝' },
    { type: 'output', text: '' },
    { type: 'output', text: '  Type "help" to see all commands.' },
    { type: 'output', text: '' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    const inputLine: Line = { type: 'input', text: raw }

    if (cmd === 'clear') {
      setLines([{ type: 'output', text: '  Cleared. Type "help" to start.' }])
      setCmdHistory(p => [raw, ...p])
      setCmdIndex(-1)
      return
    }

    const result = CONTACT_COMMANDS[cmd]
    if (result) {
      setLines(prev => [...prev, inputLine, ...result])
      if (OPEN_LINKS[cmd]) {
        setTimeout(() => window.open(OPEN_LINKS[cmd], '_blank'), 500)
      }
    } else {
      setLines(prev => [
        ...prev,
        inputLine,
        { type: 'error', text: `  command not found: ${cmd}` },
        { type: 'output', text: '  Try "help" for available commands.' },
      ])
    }

    setCmdHistory(p => [raw, ...p])
    setCmdIndex(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      setInput(cmdHistory[next] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIndex - 1, -1)
      setCmdIndex(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  return (
    <section id="contact" ref={ref} className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,255,136,0.07) 0%, transparent 60%)' }} />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="font-mono text-[#00FF88] text-sm mb-3">06 — CONTACT</div>
          <h2 className="section-heading text-white">
            Let&apos;s <span className="gradient-text">Build</span> Together
          </h2>
          <p className="text-[#64748B] mt-3">Use the terminal below to reach out or explore links.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Terminal */}
          <div
            className="rounded-xl overflow-hidden border border-[#00FF88]/20 shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(0,255,136,0.1)' }}
          >
            {/* Title bar */}
            <div className="bg-[#0A0A1A] flex items-center gap-2 px-4 py-3 border-b border-[#00FF88]/10">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 font-mono text-xs text-[#64748B]">shubhang@nerdsterminal — contact</span>
              <div className="ml-auto flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="font-mono text-xs text-[#00FF88]">online</span>
              </div>
            </div>

            {/* Output */}
            <div
              className="bg-[#050510]/95 p-5 font-mono text-sm min-h-[300px] max-h-[420px] overflow-y-auto cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className={`leading-6 text-xs ${
                  line.type === 'input' ? 'mb-0' : 'mb-0'
                }`}>
                  {line.type === 'input' ? (
                    <div>
                      <span className="text-[#00FF88]">shubhang</span>
                      <span className="text-[#64748B]">@nerdsterminal</span>
                      <span className="text-[#E2E8F0]">:~$ </span>
                      <span className="text-[#E2E8F0]">{line.text}</span>
                    </div>
                  ) : line.type === 'success' ? (
                    <div className="text-[#00FF88]">{line.text}</div>
                  ) : line.type === 'error' ? (
                    <div className="text-[#FF5F57]">{line.text}</div>
                  ) : (
                    <div className={line.text === '' ? 'h-3' : 'text-[#94A3B8]'}>{line.text}</div>
                  )}
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center">
                <span className="text-[#00FF88]">shubhang</span>
                <span className="text-[#64748B]">@nerdsterminal</span>
                <span className="text-[#E2E8F0]">:~$ </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent outline-none text-[#E2E8F0] ml-1 caret-[#00FF88]"
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
                <span className="text-[#00FF88] animate-[blink_1s_step-end_infinite]">█</span>
              </div>
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {[
              { cmd: 'github', label: 'GitHub', color: '#E2E8F0' },
              { cmd: 'linkedin', label: 'LinkedIn', color: '#0077B5' },
              { cmd: 'twitter', label: 'Twitter / X', color: '#1DA1F2' },
              { cmd: 'email', label: 'Email', color: '#00FF88' },
              { cmd: 'hire', label: 'Hire me?', color: '#7C3AED' },
              { cmd: 'blog', label: 'Blog', color: '#FF6B35' },
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => { runCommand(item.cmd) }}
                className="font-mono text-xs px-4 py-2 rounded-full border transition-all cursor-pointer hover:scale-105"
                style={{ borderColor: item.color + '30', color: item.color, background: item.color + '08' }}
              >
                $ {item.cmd}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative mt-24 pt-8 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#64748B]">
            <span className="text-[#00FF88]">Shubhang Dixit</span> — Building apps for Humans
          </div>
          <div className="font-mono text-xs text-[#64748B]">
            Built with Next.js, Three.js & Framer Motion
          </div>
          <div className="font-mono text-xs text-[#64748B]">
            © 2026 — <a href="https://nerdsterminal.com" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">nerdsterminal.com</a>
          </div>
        </div>
      </div>
    </section>
  )
}
