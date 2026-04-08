'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = () => { ring.style.transform += ' scale(1.8)'; ring.style.opacity = '0.5' }
    const onLeave = () => { ring.style.transform = ring.style.transform.replace(' scale(1.8)', ''); ring.style.opacity = '1' }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#00FF88] rounded-full z-[9999] pointer-events-none mix-blend-difference"
        style={{ transition: 'none', willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#00FF88]/60 rounded-full z-[9999] pointer-events-none"
        style={{ transition: 'opacity 0.3s, scale 0.3s', willChange: 'transform' }}
      />
    </>
  )
}
