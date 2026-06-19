import { useCallback, useEffect, useRef, useState } from 'react'

import homeBackgroundSvg from '../assets/home-background.svg?raw'
import type { HomePlantId } from '../data/home-plants'
import { getHomePlant } from '../data/home-plants'
import { fixSvgTextScaling } from '../lib/fix-svg-text-scaling'
import { HOME_BACKGROUND_ANIMATION } from '../lib/home-background-animation'
import { buildLineRevealPath } from '../lib/home-background-lines'

const ORIGIN = { x: 828, y: 538 }
const VIEWBOX = { width: 1728, height: 1098 }
const REVEAL_STROKE_WIDTH = 220

const { lineGrowDurationMs, lineStaggerMs, centerPlantDelayMs, plantAppearDurationMs } =
  HOME_BACKGROUND_ANIMATION

const PLANT_SELECTORS = [
  '.home-bg-plant--podcasts',
  '.home-bg-plant--happenings',
  '.home-bg-plant--about',
  '.home-bg-plant--study-group',
] as const

type RevealPathSetup = {
  revealPath: SVGPathElement
  length: number
  index: number
}

type LineEndTime = { center: { x: number; y: number }; endMs: number }

function getDefs(svg: SVGSVGElement) {
  let defs = svg.querySelector('defs')
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    svg.prepend(defs)
  }
  return defs
}

function getElementCenter(element: SVGGraphicsElement) {
  const box = element.getBBox()
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
}

function waitForSvgImages(svg: SVGSVGElement) {
  const images = [...svg.querySelectorAll('image')]

  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          const href =
            image.getAttribute('href') ?? image.getAttribute('xlink:href') ?? ''

          if (href.startsWith('data:')) {
            resolve()
            return
          }

          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  )
}

async function waitUntilPageReady(svg: SVGSVGElement) {
  if (document.readyState !== 'complete') {
    await new Promise<void>((resolve) => {
      window.addEventListener('load', () => resolve(), { once: true })
    })
  }

  await waitForSvgImages(svg)
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function prepareLineMasks(svg: SVGSVGElement) {
  const defs = getDefs(svg)
  const paths = [...svg.querySelectorAll<SVGPathElement>('.home-bg-line')]
  const revealPaths: RevealPathSetup[] = []

  paths.forEach((path, index) => {
    const revealD = buildLineRevealPath(path, ORIGIN)
    if (!revealD) return

    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    path.parentNode?.insertBefore(wrapper, path)
    wrapper.appendChild(path)

    const maskId = `home-bg-line-mask-${index + 1}`
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
    mask.id = maskId
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('x', '0')
    mask.setAttribute('y', '0')
    mask.setAttribute('width', String(VIEWBOX.width))
    mask.setAttribute('height', String(VIEWBOX.height))

    const maskBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    maskBg.setAttribute('width', String(VIEWBOX.width))
    maskBg.setAttribute('height', String(VIEWBOX.height))
    maskBg.setAttribute('fill', 'black')
    mask.appendChild(maskBg)

    const revealPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    revealPath.setAttribute('d', revealD)
    revealPath.setAttribute('fill', 'none')
    revealPath.setAttribute('stroke', 'white')
    revealPath.setAttribute('stroke-width', String(REVEAL_STROKE_WIDTH))
    revealPath.setAttribute('stroke-linecap', 'round')
    revealPath.setAttribute('stroke-linejoin', 'round')
    mask.appendChild(revealPath)

    defs.appendChild(mask)
    wrapper.setAttribute('mask', `url(#${maskId})`)

    const length = revealPath.getTotalLength()
    revealPath.style.strokeDasharray = `${length}`
    revealPath.style.strokeDashoffset = `${length}`

    revealPaths.push({ revealPath, length, index })
  })

  return revealPaths
}

function runLineAnimations(
  revealPaths: RevealPathSetup[],
  reducedMotion: boolean,
) {
  const lineEndTimes: LineEndTime[] = []

  for (const { revealPath, length, index } of revealPaths) {
    const delayMs = index * lineStaggerMs

    if (reducedMotion) {
      revealPath.style.strokeDashoffset = '0'
    } else {
      revealPath.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration: lineGrowDurationMs,
          delay: delayMs,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        },
      )
    }

    const tip = revealPath.getPointAtLength(length)
    lineEndTimes.push({
      center: tip,
      endMs: delayMs + lineGrowDurationMs,
    })
  }

  return lineEndTimes
}

function preparePlants(svg: SVGSVGElement) {
  for (const selector of PLANT_SELECTORS) {
    const plant = svg.querySelector<SVGGElement>(selector)
    if (!plant) continue

    plant.style.transformBox = 'fill-box'
    plant.style.transformOrigin = 'center'
    plant.style.transform = 'scale(0)'
  }
}

function setupPlantLinks(
  svg: SVGSVGElement,
  onPlantClick: (id: HomePlantId) => void,
) {
  for (const link of svg.querySelectorAll<SVGAElement>('.home-bg-plant-link')) {
    const id = link.dataset.plantId as HomePlantId | undefined
    if (!id) continue

    const plant = getHomePlant(id)
    if (plant) link.setAttribute('aria-label', plant.title)

    link.addEventListener('click', (event) => {
      event.preventDefault()
      onPlantClick(id)
    })
  }
}

function runPlantAnimations(
  svg: SVGSVGElement,
  lineEndTimes: LineEndTime[],
  reducedMotion: boolean,
) {
  for (const selector of PLANT_SELECTORS) {
    const plant = svg.querySelector<SVGGElement>(selector)
    if (!plant) continue

    let delayMs: number = lineGrowDurationMs

    if (selector === '.home-bg-plant--podcasts') {
      delayMs = centerPlantDelayMs
    } else {
      const plantCenter = getElementCenter(plant)
      const nearestLineEnd = lineEndTimes.reduce<{ dist: number; endMs: number }>(
        (best, line) => {
          const dist = Math.hypot(
            line.center.x - plantCenter.x,
            line.center.y - plantCenter.y,
          )
          return dist < best.dist ? { dist, endMs: line.endMs } : best
        },
        { dist: Number.POSITIVE_INFINITY, endMs: lineGrowDurationMs },
      )
      delayMs = nearestLineEnd.endMs
    }

    if (reducedMotion) {
      plant.style.transform = 'scale(1)'
      continue
    }

    plant.animate(
      [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
      {
        duration: plantAppearDurationMs,
        delay: delayMs,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards',
      },
    )
  }
}

export function HomeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  const handlePlantClick = useCallback((id: HomePlantId) => {
    const plant = getHomePlant(id)
    if (!plant) return

    if (plant.url) {
      window.open(plant.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = homeBackgroundSvg

    const svg = container.querySelector('svg')
    if (!svg) return

    const disconnectTextScaling = fixSvgTextScaling(svg)
    setupPlantLinks(svg, handlePlantClick)

    let cancelled = false
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const revealPaths = prepareLineMasks(svg)
    preparePlants(svg)

    waitUntilPageReady(svg).then(() => {
      if (cancelled) return

      setIsReady(true)

      requestAnimationFrame(() => {
        if (cancelled) return
        const lineEndTimes = runLineAnimations(revealPaths, reducedMotion)
        runPlantAnimations(svg, lineEndTimes, reducedMotion)
      })
    })

    return () => {
      cancelled = true
      disconnectTextScaling()
    }
  }, [handlePlantClick])

  return (
    <>
      {!isReady && <div className="home-loading-screen" aria-hidden />}
      <div className={`home-bg${isReady ? ' home-bg--ready' : ''}`}>
        <div className="home-bg-stage">
          <div ref={containerRef} className="home-bg-svg-host" />
        </div>
      </div>
    </>
  )
}
