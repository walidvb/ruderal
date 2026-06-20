"use client"

import { useEffect, useRef, useState } from "react"

// Animation tuning
const MIN_DURATION = 3 // seconds
const MAX_DURATION = 4 // seconds
const MIN_STAGGER = 150 // ms
const MAX_STAGGER = 250 // ms

export function AnimatedLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      console.log("No Container")
      return
    }


    let cancelled = false

    async function run() {
      const res = await fetch("/assets/bg.svg")
      const markup = await res.text()
      console.log("Markup",  markup)
      if (cancelled || !container) return

      container.innerHTML = markup

      const svg = container.querySelector("svg")
      if (!svg) return

      // Make the SVG scale to its container while keeping aspect ratio.
      svg.removeAttribute("width")
      svg.removeAttribute("height")
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
      svg.style.width = "100%"
      svg.style.height = "auto"
      svg.style.display = "block"

      const svgNS = "http://www.w3.org/2000/svg"
      const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"))

      // These paths are filled outline shapes, so make sure they render.
      for (const path of paths) {
        path.style.fill = "var(--line-color)"
        path.style.stroke = "none"
      }

      // The drawing region (used to size the reveal masks).
      const vb = svg.viewBox.baseVal

      // Compute the center of the whole composition (the point all the
      // lines radiate from). Every line will grow outward from here.
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const path of paths) {
        const box = path.getBBox()
        minX = Math.min(minX, box.x)
        minY = Math.min(minY, box.y)
        maxX = Math.max(maxX, box.x + box.width)
        maxY = Math.max(maxY, box.y + box.height)
      }
      const cx = (minX + maxX) / 2
      const cy = (minY + maxY) / 2

      // A consistent stagger order: left-to-right based on each path's center.
      const ordered = paths
        .map((path) => {
          const box = path.getBBox()
          return { path, box, mid: box.x + box.width / 2 }
        })
        .sort((a, b) => a.mid - b.mid)

      // One <defs> to hold every line's reveal mask.
      const defs = document.createElementNS(svgNS, "defs")
      svg.insertBefore(defs, svg.firstChild)

      ordered.forEach(({ path, box }, i) => {
        // The reveal is a circle centered on the composition's center whose
        // radius grows from 0 to cover this line. Because every line
        // radiates outward from that center, expanding the circle uncovers
        // each line bit by bit, from the center toward its tip.
        const corners = [
          Math.hypot(box.x - cx, box.y - cy),
          Math.hypot(box.x + box.width - cx, box.y - cy),
          Math.hypot(box.x - cx, box.y + box.height - cy),
          Math.hypot(box.x + box.width - cx, box.y + box.height - cy),
        ]
        const maxDist = Math.max(...corners) + 4 // small padding

        const maskId = `reveal-${i}-${key}`
        const mask = document.createElementNS(svgNS, "mask")
        mask.setAttribute("id", maskId)
        mask.setAttribute("maskUnits", "userSpaceOnUse")
        mask.setAttribute("x", String(vb.x))
        mask.setAttribute("y", String(vb.y))
        mask.setAttribute("width", String(vb.width))
        mask.setAttribute("height", String(vb.height))

        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("cx", String(cx))
        circle.setAttribute("cy", String(cy))
        circle.setAttribute("r", "0")
        circle.setAttribute("fill", "white")

        const duration =
          MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION)
        const stagger =
          MIN_STAGGER + Math.random() * (MAX_STAGGER - MIN_STAGGER)

        circle.style.setProperty("--r", `${maxDist}px`)
        circle.style.animation = `grow-radius ${duration.toFixed(2)}s ease-out both`
        circle.style.animationDelay = `${((i * stagger) / 1000).toFixed(3)}s`

        mask.appendChild(circle)
        defs.appendChild(mask)
        path.setAttribute("mask", `url(#${maskId})`)
      })
    }

    run()

    return () => {
      cancelled = true
    }
  }, [key])

  return (
    <>
      <style>{`
        @keyframes grow-radius {
          from {
            r: 0px;
          }
          to {
            r: var(--r);
          }
        }
      `}</style>
      <div ref={containerRef} className="w-full" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        className="mt-8 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
      >
        Replay animation
      </button>
    </>
  )
}
