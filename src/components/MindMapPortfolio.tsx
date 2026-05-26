'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import BootScreen from './BootScreen'
import { NodeId, Direction, NODES } from './mindmap/types'

const MindMapWorld = dynamic(() => import('./mindmap/MindMapWorld'), { ssr: false })
const MindMapHUD   = dynamic(() => import('./mindmap/MindMapHUD'),   { ssr: false })
const NodeContent  = dynamic(() => import('./mindmap/NodeContent'),  { ssr: false })
const CustomCursor = dynamic(() => import('./CustomCursor'),         { ssr: false })

const TRAVEL_MS = 1600
const KEY_DIR_MAP: Record<string, Direction> = {
  ArrowUp: 'up',   w: 'up',    W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

export default function MindMapPortfolio() {
  const [bootDone,     setBootDone]     = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState<NodeId>('home')
  const [traveling,    setTraveling]    = useState(false)
  const [visitedNodes, setVisitedNodes] = useState<Set<NodeId>>(new Set(['home']))
  const [contentOpen,  setContentOpen]  = useState(false)   // mobile: info panel open
  const travelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useCallback((targetId: NodeId) => {
    if (traveling || targetId === currentNodeId) return
    setContentOpen(false)           // close panel when starting travel
    setTraveling(true)
    setCurrentNodeId(targetId)

    if (travelTimeout.current) clearTimeout(travelTimeout.current)
    travelTimeout.current = setTimeout(() => {
      setTraveling(false)
      setVisitedNodes(prev => new Set([...prev, targetId]))
    }, TRAVEL_MS)
  }, [traveling, currentNodeId])

  // Keyboard navigation (desktop)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const dir = KEY_DIR_MAP[e.key]
      if (!dir) return
      const targetId = NODES[currentNodeId].nav[dir]
      if (targetId) navigate(targetId)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentNodeId, navigate])

  useEffect(() => () => { if (travelTimeout.current) clearTimeout(travelTimeout.current) }, [])

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
        className="fixed inset-0"
      >
        <div className="noise-overlay" />

        {/* 3D world */}
        <div className="fixed inset-0 z-0">
          <MindMapWorld currentNodeId={currentNodeId} onNavigate={navigate} />
        </div>

        {/* Content panel */}
        <NodeContent
          nodeId={currentNodeId}
          traveling={traveling}
          contentOpen={contentOpen}
          onClose={() => setContentOpen(false)}
          onNavigate={navigate}
        />

        {/* HUD */}
        <MindMapHUD
          currentNodeId={currentNodeId}
          onNavigate={navigate}
          visitedNodes={visitedNodes}
          traveling={traveling}
          onOpenContent={() => setContentOpen(true)}
          contentOpen={contentOpen}
        />

        {/* Travel scanline */}
        <AnimatePresence>
          {traveling && (
            <motion.div
              className="fixed inset-0 z-30 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)' }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
