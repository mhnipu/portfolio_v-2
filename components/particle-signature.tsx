"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

export default function ParticleSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      targetX: number
      targetY: number

      constructor(x: number, y: number, targetX: number, targetY: number) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = theme === "dark" ? "white" : "black"
        this.targetX = targetX
        this.targetY = targetY
      }

      update() {
        // Move particle towards target
        this.x += (this.targetX - this.x) * 0.05
        this.y += (this.targetY - this.y) * 0.05
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create signature path
    const signaturePath = [
      // J
      [50, 30],
      [60, 30],
      [70, 30],
      [60, 30],
      [60, 40],
      [60, 50],
      [60, 60],
      [50, 60],
      [40, 55],

      // D
      [90, 30],
      [100, 30],
      [110, 35],
      [120, 40],
      [125, 50],
      [120, 60],
      [110, 65],
      [100, 65],
      [90, 65],
      [90, 30],
      [90, 40],
      [90, 50],
      [90, 60],
    ]

    // Scale points to fit canvas
    const scalePoints = () => {
      const scaleX = canvas.width / 150
      const scaleY = canvas.height / 100
      return signaturePath.map(([x, y]) => [x * scaleX, y * scaleY])
    }

    const scaledPoints = scalePoints()

    // Create particles
    const particles: Particle[] = []
    const particleCount = 500

    for (let i = 0; i < particleCount; i++) {
      const pointIndex = Math.floor(Math.random() * scaledPoints.length)
      const [targetX, targetY] = scaledPoints[pointIndex]
      particles.push(new Particle(0, 0, targetX, targetY))
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="h-[100px] w-full mb-4" />
}

