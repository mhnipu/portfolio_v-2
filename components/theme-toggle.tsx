"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      data-theme-toggle
      className={cn(
        "relative w-12 h-6 rounded-full p-1 transition-colors duration-300",
        isDark ? "bg-slate-700" : "bg-slate-200",
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center",
          isDark ? "bg-slate-200" : "bg-amber-400",
        )}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? <Moon className="h-3 w-3 text-slate-700" /> : <Sun className="h-3 w-3 text-amber-700" />}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-background border border-border px-2 py-1 rounded shadow-md whitespace-nowrap"
          >
            Switch to {isDark ? "light" : "dark"} mode
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

