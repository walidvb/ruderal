import { createFileRoute } from '@tanstack/react-router'

import { HomeBackground } from './home-background'
import { HOME_PLANTS, type HomePlant } from '#/data/home-plants'
import { HomePlantDrawer } from '#/components/home-plant-drawer'
import { useCallback, useState, type CSSProperties } from 'react'
import { cn } from '#/lib/cn'

export const Route = createFileRoute('/index copy')({ component: Home })

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

  const handlePlantClick = useCallback((id: number) => {
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
          'relative z-[1] min-h-screen h-screen container mx-auto bg-gray-300',
          'bg-contain bg-center bg-no-repeat bg-[url(/assets/bg.svg)]',
        )}
      >
        <div className="">
          {HOME_PLANTS.map((plant) => (
            <HomeBgPlant
              key={plant.id}
              plant={plant}
              shouldAnimate={true}
              onClick={handlePlantClick}
            />
          ))}
          <HomePlantDrawer
            plant={selectedPlant}
            customContent={null}
            onOpenChange={handleDrawerOpenChange}
            onMenuClick={handlePlantClick}
            selectedMenu={selectedPlant}
          />
        </div>
      </main>
    </>
  )
}
