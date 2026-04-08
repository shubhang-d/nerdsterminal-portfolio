'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

type HistoryEntry = { cmd: string; output: string[] }

const COMMANDS: Record<string, string[]> = {
  help: [
    '  Available commands:',
    '  whoami         — Who is Shubhang?',
    '  cat about.txt  — Read the full bio',
    '  ls skills/     — List all skills',
    '  ls projects/   — List top projects',
    '  cat contact    — Get contact info',
    '  clear          — Clear terminal',
  ],
  whoami: [
    '  Shubhang Dixit',
    '  Mobile Developer | GDGoC GLAU Organizer | Builder',
    '  Location: Mathura, India',
    '  Blog: nerdsterminal.com',
  ],
  'cat about.txt': [
    '  Hey, I\'m Shubhang — a mobile developer who believes',
    '  in building apps that actually feel good to use.',
    '',
    '  I work primarily with Flutter & Dart for cross-platform,',
    '  Kotlin for native Android, and Swift for iOS.',
    '  I also dabble in TypeScript, Python, and whatever',
    '  catches my curiosity at 2am.',
    '',
    '  I built a Flutter pub.dev package (is_even_new),',
    '  made a media player with Jetpack Compose + Media3,',
    '  built a Bluetooth hardware app for CSIR-NPL,',
    '  and I\'m always cooking something new.',
    '',
    '  Bio: "Building apps for Humans"',
  ],
  'ls skills/': [
    '  drwxr-xr-x  Flutter/Dart',
    '  drwxr-xr-x  Kotlin/Android',
    '  drwxr-xr-x  Swift/iOS',
    '  drwxr-xr-x  TypeScript/React/Next.js',
    '  drwxr-xr-x  Python/ML',
    '  drwxr-xr-x  Jetpack Compose',
    '  drwxr-xr-x  Firebase/Backend',
    '  drwxr-xr-x  Hardware/Arduino/BLE',
  ],
  'ls projects/': [
    '  Epsilon-Player      — Android media player (Kotlin + Media3)',
    '  Cross_Chat          — Cross-platform chat (Flutter)',
    '  CloudCode           — AI legacy code remover (TypeScript)',
    '  DoomScrollingApp    — iOS app (Swift)',
    '  CSIR-NPL            — BLE hardware bridge (Arduino+Android)',
    '  is_even_new         — Flutter package on pub.dev',
    '  Keras-OCR-Model     — ML/OCR model (Python)',
    '  BinaryClock         — Binary clock (JavaScript)',
  ],
  'cat contact': [
    '  Email:    shubhangd205@gmail.com',
    '  GitHub:   github.com/shubhang-d',
    '  LinkedIn: linkedin.com/in/shubhang-dixit',
    '  Twitter:  @shubhang_dixit',
    '  Blog:     nerdsterminal.com',
  ],
}

export default function About() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { cmd: '', output: ['  Type "help" to explore...', ''] },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setHistory([{ cmd: '', output: ['  Cleared. Type "help" to start.'] }])
      setCmdHistory(p => [raw, ...p])
      setCmdIndex(-1)
      return
    }

    const output = COMMANDS[cmd]
      ? [...COMMANDS[cmd]]
      : [`  command not found: ${cmd}`, '  Try "help" for available commands.']

    setHistory(prev => [...prev, { cmd: raw, output }])
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
    <section id="about" ref={sectionRef} className="relative py-32 px-6 md:px-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-[#00FF88] text-sm mb-3">01 — ABOUT</div>
          <h2 className="section-heading text-white">
            The <span className="gradient-text">Nerd</span> Behind<br />the Screen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Terminal window */}
            <div className="rounded-xl overflow-hidden border border-[#00FF88]/20 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(0,255,136,0.1)' }}>
              {/* Title bar */}
              <div className="bg-[#0A0A1A] flex items-center gap-2 px-4 py-3 border-b border-[#00FF88]/10">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-4 font-mono text-xs text-[#64748B]">shubhang@nerdsterminal ~ </span>
              </div>

              {/* Output */}
              <div
                className="bg-[#050510]/90 p-4 font-mono text-sm min-h-[320px] max-h-[400px] overflow-y-auto cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                <div className="text-[#00FF88] mb-2 text-xs">Welcome to Shubhang's Terminal v2.0</div>
                {history.map((entry, i) => (
                  <div key={i} className="mb-1">
                    {entry.cmd && (
                      <div>
                        <span className="text-[#00FF88]">shubhang</span>
                        <span className="text-[#64748B]">@nerdsterminal</span>
                        <span className="text-[#E2E8F0]">:~$ </span>
                        <span className="text-[#E2E8F0]">{entry.cmd}</span>
                      </div>
                    )}
                    {entry.output.map((line, j) => (
                      <div key={j} className={line.trim() === '' ? 'h-2' : 'text-[#94A3B8] text-xs leading-5'}>{line}</div>
                    ))}
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
                  />
                  <span className="text-[#00FF88] animate-[blink_1s_step-end_infinite]">█</span>
                </div>
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Quick command pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['whoami', 'cat about.txt', 'ls skills/', 'ls projects/'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => { runCommand(cmd) }}
                  className="font-mono text-xs px-3 py-1 rounded-full border border-[#00FF88]/20 text-[#64748B] hover:text-[#00FF88] hover:border-[#00FF88]/50 transition-all cursor-pointer"
                >
                  $ {cmd}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="space-y-6"
          >
            {/* Avatar + name */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#00FF88]/40 ring-offset-2 ring-offset-[#0A0A1A]">
                    <Image src="/avatar.jpg" alt="Shubhang Dixit" width={64} height={64} className="object-cover object-top w-full h-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00FF88] border-2 border-[#050510]" />
                </div>
                <div>
                  <div className="font-bold text-lg text-white">Shubhang Dixit</div>
                  <div className="text-[#64748B] text-sm">Mobile Developer · GDGoC GLAU Organizer</div>
                  <div className="text-[#00FF88] font-mono text-xs mt-1">● Available for work</div>
                </div>
              </div>

              <p className="text-[#94A3B8] text-sm leading-relaxed">
                &quot;Building apps for Humans&quot; — I love turning ideas into polished mobile experiences.
                From BLE hardware integration to AI-powered tools, I explore the full stack of what&apos;s possible.
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {INFO_ITEMS.map(item => (
                <div key={item.label} className="glass-card rounded-xl p-4">
                  <div className="text-[#64748B] text-xs font-mono mb-1">{item.label}</div>
                  <div className="text-[#E2E8F0] text-sm font-semibold">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: '47', l: 'Repos' },
                { n: '5+', l: 'Languages' },
                { n: '3+', l: 'Years' },
              ].map(s => (
                <div key={s.l} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-[#00FF88] font-bold text-2xl">{s.n}</div>
                  <div className="text-[#64748B] font-mono text-xs">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Currently learning */}
            <div className="glass-card rounded-xl p-4">
              <div className="font-mono text-xs text-[#64748B] mb-3">Currently exploring</div>
              <div className="flex flex-wrap gap-2">
                {['Jetpack Compose', 'SwiftUI', 'Web3', 'LangChain', 'Rust'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const INFO_ITEMS = [
  { label: 'Location', value: 'Mathura, India' },
  { label: 'Status', value: 'Open to work' },
  { label: 'Primary stack', value: 'Flutter + Kotlin' },
  { label: 'Also builds', value: 'TypeScript / Python' },
  { label: 'Published pkg', value: 'is_even_new (pub.dev)' },
  { label: 'Blog', value: 'nerdsterminal.com' },
]
