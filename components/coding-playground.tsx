"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Download, Copy, Check } from "lucide-react"

const defaultHtml = `<div class="playground-demo">
  <h1>Hello, World!</h1>
  <p>Edit the code to see changes in real-time.</p>
  <button class="demo-button">Click Me</button>
</div>`

const defaultCss = `.playground-demo {
  font-family: system-ui, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #4f46e5;
  margin-bottom: 16px;
}

p {
  color: #4b5563;
  margin-bottom: 24px;
}

.demo-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.demo-button:hover {
  background-color: #4338ca;
}`

const defaultJs = `// Add interactivity to the button
const button = document.querySelector('.demo-button');

if (button) {
  button.addEventListener('click', () => {
    alert('Button clicked!');
    
    // Change the button text
    button.textContent = 'Clicked!';
    
    // Add a class to the button
    button.classList.add('clicked');
    
    // Change the background color
    document.querySelector('.playground-demo').style.backgroundColor = '#e0e7ff';
  });
}`

export default function CodingPlayground() {
  const [html, setHtml] = useState(defaultHtml)
  const [css, setCss] = useState(defaultCss)
  const [js, setJs] = useState(defaultJs)
  const [activeTab, setActiveTab] = useState("html")
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update the preview when code changes
  useEffect(() => {
    const updatePreview = () => {
      if (!iframeRef.current) return

      const iframe = iframeRef.current
      const document = iframe.contentDocument

      if (!document) return

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `

      document.open()
      document.write(content)
      document.close()
    }

    const timer = setTimeout(updatePreview, 500)
    return () => clearTimeout(timer)
  }, [html, css, js])

  const handleCopy = () => {
    let codeToCopy = ""

    if (activeTab === "html") codeToCopy = html
    else if (activeTab === "css") codeToCopy = css
    else if (activeTab === "js") codeToCopy = js

    navigator.clipboard.writeText(codeToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `

    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "playground-code.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRun = () => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const document = iframe.contentDocument

    if (!document) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `

    document.open()
    document.write(content)
    document.close()
  }

  return (
    <section id="playground" className="py-20 relative">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Coding <span className="text-primary">Playground</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Try out HTML, CSS, and JavaScript in this interactive playground.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="backdrop-blur-sm bg-background/70 border-border/50">
          <CardHeader className="p-6 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Live Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" onClick={handleRun}>
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="html" className="flex-1">
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="css" className="flex-1">
                      CSS
                    </TabsTrigger>
                    <TabsTrigger value="js" className="flex-1">
                      JavaScript
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="html" className="mt-2">
                    <div className="relative">
                      <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-muted rounded-md resize-none"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        spellCheck="false"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="mt-2">
                    <div className="relative">
                      <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-muted rounded-md resize-none"
                        value={css}
                        onChange={(e) => setCss(e.target.value)}
                        spellCheck="false"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="js" className="mt-2">
                    <div className="relative">
                      <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-muted rounded-md resize-none"
                        value={js}
                        onChange={(e) => setJs(e.target.value)}
                        spellCheck="false"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="bg-white rounded-md overflow-hidden h-[400px] border border-border">
                <iframe ref={iframeRef} title="Code Preview" className="w-full h-full" sandbox="allow-scripts" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

