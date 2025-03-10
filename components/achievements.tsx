"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import gsap from "gsap"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Award, Code, FileCode, Github, Globe, Lightbulb, Presentation, Trophy, Users } from "lucide-react"

// Achievement data
const achievements = [
  {
    id: 1,
    title: "Open Source Contributor",
    description: "Contributed to 10+ open source projects",
    icon: <Github className="h-6 w-6" />,
    progress: 100,
    level: 3,
    maxLevel: 3,
    unlocked: true,
  },
  {
    id: 2,
    title: "Project Master",
    description: "Completed 25+ client projects",
    icon: <FileCode className="h-6 w-6" />,
    progress: 100,
    level: 5,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: 3,
    title: "Tech Speaker",
    description: "Spoke at 5 tech conferences",
    icon: <Presentation className="h-6 w-6" />,
    progress: 60,
    level: 2,
    maxLevel: 3,
    unlocked: true,
  },
  {
    id: 4,
    title: "Hackathon Winner",
    description: "Won 3 hackathons",
    icon: <Trophy className="h-6 w-6" />,
    progress: 100,
    level: 3,
    maxLevel: 3,
    unlocked: true,
  },
  {
    id: 5,
    title: "Community Builder",
    description: "Built a community of 1000+ developers",
    icon: <Users className="h-6 w-6" />,
    progress: 40,
    level: 2,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: 6,
    title: "Code Artisan",
    description: "Mastered 10+ programming languages",
    icon: <Code className="h-6 w-6" />,
    progress: 80,
    level: 4,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: 7,
    title: "Global Impact",
    description: "Projects used in 20+ countries",
    icon: <Globe className="h-6 w-6" />,
    progress: 60,
    level: 3,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: 8,
    title: "Innovation Guru",
    description: "Created 5+ innovative solutions",
    icon: <Lightbulb className="h-6 w-6" />,
    progress: 70,
    level: 3,
    maxLevel: 4,
    unlocked: true,
  },
  {
    id: 9,
    title: "Master Mentor",
    description: "Mentored 50+ junior developers",
    icon: <Award className="h-6 w-6" />,
    progress: 50,
    level: 2,
    maxLevel: 4,
    unlocked: true,
  },
]

// Locked achievement
const lockedAchievement = {
  id: 10,
  title: "???",
  description: "This achievement is still locked",
  icon: <Trophy className="h-6 w-6" />,
  progress: 0,
  level: 0,
  maxLevel: 5,
  unlocked: false,
}

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState([...achievements, lockedAchievement])
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const achievementsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inView && achievementsRef.current) {
      gsap.from(".achievement-card", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
    }
  }, [inView])

  return (
    <section id="achievements" ref={achievementsRef} className="py-20">
      <div ref={ref} className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Achievements</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {allAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AchievementCard({ achievement }: { achievement: (typeof achievements)[0] | typeof lockedAchievement }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`achievement-card group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${achievement.unlocked ? "" : "opacity-50"}`}
          >
            <CardContent className="p-6">
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {achievement.icon}
              </motion.div>

              <h3 className="mb-1 text-xl font-bold">{achievement.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{achievement.description}</p>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Level {achievement.level}/{achievement.maxLevel}
                </span>
                <Badge variant={achievement.unlocked ? "default" : "outline"}>
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>

              <Progress value={achievement.progress} className="h-2" />

              <div className="mt-4 flex justify-center">
                {Array.from({ length: achievement.maxLevel }).map((_, index) => (
                  <div
                    key={index}
                    className={`mx-1 h-2 w-2 rounded-full ${index < achievement.level ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {achievement.unlocked ? `${achievement.progress}% Complete` : "Keep working to unlock this achievement!"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

