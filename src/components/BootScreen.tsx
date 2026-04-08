'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  { text: 'SHUBHANG OS v2.0 — initializing...', delay: 0 },
  { text: '  [OK] Mounting creativity engine...', delay: 300 },
  { text: '  [OK] Loading Flutter SDK 3.x...', delay: 600 },
  { text: '  [OK] Android/Kotlin runtime...', delay: 900 },
  { text: '  [OK] Swift/iOS bridge connected...', delay: 1100 },
  { text: '  [OK] ML models initialized...', delay: 1300 },
  { text: '  [OK] Connecting to GitHub (47 repos)...', delay: 1500 },
  { text: '  [OK] nerdsterminal.com online...', delay: 1700 },
  { text: '', delay: 1900 },
  { text: '██████████████████████  100%', delay: 2000 },
  { text: '', delay: 2100 },
  { text: '  Welcome. Building apps for Humans.', delay: 2200 },
]

interface Props { onComplete: () => void }

export default function BootScreen({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100))
      }, line.delay)
    })

    setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 800)
    }, 3200)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[9999] bg-[#050510] flex flex-col items-center justify-center"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Scan line */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-10"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)' }}
          />

          <div className="w-full max-w-2xl px-8">
            {/* Header */}
            <div className="mb-8 border border-[#00FF88]/30 rounded-sm p-4">
              <div className="text-[#00FF88] font-mono text-xs mb-1">BIOS v2.0 — Shubhang Development Machine</div>
              <div className="text-[#64748B] font-mono text-xs">CPU: Creative Cortex  |  RAM: ∞ Ideas  |  GPU: Vision Engine</div>
            </div>

            {/* Terminal lines */}
            <div className="font-mono text-sm space-y-1 min-h-[280px]">
              {BOOT_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`transition-opacity duration-200 ${visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'}`}
                >
                  {line.text.includes('[OK]') ? (
                    <span>
                      <span className="text-[#64748B]">  [</span>
                      <span className="text-[#00FF88]">OK</span>
                      <span className="text-[#64748B]">]</span>
                      <span className="text-[#E2E8F0]">{line.text.replace('  [OK]', '')}</span>
                    </span>
                  ) : line.text.includes('█') ? (
                    <span className="text-[#00FF88]">{line.text}</span>
                  ) : line.text.includes('Welcome') ? (
                    <span className="text-[#00FF88] font-bold text-base">{line.text}</span>
                  ) : (
                    <span className="text-[#E2E8F0]">{line.text}</span>
                  )}
                </div>
              ))}
              {visibleLines.length < BOOT_LINES.length && (
                <div className="text-[#00FF88] font-mono animate-pulse">_</div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="h-[2px] bg-[#0A0A1E] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00FF88] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-xs text-[#64748B]">Loading portfolio...</span>
                <span className="font-mono text-xs text-[#00FF88]">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#00FF88]/50" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#00FF88]/50" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#00FF88]/50" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#00FF88]/50" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
