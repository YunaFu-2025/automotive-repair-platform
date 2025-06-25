"use client"

import React from "react"
import { Point, Rect, routeWire } from "@/lib/pathfinding"

export interface WireSpec {
  id: string
  from: Point
  to: Point
}

interface CircuitCanvasProps {
  components: Rect[]
  wires: WireSpec[]
  /** pixel width */
  width: number
  /** pixel height */
  height: number
  /** grid size for router */
  gridSize?: number
}

/**
 * Simple SVG-based canvas that renders rectangular components and auto-routes wires between them.
 */
const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  wires,
  width,
  height,
  gridSize = 10,
}: CircuitCanvasProps) => {
  // Precompute obstacle rects (components) for router
  const paths = React.useMemo(() => {
    return wires.map((w: WireSpec) => ({
      id: w.id,
      points: routeWire(w.from, w.to, components, { gridSize }) ?? [],
    }))
  }, [wires, components, gridSize])

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
      {/* Render components as grey rectangles */}
      {components.map((c: Rect, i: number) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.width}
          height={c.height}
          fill="#e0e0e0"
          stroke="#333"
        />
      ))}

      {/* Render wires */}
      {paths.map((p: { id: string; points: Point[] }) => (
        <polyline
          key={p.id}
          points={p.points.map((pt: Point) => `${pt.x},${pt.y}`).join(" ")}
          fill="none"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

export default CircuitCanvas