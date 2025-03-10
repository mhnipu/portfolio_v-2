"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface ThreeDCardProps {
  children: React.ReactNode
  className?: string
  glareColor?: string
  rotationIntensity?: number
  borderRadius?: string
}

export function ThreeDCard({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.4)",
  rotationIntensity = 10,
  borderRadius = "1rem",
}: ThreeDCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * rotationIntensity
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * rotationIntensity

    // Calculate mouse position for glare effect
    const mouseX = (e.clientX - rect.left) / rect.width
    const mouseY = (e.clientY - rect.top) / rect.height

    setMousePosition({ x: mouseX, y: mouseY })
  }

  if (!mounted) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{
        rotateX: isHovered ? -mousePosition.y * rotationIntensity : 0,
        rotateY: isHovered ? mousePosition.x * rotationIntensity : 0,
        transformPerspective: 1000,
      }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 200,
      }}
    >
      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Glare effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${glareColor} 0%, rgba(255, 255, 255, 0) 60%)`,
            opacity: 0.4,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Border highlight */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            borderRadius,
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

