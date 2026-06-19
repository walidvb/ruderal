export function fixSvgTextScaling(svg: SVGSVGElement) {
  const viewBox = svg.getAttribute('viewBox')
  if (!viewBox) return () => {}

  const naturalWidth = Number(viewBox.split(' ')[2])
  if (!naturalWidth) return () => {}

  const update = () => {
    if (!svg.clientWidth) return
    svg.style.setProperty('--text-factor', String(naturalWidth / svg.clientWidth))
  }

  update()
  svg.classList.add('home-bg-svg--loaded')

  const resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(svg)

  return () => resizeObserver.disconnect()
}
