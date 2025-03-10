"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TextTypingEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
  repeat?: boolean
  repeatDelay?: number
}

export const TextTypingEffect = ({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
  repeat = false,
  repeatDelay = 2000,
}: TextTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset when text prop changes
    setDisplayedText("")
    setIsTyping(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Initial delay before starting
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, delay])

  useEffect(() => {
    if (!isTyping) return

    if (displayedText.length < text.length) {
      // Continue typing
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1))
      }, speed)
    } else {
      // Typing complete
      setIsTyping(false)
      if (onComplete) onComplete()

      if (repeat) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText("")
          setIsTyping(true)
        }, repeatDelay)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayedText, isTyping, text, speed, onComplete, repeat, repeatDelay])

  return (
    <div className={cn("relative inline-block", className)}>
      <span>{displayedText}</span>
      {cursor && (
        <span
          className={cn(
            "inline-block w-0.5 h-5 ml-0.5 bg-current align-text-bottom",
            isTyping || displayedText.length < text.length ? "animate-blink" : "",
          )}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

