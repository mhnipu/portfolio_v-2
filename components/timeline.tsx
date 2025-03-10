"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, Award } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const timelineData = [
  {
    id: 1,
    date: "2023 - Present",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    description:
      "Leading the frontend development team, implementing modern UI/UX practices and optimizing application performance.",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    icon: <Briefcase className="h-5 w-5" />,
    type: "work",
  },
  {
    id: 2,
    date: "2021 - 2023",
    title: "Frontend Developer",
    company: "Digital Solutions Ltd.",
    description:
      "Developed responsive web applications and collaborated with designers to implement pixel-perfect interfaces.",
    skills: ["JavaScript", "React", "CSS", "Redux"],
    icon: <Briefcase className="h-5 w-5" />,
    type: "work",
  },
  {
    id: 3,
    date: "2020",
    title: "Master's Degree in Computer Science",
    company: "Tech University",
    description: "Specialized in Human-Computer Interaction and Web Technologies.",
    skills: ["Research", "UI/UX", "Web Development"],
    icon: <GraduationCap className="h-5 w-5" />,
    type: "education",
  },
  {
    id: 4,
    date: "2019 - 2021",
    title: "Junior Web Developer",
    company: "Creative Agency",
    description:
      "Built websites for clients across various industries, focusing on responsive design and accessibility.",
    skills: ["HTML", "CSS", "JavaScript", "WordPress"],
    icon: <Briefcase className="h-5 w-5" />,
    type: "work",
  },
  {
    id: 5,
    date: "2019",
    title: "Web Development Certification",
    company: "Coding Bootcamp",
    description: "Intensive 12-week program covering full-stack web development.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    icon: <Award className="h-5 w-5" />,
    type: "education",
  },
]

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const timeline = timelineRef.current
    if (!timeline) return

    gsap.fromTo(
      ".timeline-line",
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: timeline,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} id="journey" className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          My <span className="text-primary">Journey</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The path that led me to where I am today.
        </motion.p>
      </div>

      <div ref={timelineRef} className="relative max-w-3xl mx-auto px-4 md:px-0">
        {/* Timeline line */}
        <div className="timeline-line absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 h-full"></div>

        {/* Timeline items */}
        <div className="space-y-12">
          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary z-10">
                    {item.icon}
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>
                </div>

                <Card className="flex-1 backdrop-blur-sm bg-background/70 border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-primary">{item.company}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`mt-2 md:mt-0 ${
                          item.type === "education"
                            ? "border-blue-500 text-blue-500"
                            : "border-green-500 text-green-500"
                        }`}
                      >
                        {item.date}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{item.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

