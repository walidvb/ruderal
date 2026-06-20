import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

const DEFAULT_DESCRIPTION =
  'Documenting Artistic Practices and Circulating Knowledge'
const DEFAULT_OG_IMAGE = '/open-graph/home.png'

function getPageUrl(pathname: string) {
  const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  return siteUrl ? `${siteUrl}${pathname}` : pathname
}

export const Route = createRootRoute({
  head: ({ matches }) => {
    const pathname = matches.at(-1)?.pathname ?? '/'
    const pageUrl = getPageUrl(pathname)

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Ruderal',
        },
        {
          name: 'description',
          content: DEFAULT_DESCRIPTION,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: 'Ruderal',
        },
        {
          property: 'og:description',
          content: DEFAULT_DESCRIPTION,
        },
        {
          property: 'og:url',
          content: pageUrl,
        },
        {
          property: 'og:image',
          content: DEFAULT_OG_IMAGE,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:description',
          content: DEFAULT_DESCRIPTION,
        },
        {
          name: 'twitter:image',
          content: DEFAULT_OG_IMAGE,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: pageUrl,
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&display=swap',
        },
      ],
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
