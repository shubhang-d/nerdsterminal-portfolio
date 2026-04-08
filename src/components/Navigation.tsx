'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setActive(href); setMenuOpen(false) }
  }

  return (
    <>
      <motion.nav
        className="fixed top-4 left-1/2 z-[100]"
        style={{ x: '-50%' }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 120 }}
      >
        <div className={`glass-card rounded-full px-4 py-2.5 flex items-center gap-1 transition-all duration-500 ${scrolled ? 'glow-green shadow-2xl' : ''}`}>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full bg-[#00FF88] text-[#050510] font-bold text-xs flex items-center justify-center mr-3 cursor-pointer hover:scale-110 transition-transform"
          >
            SD
          </button>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                  active === item.href
                    ? 'text-[#050510] bg-[#00FF88]'
                    : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/shubhang-d"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex ml-3 items-center gap-1.5 text-xs font-mono text-[#00FF88] border border-[#00FF88]/30 rounded-full px-3 py-1.5 hover:bg-[#00FF88]/10 transition-colors cursor-pointer"
          >
            <GitHubIcon />
            GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-2 text-[#E2E8F0] p-1 cursor-pointer"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-[#050510]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-3xl font-bold text-[#E2E8F0] hover:text-[#00FF88] transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  )
}
