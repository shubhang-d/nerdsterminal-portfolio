'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Float, Sparkles, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── Phone ───────────────────────────────────────────────────────────────────

function Phone() {
  const groupRef = useRef<THREE.Group>(null)
  const shimmerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15

    if (shimmerRef.current) {
      const mat = shimmerRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.03 + Math.abs(Math.sin(t * 0.7)) * 0.06
    }
  })

  return (
    <group ref={groupRef} position={[1.8, 0, 0]}>
      {/* Phone body */}
      <RoundedBox args={[1.8, 3.8, 0.18]} radius={0.18} smoothness={8}>
        <meshStandardMaterial
          color="#0D0D1A"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0.05, 0.1]}>
        <planeGeometry args={[1.5, 3.2]} />
        <meshBasicMaterial color="#050510" />
      </mesh>

      {/* Screen content glow lines */}
      {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.101]}>
          <planeGeometry args={[1.2 - i * 0.05, 0.04]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#00FF88' : i % 3 === 1 ? '#7C3AED' : '#0EA5E9'}
            transparent
            opacity={0.7 - i * 0.06}
          />
        </mesh>
      ))}

      {/* Dynamic island */}
      <mesh position={[0, 1.7, 0.102]}>
        <RoundedBox args={[0.5, 0.14, 0.01]} radius={0.07} smoothness={4}>
          <meshBasicMaterial color="#000" />
        </RoundedBox>
      </mesh>

      {/* Side buttons */}
      <mesh position={[0.92, 0.5, 0]}>
        <RoundedBox args={[0.04, 0.4, 0.12]} radius={0.02}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </RoundedBox>
      </mesh>
      <mesh position={[-0.92, 0.2, 0]}>
        <RoundedBox args={[0.04, 0.25, 0.12]} radius={0.02}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </RoundedBox>
      </mesh>
      <mesh position={[-0.92, -0.15, 0]}>
        <RoundedBox args={[0.04, 0.25, 0.12]} radius={0.02}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </RoundedBox>
      </mesh>

      {/* Screen edge glow — enhanced */}
      <mesh ref={shimmerRef} position={[0, 0.05, 0.099]}>
        <planeGeometry args={[1.55, 3.25]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.04} />
      </mesh>

      {/* Holographic shimmer layer */}
      <mesh position={[0, 0.05, 0.102]}>
        <planeGeometry args={[1.5, 3.2]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.015} />
      </mesh>

      {/* Screen point light for glow */}
      <pointLight position={[0, 0, 0.3]} color="#00FF88" intensity={0.6} distance={2} />

      {/* Camera */}
      <mesh position={[0, 1.7, -0.1]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#0A0A1A" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// ─── HolographicRings ─────────────────────────────────────────────────────────

function HolographicRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4
      ring1Ref.current.rotation.z = t * 0.25
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.35
      ring2Ref.current.rotation.x = t * 0.2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.45
      ring3Ref.current.rotation.y = t * 0.3
    }
  })

  return (
    <group position={[1.8, 0, 0]}>
      {/* Ring 1 — green */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.6, 0.007, 16, 120]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.7} />
      </mesh>

      {/* Ring 2 — purple */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.0, 0.005, 16, 120]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.6} />
      </mesh>

      {/* Ring 3 — cyan */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.2, 0.006, 16, 120]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

// ─── FloatingCode ─────────────────────────────────────────────────────────────

const CODE_FRAGMENTS = [
  { text: '> flutter build',    pos: [-3.5,  2.5, -2]   as [number,number,number], color: '#00B4D8' },
  { text: '> @Composable',      pos: [-4.2, -1.5, -1.5] as [number,number,number], color: '#3DDC84' },
  { text: '> async/await',      pos: [ 4.5,  2,   -3]   as [number,number,number], color: '#00FF88' },
  { text: '> func viewDidLoad', pos: [ 3.5, -2.5, -2]   as [number,number,number], color: '#FA7343' },
  { text: '> val state by',     pos: [-2,    3.5, -3]   as [number,number,number], color: '#7F52FF' },
  { text: '> pub.dev/packages', pos: [ 2,   -3.5, -2.5] as [number,number,number], color: '#FFCA28' },
]

function FloatingCode() {
  return (
    <>
      {CODE_FRAGMENTS.map((frag, i) => (
        <Float key={i} speed={1.2 + i * 0.15} rotationIntensity={0.1} floatIntensity={0.4}>
          <Html
            position={frag.pos}
            zIndexRange={[1, 1]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: frag.color,
                opacity: 0.55,
                whiteSpace: 'nowrap',
                textShadow: `0 0 10px ${frag.color}, 0 0 20px ${frag.color}80`,
                userSelect: 'none',
              }}
            >
              {frag.text}
            </div>
          </Html>
        </Float>
      ))}
    </>
  )
}

// ─── DataOrbs ─────────────────────────────────────────────────────────────────

const ORB_COLORS = ['#00FF88', '#7C3AED', '#0EA5E9', '#FF6B35', '#00FF88', '#7C3AED', '#0EA5E9', '#FF6B35']

function DataOrbs() {
  const orbRefs = useRef<(THREE.Mesh | null)[]>([])
  const basePositions = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const r = 4.5
      return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r)
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    orbRefs.current.forEach((orb, i) => {
      if (!orb) return
      const base = basePositions[i]
      orb.position.y = base.y + Math.sin(t * 0.6 + i * 0.8) * 0.5
    })
  })

  return (
    <>
      {basePositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => { orbRefs.current[i] = el }}
          position={[pos.x, pos.y, pos.z]}
        >
          <sphereGeometry args={[0.1, 16, 32]} />
          <meshStandardMaterial
            color={ORB_COLORS[i]}
            emissive={ORB_COLORS[i]}
            emissiveIntensity={1.5}
            roughness={0.1}
            metalness={0.2}
          />
          <pointLight color={ORB_COLORS[i]} intensity={0.8} distance={2.5} />
        </mesh>
      ))}
    </>
  )
}

// ─── ReactiveParticles ────────────────────────────────────────────────────────

function ReactiveParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { pointer, viewport } = useThree()

  const { positions, colors, velocities } = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    const palette = [
      [0, 1, 0.533],        // #00FF88
      [0.486, 0.227, 0.929],// #7C3AED
      [0.055, 0.647, 0.914],// #0EA5E9
      [1, 0.420, 0.208],    // #FF6B35
    ]

    for (let i = 0; i < count; i++) {
      // Spherical shell distribution
      const r = 6 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) - 2

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      velocities[i * 3]     = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0
    }
    return { positions, colors, velocities }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime

    // Convert pointer NDC to approximate world space (at z=0 plane)
    const mx = pointer.x * (viewport.width / 2)
    const my = pointer.y * (viewport.height / 2)
    const mouseWorld = new THREE.Vector3(mx, my, 0)

    for (let i = 0; i < 500; i++) {
      const ix = i * 3
      const px = pos[ix], py = pos[ix + 1], pz = pos[ix + 2]

      // Gentle slow rotation
      const dx = px, dz = pz
      const angle = 0.001
      pos[ix]     = dx * Math.cos(angle) - dz * Math.sin(angle)
      pos[ix + 2] = dx * Math.sin(angle) + dz * Math.cos(angle)

      // Mouse repulsion
      const dist = Math.sqrt((px - mouseWorld.x) ** 2 + (py - mouseWorld.y) ** 2)
      if (dist < 2.5 && dist > 0.01) {
        const force = (2.5 - dist) / 2.5 * 0.012
        pos[ix]     += (px - mouseWorld.x) / dist * force
        pos[ix + 1] += (py - mouseWorld.y) / dist * force
      }

      // Gentle bobbing
      pos[ix + 1] += Math.sin(t * 0.3 + i * 0.05) * 0.0005
    }

    geo.attributes.position.needsUpdate = true

    pointsRef.current.rotation.y = t * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
        <bufferAttribute args={[colors, 3]} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

// ─── GridPlane ────────────────────────────────────────────────────────────────

function GridPlane() {
  return (
    <gridHelper
      args={[40, 40, '#00FF88', '#0A0A2E']}
      position={[0, -3.5, 0]}
    />
  )
}

// ─── HeroScene ────────────────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[-4, 4, 4]} color="#00FF88" intensity={3} />
      <pointLight position={[4, -2, 2]} color="#7C3AED" intensity={2} />
      <pointLight position={[0, 0, 6]} color="#0EA5E9" intensity={1} />
      <pointLight position={[0, -4, 2]} color="#FF6B35" intensity={1} />

      <Stars radius={60} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles count={100} scale={16} size={3} speed={0.3} color="#00FF88" opacity={0.5} />
      <Sparkles count={50} scale={12} size={2} speed={0.2} color="#7C3AED" opacity={0.3} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Phone />
      </Float>

      <HolographicRings />
      <FloatingCode />
      <DataOrbs />
      <ReactiveParticles />
      <GridPlane />
    </Canvas>
  )
}
