'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeId, NodeDef, Direction, NODES } from './types'

const DIR_ARROWS: Record<Direction, string> = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
}

const DIR_POSITIONS: Record<Direction, React.CSSProperties> = {
  up: { top: 0, left: '50%', transform: 'translateX(-50%)' },
  down: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  left: { left: 0, top: '50%', transform: 'translateY(-50%)' },
  right: { right: 0, top: '50%', transform: 'translateY(-50%)' },
}

interface Props {
  currentNodeId: NodeId
  onNavigate: (id: NodeId) => void
  visitedNodes: Set<NodeId>
  traveling: boolean
}

function DPadButton({
  dir,
  targetId,
  onNavigate,
}: {
  dir: Direction
  targetId: NodeId
  onNavigate: (id: NodeId) => void
}) {
  const target = NODES[targetId]

  return (
    <motion.button
      onClick={() => onNavigate(targetId)}
      className="absolute flex flex-col items-center justify-center rounded-lg cursor-pointer select-none"
      style={{
        ...DIR_POSITIONS[dir],
        width: 48,
        height: 48,
        background: 'rgba(5,5,16,0.75)',
        border: `1px solid ${target.color}40`,
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{ scale: 1.12, borderColor: target.color }}
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span style={{ color: target.color, fontSize: 12, lineHeight: 1 }}>
        {DIR_ARROWS[dir]}
      </span>
      <span
        style={{
          color: '#64748B',
          fontSize: 7,
          fontFamily: 'monospace',
          marginTop: 3,
          letterSpacing: '0.05em',
          maxWidth: 40,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
          textAlign: 'center',
        }}
      >
        {target.label}
      </span>
    </motion.button>
  )
}

export default function MindMapHUD({ currentNodeId, onNavigate, visitedNodes, traveling }: Props) {
  const node = NODES[currentNodeId]
  const navEntries = Object.entries(node.nav) as [Direction, NodeId][]
  const allNodes = Object.keys(NODES) as NodeId[]

  return (
    <div className="fixed inset-0 pointer-events-none z-20">

      {/* ── Current node header ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="font-mono text-[10px] tracking-widest text-[#64748B] mb-1">
              NODE
            </div>
            <div
              className="font-bold text-xl tracking-wider font-mono"
              style={{ color: node.color, textShadow: `0 0 20px ${node.color}80` }}
            >
              {node.label}
            </div>
            <div className="font-mono text-xs text-[#64748B] mt-0.5">{node.subtitle}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Travel flash overlay ── */}
      <AnimatePresence>
        {traveling && (
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.04), transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, times: [0, 0.1, 0.4, 0.7, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── D-pad ── */}
      <div
        className="absolute bottom-10 left-10 pointer-events-auto"
        style={{ width: 120, height: 120, position: 'absolute' }}
      >
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          style={{
            background: '#050510',
            border: `1px solid ${node.color}30`,
            boxShadow: `0 0 8px ${node.color}40`,
          }}
        >
          <div
            className="absolute inset-1 rounded-full"
            style={{ background: node.color, opacity: 0.6 }}
          />
        </div>

        <AnimatePresence>
          {navEntries.map(([dir, targetId]) => (
            <DPadButton key={dir} dir={dir} targetId={targetId} onNavigate={onNavigate} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Keyboard hint ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="font-mono text-[9px] text-[#64748B]/40 tracking-widest">
          WASD / ARROWS TO NAVIGATE · CLICK NODE TO JUMP
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="absolute bottom-10 right-10 text-right">
        <div className="font-mono text-[9px] text-[#64748B] mb-2 tracking-widest">
          {visitedNodes.size}/{allNodes.length} EXPLORED
        </div>
        <div className="flex gap-2 justify-end items-center">
          {allNodes.map((id) => {
            const n = NODES[id]
            const isCurrent = id === currentNodeId
            const isVisited = visitedNodes.has(id)
            return (
              <div
                key={id}
                title={n.label}
                className="transition-all duration-400"
                style={{
                  width: isCurrent ? 10 : 6,
                  height: isCurrent ? 10 : 6,
                  borderRadius: '50%',
                  background: isCurrent ? n.color : isVisited ? n.color + '70' : '#1a1a2e',
                  boxShadow: isCurrent ? `0 0 8px ${n.color}, 0 0 16px ${n.color}60` : 'none',
                  border: isVisited && !isCurrent ? `1px solid ${n.color}40` : 'none',
                }}
              />
            )
          })}
        </div>
        {visitedNodes.size === allNodes.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 font-mono text-[9px] tracking-widest"
            style={{ color: '#00FF88' }}
          >
            ✓ FULLY EXPLORED
          </motion.div>
        )}
      </div>

      {/* ── Mini map ── */}
      <MiniMap currentNodeId={currentNodeId} visitedNodes={visitedNodes} onNavigate={onNavigate} />
    </div>
  )
}

function MiniMap({
  currentNodeId,
  visitedNodes,
  onNavigate,
}: {
  currentNodeId: NodeId
  visitedNodes: Set<NodeId>
  onNavigate: (id: NodeId) => void
}) {
  // Project 3D positions to 2D minimap space
  // All positions range roughly -16 to +16 in x and y
  const scale = 4.2
  const cx = 60
  const cy = 60

  const project = (pos: [number, number, number]) => ({
    x: cx + pos[0] * scale * 0.5,
    y: cy - pos[1] * scale * 0.5,
  })

  return (
    <div
      className="absolute top-6 right-6 pointer-events-auto"
      style={{
        width: 120,
        height: 120,
        background: 'rgba(5,5,16,0.7)',
        border: '1px solid rgba(0,255,136,0.12)',
        borderRadius: 10,
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
      }}
    >
      <div className="font-mono text-[7px] text-[#64748B] px-2 pt-1.5 tracking-widest">MAP</div>
      <svg width="120" height="105" style={{ position: 'absolute', top: 15, left: 0 }}>
        {/* Edges */}
        {(Object.keys(NODES) as NodeId[]).flatMap((a) =>
          (Object.keys(NODES) as NodeId[])
            .filter((b) => b > a)
            .filter(
              (b) =>
                Object.values(NODES[a].nav).includes(b) ||
                Object.values(NODES[b].nav).includes(a)
            )
            .map((b) => {
              const pa = project(NODES[a].pos)
              const pb = project(NODES[b].pos)
              const active = a === currentNodeId || b === currentNodeId
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={active ? '#00FF88' : '#1e3a2e'}
                  strokeWidth={active ? 1 : 0.5}
                  strokeOpacity={active ? 0.6 : 0.3}
                />
              )
            })
        )}

        {/* Nodes */}
        {(Object.keys(NODES) as NodeId[]).map((id) => {
          const n = NODES[id]
          const p = project(n.pos)
          const isCurrent = id === currentNodeId
          const isVisited = visitedNodes.has(id)
          return (
            <g key={id} style={{ cursor: 'pointer' }} onClick={() => onNavigate(id)}>
              {isCurrent && (
                <circle cx={p.x} cy={p.y} r={7} fill={n.color} fillOpacity={0.15} />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isCurrent ? 4 : 2.5}
                fill={isCurrent ? n.color : isVisited ? n.color + 'aa' : '#1a1a2e'}
                stroke={n.color}
                strokeWidth={isCurrent ? 1 : 0.5}
                strokeOpacity={isVisited || isCurrent ? 0.8 : 0.3}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
