import { createFileRoute } from '@tanstack/react-router'

import {
  HOME_PLANTS,
  type HomePlant,
  type HomePlantId,
} from '#/data/home-plants'
import { HomePlantDrawer } from '#/components/home-plant-drawer'
import { useCallback, useState, type CSSProperties } from 'react'
import { cn } from '#/lib/cn'
import ResponsiveHomeSVG from '#/components/HomeSVG'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [selectedPlant, setSelectedPlant] = useState<HomePlant | null>(null)

  const handlePlantClick = useCallback((id: HomePlantId) => {
    const plant = HOME_PLANTS.find((plant) => plant.id === id)
    if (!plant) {
      console.log('Plant not found', id)
      return
    }

    setSelectedPlant(plant)
  }, [])

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedPlant(null)
  }, [])
  return (
    <>
      <main className={cn('relative min-h-screen h-screen w-full mx-auto ')}>
        <h1 className="text-4xl font-semibold fixed top-2 left-2">Ruderal</h1>
        <ResponsiveHomeSVG
          className="absolute w-full h-full"
          onClick={handlePlantClick}
        />
        <HomePlantDrawer
          plant={selectedPlant}
          customContent={null}
          onOpenChange={handleDrawerOpenChange}
          onMenuClick={handlePlantClick}
          selectedMenu={selectedPlant}
        />
      </main>
    </>
  )
}
