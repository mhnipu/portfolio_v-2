"use client"

import { useRef, useEffect } from "react"

export default function ParallaxBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return

    let mouseX = 0
    let mouseY = 0
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight
    let requestId: number | null = null

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Handle window resize
    const handleResize = () => {
      windowWidth = window.innerWidth
      windowHeight = window.innerHeight
    }

    // Animation
    const animate = () => {
      if (!background) return

      // Calculate parallax effect with easing
      const moveX = (mouseX / windowWidth - 0.5) * 20
      const moveY = (mouseY / windowHeight - 0.5) * 20

      // Apply transform with easing
      background.style.transform = `translate(${moveX}px, ${moveY}px)`

      requestId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    requestId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (requestId) cancelAnimationFrame(requestId)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div ref={backgroundRef} className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-gray-900" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] bg-white"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), 
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
    </div>
  )
}

