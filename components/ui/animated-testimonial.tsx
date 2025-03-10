"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  category?: string
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[]
  autoplayInterval?: number
  className?: string
}

export function AnimatedTestimonials({
  testimonials,
  autoplayInterval = 5000,
  className = "",
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || testimonials.length <= 1 || isPaused) return

    intervalRef.current = setInterval(() => {
      setDirection(1)
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, autoplayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeIndex, isPaused, testimonials.length, autoplayInterval, mounted])

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  if (!mounted || testimonials.length === 0) return null

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="w-full"
          >
            <div className="flex flex-col items-center text-center px-4 py-8">
              <div className="mb-6 text-primary">
                <Quote className="h-10 w-10 opacity-50" />
              </div>

              <p className="text-lg md:text-xl italic mb-8 max-w-3xl">"{testimonials[activeIndex].content}"</p>

              <Avatar className="h-16 w-16 border-2 border-primary mb-4">
                <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                <AvatarFallback>
                  {testimonials[activeIndex].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
              <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index ? "bg-primary w-6" : "bg-muted hover:bg-primary/50"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
        onClick={handlePrev}
        aria-label="Previous testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
        onClick={handleNext}
        aria-label="Next testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  )
}

