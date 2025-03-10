"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei"
import { useTheme } from "next-themes"
import type * as THREE from "three"

function Avatar({ position = [0, -1, 0], scale = 2 }) {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  const avatarRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const [hovered, setHovered] = useState(false)

  // Make the avatar follow the mouse
  useFrame(({ mouse }) => {
    if (!avatarRef.current) return

    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    avatarRef.current.lookAt(x, y, 1)

    // Add a subtle floating animation
    avatarRef.current.position.y = position[1] + Math.sin(Date.now() / 1000) * 0.1
  })

  return (
    <group
      ref={avatarRef}
      position={position as [number, number, number]}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} rotation={[0, Math.PI, 0]} scale={hovered ? 1.05 : 1} />
    </group>
  )
}

export default function Avatar3D() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Avatar />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} />
        <Environment preset={theme === "dark" ? "night" : "sunset"} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
        />
      </Canvas>
    </div>
  )
}

