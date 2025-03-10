"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      console.log("Connecting to WebSocket...")

      // Simulate connection delay
      setTimeout(() => {
        setIsConnected(true)

        // Set initial count
        const initialCount = Math.floor(Math.random() * 50) + 10
        setVisitorCount(initialCount)

        // Simulate visitor count changes
        const interval = setInterval(() => {
          setVisitorCount((prev) => {
            // Random change between -2 and +3
            const change = Math.floor(Math.random() * 6) - 2
            const newCount = Math.max(5, prev + change)
            return newCount
          })
        }, 5000)

        return () => {
          clearInterval(interval)
          setIsConnected(false)
        }
      }, 1500)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Card className="backdrop-blur-sm bg-background/70 border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="relative">
              <Users className="h-5 w-5 text-primary" />
              {isConnected && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isConnected ? (
                  <>
                    <span className="font-bold">{visitorCount}</span> visitors online
                  </>
                ) : (
                  "Connecting..."
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

