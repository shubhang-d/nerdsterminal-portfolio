'use client'
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { NodeDef, NodeId, NODES, EDGES } from './types'

// ── Camera controller ─────────────────────────────────────────────────────────

function CameraController({ currentNode }: { currentNode: NodeDef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())

  useEffect(() => {
    const [x, y, z] = currentNode.pos
    targetPos.current.set(x, y + 2, z + 14)
    targetLookAt.current.set(x, y, z)
  }, [currentNode])

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04)
    currentLookAt.current.lerp(targetLookAt.current, 0.04)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

// ── Node orb ──────────────────────────────────────────────────────────────────

interface NodeOrbProps {
  node: NodeDef
  isCurrent: boolean
  isAdjacent: boolean
  onClick: () => void
}

function NodeOrb({ node, isCurrent, isAdjacent, onClick }: NodeOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    t.current += delta
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.4
      orbRef.current.rotation.x += delta * 0.15
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t.current * 1.8) * 0.12
      glowRef.current.scale.setScalar(pulse)
    }
  })

  const size = isCurrent ? 1.6 : isAdjacent ? 0.9 : 0.55
  const emissive = isCurrent ? 0.9 : isAdjacent ? 0.45 : 0.2
  const opacity = isCurrent ? 1 : isAdjacent ? 0.75 : 0.35

  return (
    <group position={node.pos} onClick={onClick}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2.2, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.04} depthWrite={false} />
      </mesh>

      {/* Inner glow ring */}
      <mesh>
        <sphereGeometry args={[size * 1.4, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* Main orb */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[size, 2]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={emissive}
          transparent
          opacity={opacity}
          roughness={0.15}
          metalness={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Point light */}
      {(isCurrent || isAdjacent) && (
        <pointLight
          color={node.color}
          intensity={isCurrent ? 4 : 1.2}
          distance={isCurrent ? 12 : 6}
        />
      )}

      {/* HTML label */}
      <Html
        center
        position={[0, size + 1.1, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            color: node.color,
            fontSize: isCurrent ? 15 : isAdjacent ? 11 : 9,
            fontFamily: 'monospace',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${node.color}, 0 0 24px ${node.color}80`,
            opacity: isCurrent ? 1 : isAdjacent ? 0.8 : 0.4,
            letterSpacing: '0.08em',
            transition: 'all 0.3s',
          }}
        >
          {node.label}
        </div>
        {(isCurrent || isAdjacent) && (
          <div
            style={{
              color: '#64748B',
              fontSize: isCurrent ? 10 : 8,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              marginTop: 2,
              opacity: isCurrent ? 0.9 : 0.5,
            }}
          >
            {node.subtitle}
          </div>
        )}
      </Html>
    </group>
  )
}

// ── Edge beam ─────────────────────────────────────────────────────────────────

function EdgeBeam({
  from,
  to,
  active,
  color,
}: {
  from: [number, number, number]
  to: [number, number, number]
  active: boolean
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = active
        ? 0.3 + Math.sin(t.current * 2) * 0.15
        : 0.06 + Math.sin(t.current * 0.8) * 0.02
    }
  })

  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const dir = end.clone().sub(start)
  const length = dir.length()
  const mid = start.clone().add(end).multiplyScalar(0.5)

  // Orient the cylinder along the edge
  const up = new THREE.Vector3(0, 1, 0)
  const norm = dir.clone().normalize()
  const quat = new THREE.Quaternion().setFromUnitVectors(up, norm)

  return (
    <mesh ref={ref} position={mid} quaternion={quat}>
      <cylinderGeometry args={[active ? 0.04 : 0.02, active ? 0.04 : 0.02, length, 6]} />
      <meshBasicMaterial
        color={active ? color : '#1e3a2e'}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── Ambient particles ─────────────────────────────────────────────────────────

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useRef(() => {
    const arr = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
    }
    return arr
  }).current()

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00FF88" size={0.06} transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────

interface SceneProps {
  currentNodeId: NodeId
  onNavigate: (id: NodeId) => void
}

function Scene({ currentNodeId, onNavigate }: SceneProps) {
  const currentNode = NODES[currentNodeId]
  const adjacentIds = new Set(Object.values(currentNode.nav) as NodeId[])

  return (
    <>
      <Stars radius={120} depth={60} count={6000} factor={3} saturation={0} fade speed={0.6} />
      <FloatingParticles />
      <ambientLight intensity={0.08} />

      <CameraController currentNode={currentNode} />

      {/* Edges */}
      {EDGES.map(([a, b]) => {
        const active = a === currentNodeId || b === currentNodeId
        const edgeColor = active
          ? (a === currentNodeId ? NODES[b].color : NODES[a].color)
          : '#00FF88'
        return (
          <EdgeBeam
            key={`${a}-${b}`}
            from={NODES[a].pos}
            to={NODES[b].pos}
            active={active}
            color={edgeColor}
          />
        )
      })}

      {/* Nodes */}
      {(Object.values(NODES) as NodeDef[]).map((node) => (
        <NodeOrb
          key={node.id}
          node={node}
          isCurrent={node.id === currentNodeId}
          isAdjacent={adjacentIds.has(node.id as NodeId)}
          onClick={() => onNavigate(node.id as NodeId)}
        />
      ))}
    </>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function MindMapWorld({ currentNodeId, onNavigate }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 55 }}
      style={{ background: '#050510', width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
    >
      <Scene currentNodeId={currentNodeId} onNavigate={onNavigate} />
    </Canvas>
  )
}
