const SAMPLE_COUNT = 160

type Point = { x: number; y: number; dist: number; t: number }

function samplePath(path: SVGPathElement, origin: { x: number; y: number }) {
  const length = path.getTotalLength()
  const points: Point[] = []

  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const t = (i / SAMPLE_COUNT) * length
    const pt = path.getPointAtLength(t)
    points.push({
      x: pt.x,
      y: pt.y,
      dist: Math.hypot(pt.x - origin.x, pt.y - origin.y),
      t,
    })
  }

  return { points, length }
}

function getArc(points: Point[], from: number, to: number) {
  if (from <= to) {
    return points.slice(from, to + 1)
  }

  return [...points.slice(from), ...points.slice(0, to + 1)]
}

export function buildLineRevealPath(
  path: SVGPathElement,
  origin: { x: number; y: number },
) {
  const { points } = samplePath(path, origin)

  let closestIdx = 0
  let farthestIdx = 0

  for (let i = 0; i < points.length; i++) {
    if (points[i].dist < points[closestIdx].dist) closestIdx = i
    if (points[i].dist > points[farthestIdx].dist) farthestIdx = i
  }

  const forward = getArc(points, closestIdx, farthestIdx)
  const backward = getArc(points, farthestIdx, closestIdx).reverse()
  const arc =
    forward[forward.length - 1].dist >= forward[0].dist ? forward : backward

  if (arc.length < 2) return ''

  return arc.reduce(
    (d, point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `${d} L ${point.x} ${point.y}`,
    '',
  )
}

export function getPathRevealLength(revealPath: SVGPathElement) {
  return revealPath.getTotalLength()
}
