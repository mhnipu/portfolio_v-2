"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

export default function EasterEgg() {
  const [konami, setKonami] = useState<string[]>([])
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ]
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the sequence
      const newKonami = [...konami, e.key]

      // Only keep the last N keys where N is the length of the Konami code
      if (newKonami.length > konamiCode.length) {
        newKonami.shift()
      }

      setKonami(newKonami)

      // Check if the sequence matches the Konami code
      if (newKonami.length === konamiCode.length && newKonami.every((key, i) => key === konamiCode[i])) {
        triggerEasterEgg()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [konami])

  const triggerEasterEgg = () => {
    // Show toast notification
    toast({
      title: "🎮 Konami Code Activated!",
      description: "You found a secret! Enjoy the confetti!",
    })

    // Trigger confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
        particleCount: Math.floor(particleCount),
      })
    }, 250)
  }

  return null // This component doesn't render anything
}

