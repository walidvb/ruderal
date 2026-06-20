import { createFileRoute } from '@tanstack/react-router'

import { HomeBackground } from '../components/home-background'
import {
  HOME_PLANTS,
  type HomePlant,
  type HomePlantId,
} from '#/data/home-plants'
import { HomePlantDrawer } from '#/components/home-plant-drawer'
import { useCallback, useState, type CSSProperties } from 'react'
import { cn } from '#/lib/cn'
import { HomeSVG } from '#/components/HomeSVG'

export const Route = createFileRoute('/')({ component: Home })

function HomeBgPlant({
  plant,
  shouldAnimate,
  reducedMotion,
  delayMs,
  onClick,
}: {
  plant: HomePlant
  shouldAnimate: boolean
  reducedMotion: boolean
  delayMs: number
  onClick: (id: number) => void
}) {
  const shown = reducedMotion || shouldAnimate

  const id = `plant-${plant.id}`
  return (
    <div
      id={id}
      className={['absolute', plant.className].filter(Boolean).join(' ')}
      style={
        {
          '--plant-top-desktop': `${plant.positionDesktop.top}%`,
          '--plant-left-desktop': `${plant.positionDesktop.left}%`,
          '--label-top-desktop': `${plant.positionDesktop.labelTop}%`,
          '--label-left-desktop': `${plant.positionDesktop.labelLeft}%`,
          '--home-plant-delay': `${delayMs}ms`,
        } as CSSProperties
      }
    >
      <style>{`
        #${id} {
          top: var(--plant-top-desktop);
          left: var(--plant-left-desktop);



        }
      `}</style>
      <button
        type="button"
        className="flex flex-col justify-start text-left"
        aria-label={plant.title}
        onClick={() => onClick(plant.id)}
      >
        <span className="text-lg">{plant.title}</span>
        <img
          className={plant.className}
          src={plant.imageSrc}
          alt=""
          draggable={false}
        />
      </button>
    </div>
  )
}

function Home() {
  const [selectedPlant, setSelectedPlant] = useState<HomePlant | null>(null)

  const handlePlantClick = useCallback((id: HomePlantId) => {
    const plant = HOME_PLANTS.find((plant) => plant.id === id)
    if (!plant) return

    setSelectedPlant(plant)
  }, [])

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedPlant(null)
  }, [])
  return (
    <>
      <main
        className={cn(
          'relative min-h-screen h-screen w-full mx-auto bg-gray-300',
        )}
      >
        <h1 className="text-5xl font-semibold fixed top-8 left-8">Ruderal</h1>
        <HomeSVG
          className="absolute w-full h-full"
          onClick={handlePlantClick}
        />
        <HomePlantDrawer
          plant={selectedPlant}
          customContent={null}
          onOpenChange={handleDrawerOpenChange}
          onMenuClick={handlePlantClick}
        />
      </main>
    </>
  )
}
