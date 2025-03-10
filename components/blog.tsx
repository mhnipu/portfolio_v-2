"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type BlogPost = {
  id: number
  title: string
  excerpt: string
  date: string
  tags: string[]
  readTime: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React Three Fiber",
    excerpt: "Learn how to create stunning 3D experiences on the web using React Three Fiber.",
    date: "May 15, 2023",
    tags: ["React", "Three.js", "WebGL"],
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Building a Design System with Tailwind CSS",
    excerpt: "A comprehensive guide to creating a scalable design system using Tailwind CSS.",
    date: "June 22, 2023",
    tags: ["CSS", "Design", "Tailwind"],
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "The Future of Web Development with AI",
    excerpt: "Exploring how AI is transforming the landscape of web development and design.",
    date: "July 10, 2023",
    tags: ["AI", "Web Dev", "Future"],
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
  },
]

export default function Blog() {
  const [interest, setInterest] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateSuggestions = async () => {
    if (!interest.trim()) return

    setIsLoading(true)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate 3 blog post title ideas related to ${interest} in the context of web development, design, or technology. Return only the titles separated by triple pipes (|||).`,
      })

      const titles = text
        .split("|||")
        .map((title) => title.trim())
        .filter(Boolean)
      setSuggestions(titles)
    } catch (error) {
      console.error("Error generating suggestions:", error)
      setSuggestions([
        `Latest Trends in ${interest} for Web Developers`,
        `How to Integrate ${interest} in Your Next Project`,
        `The Future of ${interest} in Modern Web Applications`,
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="blog" className="py-20 relative">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My <span className="text-primary">Blog</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Thoughts, tutorials, and insights about web development and design.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="h-full overflow-hidden backdrop-blur-sm bg-background/70 border-border/50 hover:border-primary/50 transition-all">
              <div className="overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader className="p-6 pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <Badge variant="outline">{post.readTime}</Badge>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <p className="text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="backdrop-blur-sm bg-background/70 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Blog Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Enter a topic you're interested in, and I'll suggest some blog post ideas.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, WebGL, Design Systems"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="flex-1"
              />
              <Button onClick={generateSuggestions} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Suggested Topics:</h4>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="p-3 rounded-md bg-primary/10 border border-primary/20">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

