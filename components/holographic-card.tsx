"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const { theme } = useTheme()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    // Calculate mouse position relative to card center
    const cardCenterX = rect.left + rect.width / 2
    const cardCenterY = rect.top + rect.height / 2

    // Calculate rotation based on mouse position
    const rotateY = ((e.clientX - cardCenterX) / (rect.width / 2)) * 10
    const rotateX = -((e.clientY - cardCenterY) / (rect.height / 2)) * 10

    // Calculate mouse position for highlight effect
    const mouseX = (e.clientX - rect.left) / rect.width
    const mouseY = (e.clientY - rect.top) / rect.height

    setRotateX(rotateX)
    setRotateY(rotateY)
    setMouseX(mouseX)
    setMouseY(mouseY)
  }

  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    setRotateX(0)
    setRotateY(0)
  }

  const isDark = theme === "dark"

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-56 rounded-xl overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Holographic background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20"
        style={{
          backgroundPosition: `${mouseX * 100}% ${mouseY * 100}%`,
          backgroundSize: "200% 200%",
          filter: "blur(0px)",
        }}
      />

      {/* Holographic overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mouseX * 100}% ${
            mouseY * 100
          }%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 50%)`,
        }}
      />

      {/* Card content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Portfolio</p>
            <h3 className="text-lg font-bold">John Doe</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            JD
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Web Developer</p>
            <p className="text-sm">Full Stack Developer & UI/UX Designer</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs opacity-70">hello@example.com</p>
            <div className="flex space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                </svg>
              </div>
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflective edge */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)",
          transform: `translateX(${(mouseX - 0.5) * 20}px)`,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  )
}

