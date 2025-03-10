"use client"

import type React from "react"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  ArcElement,
} from "chart.js"
import { Radar } from "react-chartjs-2"
import { cn } from "@/lib/utils"

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement)

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Chart({ children, className, ...props }: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      {children}
    </div>
  )
}

interface ChartRadarProps {
  data: any[]
  dataKey: string
  fill?: string
  stroke?: string
  fillOpacity?: number
  strokeWidth?: number
  animationBegin?: number
  animationDuration?: number
  animationEasing?: string
}

export function ChartRadar({
  data,
  dataKey,
  fill = "rgba(99, 102, 241, 0.3)",
  stroke = "rgb(99, 102, 241)",
  fillOpacity = 0.3,
  strokeWidth = 2,
  animationBegin = 0,
  animationDuration = 2000,
  animationEasing = "ease-out",
}: ChartRadarProps) {
  const chartData: ChartData<"radar"> = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Skills",
        data: data.map((item) => item.value),
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth,
        pointBackgroundColor: stroke,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: stroke,
      },
    ],
  }

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(128, 128, 128, 0.2)",
        },
        grid: {
          color: "rgba(128, 128, 128, 0.2)",
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: "rgba(255, 255, 255, 0.7)",
        },
        ticks: {
          backdropColor: "transparent",
          color: "rgba(255, 255, 255, 0.5)",
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        displayColors: false,
      },
    },
    animation: {
      duration: animationDuration,
      easing: animationEasing as any,
    },
  }

  return <Radar data={chartData} options={options} />
}

export function ChartPolarArea() {
  return null
}

export function ChartPolarGrid() {
  return null
}

export function ChartPolarRadiusAxis() {
  return null
}

export function ChartRadialBar() {
  return null
}

export function ChartTooltip() {
  return null
}

export function ChartLegend() {
  return null
}

export function ChartArea() {
  return null
}

