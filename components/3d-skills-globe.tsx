"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type * as THREE from "three"
import LoadingSpinner from "./loading-spinner"

const skills = [
  { name: "React", level: 90, color: "#61DAFB" },
  { name: "TypeScript", level: 85, color: "#3178C6" },
  { name: "Next.js", level: 85, color: "#000000" },
  { name: "Node.js", level: 80, color: "#339933" },
  { name: "Three.js", level: 70, color: "#000000" },
  { name: "GraphQL", level: 65, color: "#E10098" },
  { name: "CSS", level: 85, color: "#1572B6" },
  { name: "Tailwind", level: 90, color: "#06B6D4" },
  { name: "AWS", level: 60, color: "#FF9900" },
  { name: "Docker", level: 75, color: "#2496ED" },
  { name: "Git", level: 85, color: "#F05032" },
  { name: "UI/UX", level: 75, color: "#FF61F6" },
]

function SkillNode({
  skill,
  index,
  total,
  hoveredSkill,
  setHoveredSkill,
}: {
  skill: { name: string; level: number; color: string }
  index: number
  total: number
  hoveredSkill: string | null
  setHoveredSkill: (name: string | null) => void
}) {
  // Calculate position on sphere using a more stable distribution
  const phi = Math.acos(-1 + (2 * index) / total)
  const theta = Math.sqrt(total * Math.PI) * phi

  const x = Math.cos(theta) * Math.sin(phi) * 2.5
  const y = Math.sin(theta) * Math.sin(phi) * 2.5
  const z = Math.cos(phi) * 2.5

  const isHovered = hoveredSkill === skill.name

  return (
    <group position={[x, y, z]}>
      <mesh onPointerOver={() => setHoveredSkill(skill.name)} onPointerOut={() => setHoveredSkill(null)}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={skill.color} emissive={skill.color} emissiveIntensity={isHovered ? 0.8 : 0.2} />
      </mesh>
      <Html position={[0, 0.4, 0]} center distanceFactor={10} occlude>
        <div
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
            isHovered ? "bg-background/90 scale-110" : "bg-background/50 scale-100"
          }`}
        >
          {skill.name}
        </div>
      </Html>
    </group>
  )
}

function GlobeSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // Slower, more stable rotation
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={sphereRef}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#1a1a2e"
            attach="material"
            distort={0.2} // Reduced distortion for better stability
            speed={1}
            roughness={0.8}
            metalness={0.2}
          />
        </Sphere>

        {/* Skill nodes */}
        {skills.map((skill, i) => (
          <SkillNode
            key={skill.name}
            skill={skill}
            index={i}
            total={skills.length}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
          />
        ))}
      </mesh>
    </group>
  )
}

export default function SkillsGlobe() {
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[0] | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        setHasError(true)
      }
    } catch (e) {
      setHasError(true)
    }

    // Simulate loading time to ensure proper initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Fallback if not mounted or has error
  if (!mounted || hasError || isLoading) {
    return (
      <section id="skills" className="py-20 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            My <span className="text-primary">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {hasError ? "3D visualization not supported in your browser." : "Loading interactive visualization..."}
          </p>
        </div>

        {!hasError && isLoading && (
          <div className="h-[500px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {hasError && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center p-4 bg-background/50 rounded-lg border border-border"
              >
                <h3 className="text-lg font-medium mb-2">{skill.name}</h3>
                <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My <span className="text-primary">Skills</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Interactive visualization of my technical expertise.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-[500px] w-full bg-background/10 rounded-xl overflow-hidden"
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, 2]} // Limit pixel ratio for better performance
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <GlobeSphere />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-background/70 border-border/50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Technical Proficiency</h3>
              <p className="text-muted-foreground mb-6">
                Hover over the skill nodes on the 3D globe to see details. Here's a breakdown of my expertise:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div
                      className="w-full h-1 mb-2 rounded-full overflow-hidden bg-gray-700"
                      style={{ position: "relative" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                ))}
              </div>

              {selectedSkill && (
                <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedSkill.color }} />
                    <h4 className="text-lg font-bold">{selectedSkill.name}</h4>
                  </div>
                  <p className="text-muted-foreground mb-2">Proficiency: {selectedSkill.level}%</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Projects: {Math.floor(selectedSkill.level / 10)}</Badge>
                    <Badge variant="outline">Years: {Math.floor(selectedSkill.level / 20)}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

