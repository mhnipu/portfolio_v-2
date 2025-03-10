"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"

type ProjectCategory = "All" | "Web" | "Mobile" | "UI/UX" | "3D"

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with payment integration and admin dashboard.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
    categories: ["Web", "UI/UX"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "3D Product Configurator",
    description: "Interactive 3D product configurator with real-time customization options.",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000&auto=format&fit=crop",
    categories: ["Web", "3D"],
    technologies: ["Three.js", "React", "WebGL"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Mobile-first task management application with collaborative features.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop",
    categories: ["Mobile", "UI/UX"],
    technologies: ["React Native", "Firebase", "Redux"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Personal portfolio website with interactive elements and animations.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop",
    categories: ["Web", "UI/UX"],
    technologies: ["Next.js", "GSAP", "Tailwind CSS"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "AR Navigation App",
    description: "Augmented reality navigation application for indoor spaces.",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000&auto=format&fit=crop",
    categories: ["Mobile", "3D"],
    technologies: ["ARKit", "Swift", "SceneKit"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Real-time Chat Application",
    description: "End-to-end encrypted real-time chat application with file sharing.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop",
    categories: ["Web", "Mobile"],
    technologies: ["Socket.io", "React", "Node.js", "MongoDB"],
    demoUrl: "#",
    githubUrl: "#",
  },
]

const categories: ProjectCategory[] = ["All", "Web", "Mobile", "UI/UX", "3D"]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.categories.includes(activeCategory))

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My <span className="text-primary">Projects</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A showcase of my recent work and personal projects.
        </motion.p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
            >
              <Card className="h-full overflow-hidden backdrop-blur-sm bg-background/70 border-border/50 hover:border-primary/50 transition-all">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{
                      transform: hoveredProject === project.id ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="bg-background/50 backdrop-blur-sm">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

