import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'

import { cn } from '#/lib/cn'

type SVGTextSizerProps = ComponentPropsWithoutRef<'svg'>

function getSvgScale(svg: SVGSVGElement) {
  const ctm = svg.getScreenCTM()
  if (!ctm) return null

  const scale = Math.hypot(ctm.a, ctm.b)
  return scale > 0 ? scale : null
}

function fixTextScaling(svg: SVGSVGElement) {
  const updateTextFactor = () => {
    const scale = getSvgScale(svg)
    if (!scale) return
    svg.style.setProperty('--text-factor', String(1 / scale))
  }

  svg.style.setProperty('--text-factor', '0')
  updateTextFactor()

  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(updateTextFactor)
  })
  resizeObserver.observe(svg)

  return resizeObserver
}

export function SVGTextSizer({
  className,
  children,
  ...props
}: SVGTextSizerProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const resizeObserver = fixTextScaling(svg)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <svg ref={svgRef} className={cn('svg-text-sizer', className)} {...props}>
      {children}
    </svg>
  )
}
