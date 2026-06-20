import type { HomePlantId } from '../data/home-plants'

export const HOME_BACKGROUND_ANIMATION = {
  lineGrowDurationMs: 6000,
  lineStaggerMs: 200,
  plantGrowDurationMs: 350,
  plantDelaysMs: {
    podcasts: 6200,
    about: 6400,
    happenings: 6600,
    'study-group': 6800,
  } satisfies Record<HomePlantId, number>,
} as const
