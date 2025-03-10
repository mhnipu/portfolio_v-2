"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThreeDCard } from "@/components/ui/3d-card"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonial"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content:
      "Working with John was an absolute pleasure. His attention to detail and ability to translate our vision into a beautiful, functional website exceeded our expectations. He's not just a developer, but a true problem solver.",
    category: "web",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder of StartupX",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    content:
      "John helped us rebuild our entire web platform from scratch. His technical expertise combined with his eye for design resulted in a product that not only works flawlessly but looks stunning. Our user engagement has increased by 40% since launch.",
    category: "web",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Creative Director",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "I've worked with many developers over the years, but John stands out for his creativity and collaborative approach. He doesn't just implement requirements—he enhances them with thoughtful suggestions that made our project even better.",
    category: "design",
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO at InnovateTech",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    content:
      "John's technical skills are impressive, but what really sets him apart is his communication and reliability. He delivered our complex project on time and was always transparent about progress and challenges. A true professional.",
    category: "web",
  },
  {
    id: 5,
    name: "Sophia Martinez",
    role: "UI/UX Lead at DesignHub",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "John has an exceptional eye for design and user experience. He transformed our outdated interface into a modern, intuitive system that our users love. His ability to balance aesthetics with functionality is remarkable.",
    category: "design",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "E-commerce Director",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    content:
      "Our online store's conversion rate increased by 35% after John redesigned our checkout process. He identified pain points we hadn't even noticed and implemented elegant solutions. I highly recommend his services to any e-commerce business.",
    category: "web",
  },
  {
    id: 7,
    name: "Olivia Taylor",
    role: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    content:
      "John created a stunning landing page for our product launch that perfectly captured our brand voice. The page loaded quickly, looked beautiful on all devices, and most importantly, converted visitors into customers at an impressive rate.",
    category: "marketing",
  },
  {
    id: 8,
    name: "Daniel Lee",
    role: "Mobile App Developer",
    avatar: "https://randomuser.me/api/portraits/men/59.jpg",
    content:
      "As a fellow developer, I was impressed by John's clean code and thoughtful architecture. We collaborated on a complex project, and his frontend expertise complemented my backend skills perfectly. I'd work with him again in a heartbeat.",
    category: "development",
  },
]

export default function Testimonials() {
  const [activeCategory, setActiveCategory] = useState("all")

  // Get testimonials for the current category
  const filteredTestimonials =
    activeCategory === "all" ? testimonials : testimonials.filter((t) => t.category === activeCategory)

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Client <span className="text-primary">Testimonials</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          What people say about working with me.
        </motion.p>
      </div>

      {/* Featured Animated Testimonials */}
      <div className="max-w-4xl mx-auto mb-20">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <Tabs defaultValue="all" className="mb-12" onValueChange={setActiveCategory}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web Development</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </TabsContent>

          {["web", "design", "marketing", "development"].map((category) => (
            <TabsContent key={category} value={category}>
              {testimonials.filter((t) => t.category === category).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {testimonials
                    .filter((t) => t.category === category)
                    .map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No testimonials found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <ThreeDCard className="h-full">
        <div className="p-6 flex flex-col h-full backdrop-blur-sm bg-background/70 border border-border/50 hover:border-primary/50 transition-all rounded-xl">
          <div className="mb-4 text-primary">
            <Quote className="h-6 w-6 opacity-70" />
          </div>

          <p className="text-sm italic flex-grow mb-4">
            "{testimonial.content.length > 150 ? `${testimonial.content.substring(0, 150)}...` : testimonial.content}"
          </p>

          <div className="flex items-center mt-auto pt-4 border-t border-border/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h4 className="font-medium text-sm">{testimonial.name}</h4>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </ThreeDCard>
    </motion.div>
  )
}

