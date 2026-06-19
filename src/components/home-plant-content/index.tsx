import type { ReactNode } from 'react'

import type { HomePlantId } from '../../data/home-plants'
import { PodcastPlantContent } from './podcast-content'

const HOME_PLANT_CONTENT: Partial<Record<HomePlantId, () => ReactNode>> = {
  podcasts: () => <PodcastPlantContent />,
}

export function getHomePlantContent(id: HomePlantId) {
  const render = HOME_PLANT_CONTENT[id]
  return render?.() ?? null
}
