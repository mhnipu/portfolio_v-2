"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import Timeline from "@/components/timeline"
import Testimonials from "@/components/testimonials"
import ParallaxBackground from "@/components/parallax-background"

// Dynamically import components that need browser APIs with no SSR
const InteractiveCursor = dynamic(() => import("@/components/interactive-cursor"), { ssr: false })
const MusicPlayer = dynamic(() => import("@/components/music-player"), { ssr: false })
const SkillsGlobe = dynamic(() => import("@/components/3d-skills-globe"), { ssr: false })

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold">Loading Experience...</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Aurora Background */}
      <ParallaxBackground />

      {/* Only render browser-dependent components after mounting */}
      {isMounted && <InteractiveCursor />}

      <div className="container mx-auto px-4 relative z-10">
        <Hero />
        <About />
        <SkillsGlobe />
        <Timeline />
        <Projects />
        <Testimonials />
        <Blog />
        <Contact />
      </div>

      {isMounted && <MusicPlayer />}
    </main>
  )
}

