'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeId, Direction, NODES } from './types'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const DIR_ARROWS: Record<Direction, string> = { up: '▲', down: '▼', left: '◀', right: '▶' }
const DIR_POSITIONS: Record<Direction, React.CSSProperties> = {
  up:    { top: 0,    left: '50%', transform: 'translateX(-50%)' },
  down:  { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  left:  { left: 0,   top: '50%',  transform: 'translateY(-50%)' },
  right: { right: 0,  top: '50%',  transform: 'translateY(-50%)' },
}
const BUTTON_SIZE = 52

interface Props {
  currentNodeId: NodeId
  onNavigate: (id: NodeId) => void
  visitedNodes: Set<NodeId>
  traveling: boolean
  onOpenContent: () => void
  contentOpen: boolean
}

function DPadButton({ dir, targetId, onNavigate }: { dir: Direction; targetId: NodeId; onNavigate: (id: NodeId) => void }) {
  const target = NODES[targetId]
  return (
    <motion.button
      onClick={() => onNavigate(targetId)}
      className="absolute flex flex-col items-center justify-center rounded-lg cursor-pointer select-none"
      style={{ ...DIR_POSITIONS[dir], width: BUTTON_SIZE, height: BUTTON_SIZE,
        background: 'rgba(5,5,16,0.8)', border: `1px solid ${target.color}45`,
        backdropFilter: 'blur(10px)' }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span style={{ color: target.color, fontSize: 13, lineHeight: 1 }}>{DIR_ARROWS[dir]}</span>
      <span style={{ color: '#64748B', fontSize: 7, fontFamily: 'monospace', marginTop: 3,
        maxWidth: 44, overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap', display: 'block', textAlign: 'center' }}>
        {target.label}
      </span>
    </motion.button>
  )
}

function MiniMap({ currentNodeId, visitedNodes, onNavigate }: { currentNodeId: NodeId; visitedNodes: Set<NodeId>; onNavigate: (id: NodeId) => void }) {
  const cx = 60, cy = 55
  const project = (pos: [number, number, number]) => ({ x: cx + pos[0] * 2.1, y: cy - pos[1] * 2.1 })
  return (
    <div className="pointer-events-auto" style={{
      width: 120, height: 120, background: 'rgba(5,5,16,0.75)',
      border: '1px solid rgba(0,255,136,0.12)', borderRadius: 10,
      backdropFilter: 'blur(8px)', overflow: 'hidden' }}>
      <div className="font-mono text-[7px] text-[#64748B] px-2 pt-1.5 tracking-widest">MAP</div>
      <svg width="120" height="105" style={{ position: 'absolute', top: 15, left: 0 }}>
        {(Object.keys(NODES) as NodeId[]).flatMap(a =>
          (Object.keys(NODES) as NodeId[])
            .filter(b => b > a)
            .filter(b => Object.values(NODES[a].nav).includes(b) || Object.values(NODES[b].nav).includes(a))
            .map(b => {
              const pa = project(NODES[a].pos), pb = project(NODES[b].pos)
              const active = a === currentNodeId || b === currentNodeId
              return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={active ? '#00FF88' : '#1e3a2e'} strokeWidth={active ? 1 : 0.5} strokeOpacity={active ? 0.6 : 0.3} />
            })
        )}
        {(Object.keys(NODES) as NodeId[]).map(id => {
          const n = NODES[id], p = project(n.pos)
          const isCurrent = id === currentNodeId, isVisited = visitedNodes.has(id)
          return (
            <g key={id} style={{ cursor: 'pointer' }} onClick={() => onNavigate(id)}>
              {isCurrent && <circle cx={p.x} cy={p.y} r={7} fill={n.color} fillOpacity={0.15} />}
              <circle cx={p.x} cy={p.y} r={isCurrent ? 4 : 2.5}
                fill={isCurrent ? n.color : isVisited ? n.color + 'aa' : '#1a1a2e'}
                stroke={n.color} strokeWidth={isCurrent ? 1 : 0.5}
                strokeOpacity={isVisited || isCurrent ? 0.8 : 0.3} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Mobile action bar — shown at bottom when arrived at a node ────────────────

function MobileActionBar({ currentNodeId, onNavigate, onOpenContent, traveling, visitedNodes }: {
  currentNodeId: NodeId; onNavigate: (id: NodeId) => void
  onOpenContent: () => void; traveling: boolean; visitedNodes: Set<NodeId>
}) {
  const node = NODES[currentNodeId]
  const navEntries = Object.entries(node.nav) as [Direction, NodeId][]
  const allNodes = Object.keys(NODES) as NodeId[]

  return (
    <AnimatePresence>
      {!traveling && (
        <motion.div
          key={currentNodeId}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto"
          style={{
            background: 'rgba(5,5,16,0.92)',
            borderTop: `1px solid ${node.color}25`,
            backdropFilter: 'blur(16px)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Top row: node info + view button */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[9px] tracking-widest mb-0.5" style={{ color: node.color }}>
                CURRENT NODE
              </div>
              <div className="font-bold text-base leading-tight" style={{ color: node.color }}>
                {node.label}
              </div>
              <div className="font-mono text-[11px] text-[#64748B] mt-0.5 truncate">{node.subtitle}</div>
            </div>

            <motion.button
              onClick={onOpenContent}
              whileTap={{ scale: 0.94 }}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm font-bold cursor-pointer"
              style={{ background: node.color, color: '#050510' }}
            >
              View Info
              <span style={{ fontSize: 16 }}>↑</span>
            </motion.button>
          </div>

          {/* Bottom row: navigate to adjacent nodes */}
          {navEntries.length > 0 && (
            <div className="px-5 pb-4 flex gap-2 overflow-x-auto scrollbar-none">
              {navEntries.map(([dir, targetId]) => {
                const target = NODES[targetId]
                return (
                  <motion.button
                    key={dir}
                    onClick={() => onNavigate(targetId)}
                    whileTap={{ scale: 0.92 }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${target.color}30`,
                      color: target.color }}
                  >
                    <span style={{ fontSize: 9 }}>{DIR_ARROWS[dir]}</span>
                    {target.label}
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Progress dots */}
          <div className="px-5 pb-3 flex items-center gap-3">
            <div className="font-mono text-[9px] text-[#64748B] tracking-widest shrink-0">
              {visitedNodes.size}/{allNodes.length}
            </div>
            <div className="flex gap-1.5 items-center">
              {allNodes.map(id => {
                const n = NODES[id], isCurrent = id === currentNodeId, isVisited = visitedNodes.has(id)
                return (
                  <div key={id} title={n.label} style={{
                    width: isCurrent ? 8 : 5, height: isCurrent ? 8 : 5, borderRadius: '50%',
                    background: isCurrent ? n.color : isVisited ? n.color + '70' : '#1a1a2e',
                    boxShadow: isCurrent ? `0 0 6px ${n.color}` : 'none',
                    border: isVisited && !isCurrent ? `1px solid ${n.color}40` : 'none',
                    transition: 'all 0.3s',
                  }} />
                )
              })}
            </div>
            {visitedNodes.size === allNodes.length && (
              <span className="font-mono text-[9px]" style={{ color: '#00FF88' }}>✓ ALL EXPLORED</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main HUD ──────────────────────────────────────────────────────────────────

export default function MindMapHUD({ currentNodeId, onNavigate, visitedNodes, traveling, onOpenContent, contentOpen }: Props) {
  const node = NODES[currentNodeId]
  const navEntries = Object.entries(node.nav) as [Direction, NodeId][]
  const isMobile = useIsMobile()

  // Hide entire HUD when mobile content panel is open
  if (isMobile && contentOpen) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-20">

      {/* ── Node name pill — top center (mobile only, compact) ── */}
      {isMobile && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            <motion.div key={currentNodeId}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="px-3 py-1 rounded-full font-mono text-xs font-bold"
              style={{ background: 'rgba(5,5,16,0.7)', border: `1px solid ${node.color}30`,
                color: node.color, backdropFilter: 'blur(8px)' }}>
              {node.label}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Desktop: node header top-center ── */}
      {!isMobile && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            <motion.div key={currentNodeId}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.35 }}
              className="text-center">
              <div className="font-mono text-[10px] tracking-widest text-[#64748B] mb-0.5">NODE</div>
              <div className="font-bold text-lg tracking-wider font-mono"
                style={{ color: node.color, textShadow: `0 0 18px ${node.color}70` }}>
                {node.label}
              </div>
              <div className="font-mono text-[11px] text-[#64748B] mt-0.5">{node.subtitle}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Travel flash ── */}
      <AnimatePresence>
        {traveling && (
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.04), transparent 70%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1, 0] }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, times: [0, 0.1, 0.4, 0.7, 1] }} />
        )}
      </AnimatePresence>

      {/* ── Minimap — top-left desktop / top-right mobile ── */}
      <div className={`absolute pointer-events-auto ${isMobile ? 'top-4 right-4' : 'top-6 left-6'}`}>
        <MiniMap currentNodeId={currentNodeId} visitedNodes={visitedNodes} onNavigate={onNavigate} />
      </div>

      {/* ── Desktop left column: D-pad + progress ── */}
      {!isMobile && (
        <>
          {/* spacer — minimap moved above */}

          {/* D-pad + progress — bottom left */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-4 items-start pointer-events-auto">
            <div style={{ width: 180, height: 180, position: 'relative' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                style={{ background: '#050510', border: `1px solid ${node.color}30`, boxShadow: `0 0 8px ${node.color}40` }}>
                <div className="absolute inset-1 rounded-full" style={{ background: node.color, opacity: 0.6 }} />
              </div>
              <AnimatePresence>
                {navEntries.map(([dir, targetId]) => (
                  <DPadButton key={dir} dir={dir} targetId={targetId} onNavigate={onNavigate} />
                ))}
              </AnimatePresence>
            </div>

            {/* Progress */}
            <div>
              <div className="font-mono text-[9px] text-[#64748B] mb-2 tracking-widest">
                {visitedNodes.size}/{Object.keys(NODES).length} EXPLORED
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {(Object.keys(NODES) as NodeId[]).map(id => {
                  const n = NODES[id], isCurrent = id === currentNodeId, isVisited = visitedNodes.has(id)
                  return (
                    <div key={id} title={n.label} style={{
                      width: isCurrent ? 10 : 6, height: isCurrent ? 10 : 6, borderRadius: '50%',
                      background: isCurrent ? n.color : isVisited ? n.color + '70' : '#1a1a2e',
                      boxShadow: isCurrent ? `0 0 8px ${n.color}` : 'none',
                      border: isVisited && !isCurrent ? `1px solid ${n.color}40` : 'none',
                      transition: 'all 0.3s',
                    }} />
                  )
                })}
              </div>
              {visitedNodes.size === Object.keys(NODES).length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-1.5 font-mono text-[9px] tracking-widest" style={{ color: '#00FF88' }}>
                  ✓ FULLY EXPLORED
                </motion.div>
              )}
            </div>

            <div className="font-mono text-[9px] text-[#64748B]/40 tracking-widest">
              WASD / ARROWS TO NAVIGATE
            </div>
          </div>
        </>
      )}

      {/* ── Mobile action bar ── */}
      {isMobile && (
        <MobileActionBar
          currentNodeId={currentNodeId}
          onNavigate={onNavigate}
          onOpenContent={onOpenContent}
          traveling={traveling}
          visitedNodes={visitedNodes}
        />
      )}
    </div>
  )
}
