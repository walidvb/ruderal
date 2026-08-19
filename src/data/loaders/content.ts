import { createServerFn } from '@tanstack/react-start'
import { sdk } from '@/data/strapi-sdk'
import type {
  TPage,
  TPodcast,
  TStrapiResponseCollection,
  TStrapiResponseSingle,
  TStudyGroup,
} from '@/types/strapi'

/**
 * Single types holding the editable copy for each page
 */
export const PAGES = [
  'podcast-page',
  'study-group-page',
  'happening-page',
  'about-page',
] as const

export type TPageSlug = (typeof PAGES)[number]

export const getPodcastsData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<TStrapiResponseCollection<TPodcast>> =>
    sdk.collection('podcasts').find({
      sort: ['date:desc'],
      populate: ['thumbnail'],
    }) as Promise<TStrapiResponseCollection<TPodcast>>,
)

export const getStudyGroupsData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<TStrapiResponseCollection<TStudyGroup>> =>
    sdk.collection('study-groups').find({
      sort: ['date:desc'],
      populate: ['image'],
    }) as Promise<TStrapiResponseCollection<TStudyGroup>>,
)

/**
 * Fetch the copy for one of the page single types
 */
export const getPageData = createServerFn({ method: 'GET' })
  .inputValidator((slug: TPageSlug) => {
    if (!PAGES.includes(slug)) throw new Error(`Unknown page: ${slug}`)
    return slug
  })
  .handler(
    async ({ data: slug }): Promise<TStrapiResponseSingle<TPage>> =>
      sdk.single(slug).find() as Promise<TStrapiResponseSingle<TPage>>,
  )
