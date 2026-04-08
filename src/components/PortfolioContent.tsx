'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BootScreen from './BootScreen'
import Navigation from './Navigation'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Timeline from './Timeline'
import Contact from './Contact'

const TechRoadmap = dynamic(() => import('./TechRoadmap'), { ssr: false })
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false })

export default function PortfolioContent() {
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    // Prevent browser from restoring previous scroll position
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Connect Lenis to GSAP so ScrollTrigger stays in sync
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {!bootDone && <BootScreen onComplete={() => setBootDone(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={bootDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Noise overlay */}
        <div className="noise-overlay" />

        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <TechRoadmap />
        <Timeline />
        <Contact />
      </motion.div>
    </>
  )
}
