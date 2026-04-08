'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import ProfilePhoto from './ProfilePhoto'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

const ROLES = [
  'Mobile Developer',
  'Flutter Engineer',
  'Kotlin/Android Dev',
  'Swift/iOS Builder',
  'Building apps for Humans',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayedRole, setDisplayedRole] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const role = ROLES[roleIndex]
    let i = 0
    setDisplayedRole('')

    if (typing) {
      const interval = setInterval(() => {
        i++
        setDisplayedRole(role.slice(0, i))
        if (i >= role.length) {
          clearInterval(interval)
          setTimeout(() => setTyping(false), 1800)
        }
      }, 55)
      return () => clearInterval(interval)
    } else {
      let j = role.length
      const interval = setInterval(() => {
        j--
        setDisplayedRole(role.slice(0, j))
        if (j <= 0) {
          clearInterval(interval)
          setRoleIndex(prev => (prev + 1) % ROLES.length)
          setTyping(true)
        }
      }, 30)
      return () => clearInterval(interval)
    }
  }, [roleIndex, typing])

  const scrollToNext = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative h-screen flex items-center overflow-hidden">
      {/* 3D Scene background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 z-[1]" />

      {/* Radial gradient center */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(0,255,136,0.07) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left: text */}
        <div className="max-w-2xl w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/5 text-[#00FF88] font-mono text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            Available for freelance & collaboration
          </motion.div>

          {/* Name — glitch effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, type: 'spring' }}
          >
            <h1
              className="glitch section-heading text-white leading-none mb-2"
              data-text="SHUBHANG"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}
            >
              SHUBHANG
            </h1>
            <h1
              className="section-heading gradient-text leading-none mb-6"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}
            >
              DIXIT
            </h1>
          </motion.div>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-mono text-lg md:text-xl text-[#64748B] mb-3 h-8"
          >
            <span className="text-[#0EA5E9]">$ </span>
            <span className="text-[#E2E8F0]">{displayedRole}</span>
            <span className="text-[#00FF88] animate-[blink_1s_step-end_infinite]">█</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-[#64748B] text-base md:text-lg max-w-md mb-10 leading-relaxed"
          >
            Crafting pixel-perfect mobile experiences with Flutter, Kotlin & Swift.
            Based in <span className="text-[#E2E8F0]">Mathura, India</span> — shipping code to the world.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-[#00FF88] text-[#050510] font-semibold rounded-full hover:bg-[#00DD77] transition-all hover:scale-105 cursor-pointer glow-green text-sm"
            >
              View Projects
            </button>
            <a
              href="https://github.com/shubhang-d"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#00FF88]/40 text-[#00FF88] font-semibold rounded-full hover:bg-[#00FF88]/10 transition-all hover:scale-105 cursor-pointer text-sm"
            >
              GitHub Profile
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-4"
          >
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="text-[#64748B] hover:text-[#00FF88] transition-colors cursor-pointer"
              >
                {s.icon}
              </a>
            ))}
            <div className="h-px w-24 bg-gradient-to-r from-[#64748B]/40 to-transparent ml-2" />
            <span className="font-mono text-xs text-[#64748B]">@shubhang_dixit</span>
          </motion.div>
        </div>

        {/* Right: profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.9, type: 'spring', stiffness: 80 }}
          className="hidden lg:flex items-center justify-center shrink-0"
          style={{ paddingBottom: 48 }}
        >
          <ProfilePhoto />
        </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#64748B] hover:text-[#00FF88] transition-colors cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-mono text-xs">scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <circle cx="8" cy="7" r="2" fill="currentColor" className="animate-bounce" />
        </svg>
      </motion.button>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col gap-3"
      >
        {[
          { num: '47', label: 'Repositories' },
          { num: '5+', label: 'Languages' },
          { num: '3+', label: 'Years Coding' },
        ].map(s => (
          <div key={s.label} className="text-right">
            <div className="text-[#00FF88] font-bold text-lg leading-none">{s.num}</div>
            <div className="text-[#64748B] font-mono text-xs">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/shubhang-d',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shubhang-dixit/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/shubhang_dixit',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'nerdsterminal.com',
    href: 'https://nerdsterminal.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l3 3-3 3M13 14h4" />
      </svg>
    ),
  },
]
