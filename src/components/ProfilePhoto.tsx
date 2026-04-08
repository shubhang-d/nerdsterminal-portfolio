'use client'
import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'

const BADGES = [
  { label: 'Flutter',  color: '#00B4D8', angle:  18, r: 210 },
  { label: 'Kotlin',   color: '#7F52FF', angle:  88, r: 208 },
  { label: 'Swift',    color: '#FA7343', angle: 158, r: 212 },
  { label: 'pub.dev',  color: '#00FF88', angle: 228, r: 208 },
  { label: 'React',    color: '#61DAFB', angle: 298, r: 210 },
]

export default function ProfilePhoto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawY, { stiffness: 80, damping: 18 })
  const rotateY = useSpring(rawX, { stiffness: 80, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 18)
    rawY.set(((e.clientY - rect.top  - rect.height / 2) / rect.height) * -18)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0); setHovered(false) }

  return (
    /* Outer wrapper — large enough to fit badges */
    <div className="relative flex items-center justify-center" style={{ width: 440, height: 440 }}>

      {/* ── Outermost dashed glow ring (pure border, no photo) ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 10,
          border: '1.5px dashed rgba(0,255,136,0.25)',
          boxShadow: '0 0 20px rgba(0,255,136,0.08)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Soft ambient glow behind photo ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340, height: 340,
          boxShadow: '0 0 60px rgba(0,255,136,0.30), 0 0 130px rgba(124,58,237,0.18)',
        }}
      />

      {/* ── Photo circle (tiltable) ── */}
      <motion.div
        ref={containerRef}
        className="relative z-10 rounded-full overflow-hidden cursor-pointer"
        style={{
          width: 320, height: 320,
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* The actual photo */}
        <Image
          src="/avatar.jpg"
          alt="Shubhang Dixit"
          fill
          className="object-cover object-top"
          priority
          sizes="320px"
        />

        {/* Subtle scanline texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.03) 3px, rgba(0,255,136,0.03) 4px)',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.4s',
          }}
        />

        {/* Glossy shine */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse 55% 35% at 28% 18%, rgba(255,255,255,0.10), transparent 65%)' }}
        />

        {/* Hover: green edge vignette */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, transparent 38%, rgba(0,255,136,0.22) 100%)' }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Hover: scan sweep */}
        {hovered && (
          <motion.div
            className="absolute left-0 right-0 h-14 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.10), transparent)' }}
            initial={{ top: '-15%' }}
            animate={{ top: '115%' }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Corner target brackets */}
        {(['top-3 left-3 border-t-2 border-l-2','top-3 right-3 border-t-2 border-r-2','bottom-3 left-3 border-b-2 border-l-2','bottom-3 right-3 border-b-2 border-r-2'] as const).map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute w-5 h-5 border-[#00FF88] ${cls}`}
            animate={{ opacity: hovered ? 1 : 0.35 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </motion.div>

      {/* ── Spinning conic-gradient ring — sits ON TOP of photo edges via mask ── */}
      <motion.div
        className="absolute z-20 rounded-full pointer-events-none"
        style={{
          width: 328, height: 328,
          background: 'conic-gradient(from 0deg, #00FF88, #0EA5E9, #7C3AED, #FF6B35, #00FF88)',
          /* mask punches out the center so only a 4px ring is visible */
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Orbiting tech badges ── */}
      {BADGES.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180
        return (
          <motion.div
            key={b.label}
            className="absolute z-30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border"
            style={{
              left: `calc(50% + ${Math.cos(rad) * b.r}px)`,
              top:  `calc(50% + ${Math.sin(rad) * b.r}px)`,
              transform: 'translate(-50%, -50%)',
              borderColor: b.color + '55',
              background:  b.color + '14',
              color:        b.color,
              boxShadow:   `0 0 10px ${b.color}45`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 * i + 1.0, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.3 }}
          >
            {b.label}
          </motion.div>
        )
      })}

      {/* ── Bottom info chip ── */}
      <motion.div
        className="absolute z-30 flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00FF88]/25 bg-[#0A0A1E]/85 backdrop-blur-sm whitespace-nowrap"
        style={{ bottom: 28 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
        <span className="font-mono text-xs text-[#00FF88]">Shubhang Dixit</span>
        <span className="text-[#64748B] text-xs">·</span>
        <span className="font-mono text-xs text-[#64748B]">Mobile Dev</span>
      </motion.div>
    </div>
  )
}
