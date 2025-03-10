"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function SignatureAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 1000
    const text = "YN"

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = 300
      canvas.height = 100
    }

    setCanvasDimensions()

    // Draw the text to get pixel data
    ctx.font = "bold 60px 'Inter', sans-serif"
    ctx.fillStyle = theme === "dark" ? "white" : "black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create particles from pixel data
    for (let i = 0; i < particleCount; i++) {
      let x, y
      let found = false

      // Find a non-transparent pixel
      while (!found) {
        x = Math.floor(Math.random() * canvas.width)
        y = Math.floor(Math.random() * canvas.height)

        const index = (y * canvas.width + x) * 4
        if (pixels[index + 3] > 0) {
          found = true
        }
      }

      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: x,
        targetY: y,
        size: Math.random() * 2 + 1,
        color: theme === "dark" ? "white" : "black",
        speed: Math.random() * 0.1 + 0.05,
      }

      particles.push(particle)
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Move particle towards target
        particle.x += (particle.targetX - particle.x) * particle.speed
        particle.y += (particle.targetY - particle.y) * particle.speed

        // Draw particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="h-[100px] w-[300px]" />
}

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  speed: number
}

