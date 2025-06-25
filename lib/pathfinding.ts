// Type-safe grid-based A* router for orthogonal (4-way) routing.
// Public API: routeWire(start, end, obstacles, options) → Point[]

export interface Point {
  x: number
  y: number
}

export interface Rect {
  // Top-left origin, pixel units
  x: number
  y: number
  width: number
  height: number
}

export interface RouteOptions {
  /** Size of a single grid cell in the same units as the coordinates (default: 10 px) */
  gridSize?: number
  /** Extra cost added when a bend occurs (default: 5) */
  bendPenalty?: number
  /** Extra padding applied around each obstacle in pixels (safety clearance, default: 2 px) */
  inflate?: number
}

/** Direction encoded as [dx,dy] tuples */
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
]

type DirIndex = 0 | 1 | 2 | 3 | null

interface Node {
  x: number
  y: number
  /** cumulative cost */
  g: number
  /** f = g + h */
  f: number
  dir: DirIndex
  /** string key for Map */
  key: string
  /** parent coordinate packed as key */
  parent?: string
}

function key(x: number, y: number): string {
  return `${x}:${y}`
}

/**
 * Quantise a pixel coordinate to grid coordinate
 */
function toGrid(value: number, gridSize: number): number {
  return Math.floor(value / gridSize)
}

/**
 * Convert grid back to pixel (centre of cell)
 */
function toPixel(gridCoord: number, gridSize: number): number {
  return gridCoord * gridSize + gridSize / 2
}

/** Manhattan distance */
function heuristic(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

/**
 * Expand obstacle rect into blocked grid cells
 */
function rasteriseObstacles(
  obstacles: Rect[],
  blocked: Set<string>,
  gridSize: number,
  inflate: number
) {
  const pad = inflate
  obstacles.forEach((r) => {
    const minX = toGrid(r.x - pad, gridSize)
    const maxX = toGrid(r.x + r.width + pad, gridSize)
    const minY = toGrid(r.y - pad, gridSize)
    const maxY = toGrid(r.y + r.height + pad, gridSize)
    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        blocked.add(key(gx, gy))
      }
    }
  })
}

/**
 * A* search on 4-neighbour grid with bend cost. Returns list of Point in pixel units or null.
 */
export function routeWire(
  start: Point,
  end: Point,
  obstacles: Rect[] = [],
  options: RouteOptions = {}
): Point[] | null {
  const gridSize = options.gridSize ?? 10
  const bendPenalty = options.bendPenalty ?? 5
  const inflate = options.inflate ?? 2

  // Map pixel coords → grid
  const sx = toGrid(start.x, gridSize)
  const sy = toGrid(start.y, gridSize)
  const ex = toGrid(end.x, gridSize)
  const ey = toGrid(end.y, gridSize)

  // Determine search bounds – here we use implicit unbounded grid, blocked set only.
  const blocked = new Set<string>()
  rasteriseObstacles(obstacles, blocked, gridSize, inflate)

  // Remove start & end from blocked (in case they fall inside)
  blocked.delete(key(sx, sy))
  blocked.delete(key(ex, ey))

  const open: Node[] = []
  const startNode: Node = {
    x: sx,
    y: sy,
    g: 0,
    f: heuristic(sx, sy, ex, ey),
    dir: null,
    key: key(sx, sy),
  }
  open.push(startNode)

  const nodeMap = new Map<string, Node>()
  nodeMap.set(startNode.key, startNode)

  while (open.length > 0) {
    // pop min-f; implement simple O(n) selection to keep heapless
    let bestIdx = 0
    let bestF = open[0].f
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < bestF) {
        bestF = open[i].f
        bestIdx = i
      }
    }
    const current = open.splice(bestIdx, 1)[0]

    if (current.x === ex && current.y === ey) {
      return reconstructPath(current, nodeMap, gridSize)
    }

    for (let d: DirIndex = 0; d < DIRS.length; d++) {
      const [dx, dy] = DIRS[d]
      const nx = current.x + dx
      const ny = current.y + dy
      const nKey = key(nx, ny)
      if (blocked.has(nKey)) continue
      // cost
      const turnCost = current.dir === null || current.dir === d ? 0 : bendPenalty
      const tentativeG = current.g + 1 + turnCost

      const existing = nodeMap.get(nKey)
      if (!existing || tentativeG < existing.g) {
        const h = heuristic(nx, ny, ex, ey)
        const n: Node = {
          x: nx,
          y: ny,
          g: tentativeG,
          f: tentativeG + h,
          dir: d as DirIndex,
          key: nKey,
          parent: current.key,
        }
        nodeMap.set(nKey, n)
        open.push(n)
      }
    }
  }

  // No path
  return null
}

function reconstructPath(node: Node, nodes: Map<string, Node>, gridSize: number): Point[] {
  const path: Point[] = []
  let cur: Node | undefined = node
  while (cur) {
    path.push({ x: toPixel(cur.x, gridSize), y: toPixel(cur.y, gridSize) })
    cur = cur.parent ? nodes.get(cur.parent) : undefined
  }
  path.reverse()
  return simplify(path)
}

/** Remove intermediate colinear points */
function simplify(points: Point[]): Point[] {
  if (points.length <= 2) return points
  const result: Point[] = [points[0]]
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1]
    const curr = points[i]
    const next = points[i + 1]
    const dx1 = curr.x - prev.x
    const dy1 = curr.y - prev.y
    const dx2 = next.x - curr.x
    const dy2 = next.y - curr.y
    if (dx1 * dy2 === dy1 * dx2) {
      // colinear -> skip curr
      continue
    }
    result.push(curr)
  }
  result.push(points[points.length - 1])
  return result
}