"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function InteractiveCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run after component is mounted in the browser
  useEffect(() => {
    setMounted(true)

    // Use event delegation instead of attaching listeners to each element
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Check if the mouse is over an interactive element
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.getAttribute("role") === "button" ||
        target.closest('a, button, [role="button"]')

      setLinkHovered(!!isInteractive)
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)
    const handleMouseLeave = () => setHidden(true)
    const handleMouseEnter = () => setHidden(false)

    // Add event listeners to document
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      // Clean up event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[999] pointer-events-none"
      animate={{
        x: position.x - (linkHovered ? 24 : clicked ? 16 : 4),
        y: position.y - (linkHovered ? 24 : clicked ? 16 : 4),
        scale: linkHovered ? 1.5 : clicked ? 0.8 : 1,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <div
        className={`relative flex items-center justify-center ${
          linkHovered ? "w-12 h-12" : clicked ? "w-8 h-8" : "w-8 h-8"
        }`}
      >
        <div
          className={`absolute rounded-full ${
            linkHovered ? "bg-primary/20 w-full h-full" : clicked ? "bg-primary/30 w-full h-full" : "bg-primary w-2 h-2"
          } transition-all duration-150`}
        />
        {linkHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-1 h-1 bg-primary rounded-full"
          />
        )}
      </div>
    </motion.div>
  )
}

