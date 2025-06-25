"use client"

import React from "react"
import CircuitCanvas from "@/components/CircuitCanvas"
import type { Rect, Point } from "@/lib/pathfinding"
import type { WireSpec } from "@/components/CircuitCanvas"

const DemoCircuitPage: React.FC = () => {
  // Demo components (rectangles)
  const components: Rect[] = [
    { x: 100, y: 100, width: 80, height: 40 },
    { x: 400, y: 120, width: 100, height: 60 },
    { x: 200, y: 300, width: 120, height: 50 },
  ]

  const wires: WireSpec[] = [
    {
      id: "w1",
      from: { x: components[0].x + components[0].width, y: components[0].y + components[0].height / 2 } as Point,
      to: { x: components[1].x, y: components[1].y + components[1].height / 2 } as Point,
    },
    {
      id: "w2",
      from: { x: components[1].x + components[1].width / 2, y: components[1].y + components[1].height } as Point,
      to: { x: components[2].x + components[2].width / 2, y: components[2].y } as Point,
    },
  ]

  return (
    <main className="p-4">
      <h2 className="text-2xl font-bold mb-4">Circuit Auto-Routing Demo</h2>
      <CircuitCanvas width={800} height={600} components={components} wires={wires} gridSize={10} />
    </main>
  )
}

export default DemoCircuitPage