"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

function Model() {
  // Use a default model that's guaranteed to work
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf",
  )
  const modelRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const [hover, setHover] = useState(false)

  // Make the model follow mouse movement slightly
  useFrame(({ mouse }) => {
    if (!modelRef.current) return

    const x = (mouse.x * viewport.width) / 50
    const y = (mouse.y * viewport.height) / 50

    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      hover ? x * 0.5 + Math.PI : x * 0.2 + Math.PI,
      0.05,
    )
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, hover ? -y * 0.5 : -y * 0.2, 0.05)

    // Add a subtle floating animation
    modelRef.current.position.y = Math.sin(Date.now() / 1000) * 0.1
  })

  return (
    <group
      ref={modelRef}
      scale={[1.5, 1.5, 1.5]}
      position={[0, -1, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <primitive object={scene} />
    </group>
  )
}

export default function AvatarModel() {
  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model />
        <Environment preset="night" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </motion.div>
  )
}

