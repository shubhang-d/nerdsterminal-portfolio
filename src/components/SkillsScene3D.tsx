'use client'
import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

const SKILLS = [
  { name: 'Flutter',    color: '#00B4D8', category: 'mobile' },
  { name: 'Kotlin',     color: '#7F52FF', category: 'mobile' },
  { name: 'Swift',      color: '#FA7343', category: 'mobile' },
  { name: 'React',      color: '#61DAFB', category: 'web'    },
  { name: 'Python',     color: '#3776AB', category: 'ai'     },
  { name: 'TypeScript', color: '#3178C6', category: 'web'    },
  { name: 'Firebase',   color: '#FFCA28', category: 'web'    },
  { name: 'Arduino',    color: '#00979D', category: 'hardware'},
  { name: 'Jetpack',    color: '#7F52FF', category: 'mobile' },
]

const positions: [number, number, number][] = SKILLS.map((_, i) => {
  const angle = (i / SKILLS.length) * Math.PI * 2
  const r = 2.2
  return [Math.cos(angle) * r, Math.sin(angle) * r * 0.5, Math.sin(angle * 2) * 0.5]
})

// ─── SkillOrb ─────────────────────────────────────────────────────────────────

interface SkillOrbProps {
  skill: string
  color: string
  position: [number, number, number]
  index: number
}

function SkillOrb({ skill, color, position, index }: SkillOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const baseY = position[1]

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.position.y = baseY + Math.sin(t * 0.5 + index * 0.7) * 0.25

    const targetScale = hovered ? 1.2 : 1.0
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1)
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1)

    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      hovered ? 1.0 : 0.4,
      0.1
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.2}
        roughness={0.1}
      />
      <pointLight
        color={color}
        intensity={hovered ? 3 : 0.8}
        distance={2.5}
      />
      <Html
        center
        distanceFactor={10}
        zIndexRange={[0, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            whiteSpace: 'nowrap',
            opacity: hovered ? 1 : 0.6,
            textShadow: `0 0 8px ${color}`,
            transition: 'opacity 0.3s',
            userSelect: 'none',
          }}
        >
          {skill}
        </div>
      </Html>
    </mesh>
  )
}

// ─── CenterOrb ────────────────────────────────────────────────────────────────

function CenterOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.25
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#00FF88"
        emissive="#00FF88"
        emissiveIntensity={0.6}
        metalness={0.3}
        roughness={0.1}
      />
      <pointLight color="#00FF88" intensity={2} distance={4} />
      <Html
        center
        distanceFactor={10}
        zIndexRange={[0, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            color: '#00FF88',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            textShadow: '0 0 10px #00FF88',
            userSelect: 'none',
            textAlign: 'center',
          }}
        >
          CODE CRAFT
        </div>
      </Html>
    </mesh>
  )
}

// ─── RotatingGroup ────────────────────────────────────────────────────────────

function RotatingGroup() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.003
  })

  return (
    <group ref={groupRef}>
      {SKILLS.map((skill, i) => (
        <SkillOrb
          key={skill.name}
          skill={skill.name}
          color={skill.color}
          position={positions[i]}
          index={i}
        />
      ))}
      <CenterOrb />
    </group>
  )
}

// ─── SkillsScene3D ────────────────────────────────────────────────────────────

export default function SkillsScene3D() {
  return (
    <div style={{ height: 320, width: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} color="#00FF88" intensity={2} />
        <pointLight position={[-5, -5, 5]} color="#7C3AED" intensity={1.5} />
        <RotatingGroup />
      </Canvas>
    </div>
  )
}
