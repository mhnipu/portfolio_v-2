"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Minimize2, Maximize2 } from "lucide-react"

const playlist = [
  {
    id: 1,
    title: "Ambient Coding",
    artist: "Lofi Beats",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    audio: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    id: 2,
    title: "Deep Focus",
    artist: "Concentration Music",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop",
    audio:
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8a7bf40db.mp3?filename=electronic-future-beats-117997.mp3",
  },
  {
    id: 3,
    title: "Coding Flow",
    artist: "Dev Tunes",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc8ffd8.mp3?filename=chill-lofi-song-8444.mp3",
  },
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize component as mounted
  useEffect(() => {
    setMounted(true)
    return () => {
      // Clean up animation frame on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Initialize audio element
  useEffect(() => {
    if (!mounted) return

    try {
      // Create audio element only once after component is mounted
      audioRef.current = new Audio()

      // Set initial properties
      if (audioRef.current) {
        audioRef.current.src = playlist[currentTrack].audio
        audioRef.current.volume = volume / 100

        // Add event listeners
        audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.addEventListener("ended", handleEnded)
        audioRef.current.addEventListener("error", () => setAudioError(true))
      }
    } catch (error) {
      console.error("Error initializing audio:", error)
      setAudioError(true)
    }

    return () => {
      // Clean up audio element and event listeners
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.removeEventListener("ended", handleEnded)
        audioRef.current.removeEventListener("error", () => setAudioError(true))
      }
    }
  }, [mounted])

  // Handle track changes
  useEffect(() => {
    if (!mounted || !audioRef.current) return

    try {
      audioRef.current.src = playlist[currentTrack].audio
      audioRef.current.load()

      if (isPlaying) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error)
            setIsPlaying(false)
          })
        }
      }
    } catch (error) {
      console.error("Error changing track:", error)
    }
  }, [currentTrack, isPlaying, mounted])

  // Handle volume changes
  useEffect(() => {
    if (!mounted || !audioRef.current) return

    try {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    } catch (error) {
      console.error("Error changing volume:", error)
    }
  }, [volume, isMuted, mounted])

  // Event handlers defined outside useEffect to avoid recreating them
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    nextTrack()
  }

  const togglePlay = () => {
    if (!mounted || !audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      } else {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error)
          })
        }
        animationRef.current = requestAnimationFrame(updateProgress)
      }

      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error("Error toggling play:", error)
    }
  }

  const updateProgress = () => {
    if (!mounted || !audioRef.current) return

    try {
      const currentProgress = (audioRef.current.currentTime / duration) * 100
      setProgress(currentProgress)
      animationRef.current = requestAnimationFrame(updateProgress)
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const seekTo = (value: number[]) => {
    if (!mounted || !audioRef.current || !duration) return

    try {
      const seekTime = (value[0] / 100) * duration
      audioRef.current.currentTime = seekTime
      setProgress(value[0])
    } catch (error) {
      console.error("Error seeking:", error)
    }
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const currentTime = duration * (progress / 100)

  if (audioError) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <Card className="backdrop-blur-sm bg-background/70 border-border/50 w-64">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Music player unavailable. Please check your audio settings.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed ${isExpanded ? "inset-0 z-50" : "bottom-4 left-4 z-40"}`}
        >
          <div
            className={`${isExpanded ? "fixed inset-0 bg-black/70 backdrop-blur-sm" : "hidden"}`}
            onClick={() => setIsExpanded(false)}
          />

          <Card
            className={`backdrop-blur-sm bg-background/90 border-border/50 overflow-hidden ${
              isExpanded ? "max-w-2xl w-full mx-auto mt-20" : "w-64 shadow-lg"
            }`}
          >
            <CardContent className={`p-0 ${isExpanded ? "flex flex-col md:flex-row" : ""}`}>
              <div className={`relative group ${isExpanded ? "md:w-1/2" : "w-full"}`}>
                <img
                  src={playlist[currentTrack].cover || "/placeholder.svg"}
                  alt={playlist[currentTrack].title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className={`p-4 ${isExpanded ? "md:w-1/2 flex flex-col justify-between" : ""}`}>
                <div>
                  <h3 className="font-bold truncate">{playlist[currentTrack].title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{playlist[currentTrack].artist}</p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider value={[progress]} max={100} step={0.1} onValueChange={seekTo} className="mb-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      {isExpanded && (
                        <Slider
                          value={[volume]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setVolume(value[0])}
                          className="w-20"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevTrack}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size={isExpanded ? "default" : "icon"}
                        onClick={togglePlay}
                        className="text-primary hover:text-primary/80"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            {isExpanded && "Pause"}
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            {isExpanded && "Play"}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextTrack}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Playlist</h4>
                    <div className="space-y-2">
                      {playlist.map((track, index) => (
                        <div
                          key={track.id}
                          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                            currentTrack === index ? "bg-primary/20" : "hover:bg-muted"
                          }`}
                          onClick={() => setCurrentTrack(index)}
                        >
                          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={track.cover || "/placeholder.svg"}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-medium truncate">{track.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                          </div>
                          {currentTrack === index && isPlaying && (
                            <div className="ml-auto flex space-x-1">
                              <div className="w-1 h-4 bg-primary animate-pulse" />
                              <div className="w-1 h-4 bg-primary animate-pulse delay-75" />
                              <div className="w-1 h-4 bg-primary animate-pulse delay-150" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-3 -right-3 bg-background rounded-full shadow-md border border-border w-6 h-6 p-0"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">Close music player</span>
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </motion.div>
      )}

      {!isVisible && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-40 rounded-full shadow-lg"
          onClick={() => setIsVisible(true)}
        >
          <Music className="h-4 w-4" />
        </Button>
      )}
    </AnimatePresence>
  )
}

