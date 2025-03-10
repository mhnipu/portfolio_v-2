"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  start: () => void
  stop: () => void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
  item(index: number): SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
  item(index: number): SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex
        const result = event.results[current][0].transcript
        setTranscript(result)

        // Process commands
        processCommand(result.toLowerCase())
      }

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)

        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        })
      }

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start()
        }
      }

      setRecognition(recognitionInstance)
    } else {
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support voice commands. Please try a different browser.",
        variant: "destructive",
      })
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)

      toast({
        title: "Voice Commands Disabled",
        description: "Voice command recognition has been turned off.",
      })
    } else {
      recognition.start()
      setIsListening(true)

      toast({
        title: "Voice Commands Enabled",
        description: "Try saying: 'go to projects', 'scroll down', 'dark mode', or 'light mode'.",
      })
    }
  }

  const processCommand = (command: string) => {
    // Navigation commands
    if (command.includes("go to home") || command.includes("go home")) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      speakResponse("Navigating to home section")
    } else if (command.includes("go to projects") || command.includes("show projects")) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
      speakResponse("Navigating to projects section")
    } else if (command.includes("go to skills") || command.includes("show skills")) {
      document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })
      speakResponse("Navigating to skills section")
    } else if (command.includes("go to blog") || command.includes("show blog")) {
      document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" })
      speakResponse("Navigating to blog section")
    } else if (command.includes("go to contact") || command.includes("contact me")) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
      speakResponse("Navigating to contact section")
    } else if (command.includes("go to achievements") || command.includes("show achievements")) {
      document.getElementById("achievements")?.scrollIntoView({ behavior: "smooth" })
      speakResponse("Navigating to achievements section")
    }

    // Scroll commands
    else if (command.includes("scroll down")) {
      window.scrollBy({ top: 300, behavior: "smooth" })
      speakResponse("Scrolling down")
    } else if (command.includes("scroll up")) {
      window.scrollBy({ top: -300, behavior: "smooth" })
      speakResponse("Scrolling up")
    }

    // Theme commands
    else if (command.includes("dark mode") || command.includes("switch to dark")) {
      document.documentElement.classList.add("dark")
      speakResponse("Dark mode activated")
    } else if (command.includes("light mode") || command.includes("switch to light")) {
      document.documentElement.classList.remove("dark")
      speakResponse("Light mode activated")
    }

    // Help command
    else if (command.includes("help") || command.includes("what can you do")) {
      speakResponse(
        "You can say: go to projects, go to skills, go to blog, go to contact, scroll up, scroll down, dark mode, or light mode",
      )
    }
  }

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.volume = 0.8
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
          isListening ? "animate-pulse bg-primary" : ""
        }`}
        title={isListening ? "Voice Commands Active" : "Enable Voice Commands"}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>

      {transcript && isListening && (
        <div className="absolute bottom-16 right-0 w-48 rounded-lg bg-background p-2 text-xs shadow-lg">
          <p className="font-medium">I heard:</p>
          <p className="text-muted-foreground">{transcript}</p>
        </div>
      )}
    </div>
  )
}

