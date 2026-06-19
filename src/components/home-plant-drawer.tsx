import * as Dialog from '@radix-ui/react-dialog'
import { Link } from '@tanstack/react-router'
import { ArrowRight, X } from 'lucide-react'
import type { ReactNode } from 'react'

import type { HomePlant } from '../data/home-plants'

type HomePlantDrawerProps = {
  plant: HomePlant | null
  customContent?: ReactNode
  onOpenChange: (open: boolean) => void
}

function isInternalUrl(url: string) {
  return url.startsWith('/')
}

export function HomePlantDrawer({
  plant,
  customContent,
  onOpenChange,
}: HomePlantDrawerProps) {
  const title = plant?.dialogTitle ?? plant?.title ?? ''
  const moreUrl = plant?.url

  return (
    <Dialog.Root open={plant !== null} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          className="home-plant-drawer-content"
          {...(!plant?.description ? { 'aria-describedby': undefined } : {})}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="home-plant-drawer-panel">
            <Dialog.Close className="home-plant-drawer-close" aria-label="Close">
              <X size={20} strokeWidth={1.5} />
            </Dialog.Close>

            <Dialog.Title className="home-plant-drawer-title">{title}</Dialog.Title>

            {plant?.description ? (
              <Dialog.Description asChild>
                <p className="home-plant-drawer-description">{plant.description}</p>
              </Dialog.Description>
            ) : null}

            {customContent ? (
              <div className="home-plant-drawer-custom">{customContent}</div>
            ) : null}

            {moreUrl ? (
              <div className="home-plant-drawer-footer">
                {isInternalUrl(moreUrl) ? (
                  <Link to={moreUrl} className="home-plant-drawer-more">
                    More
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <a
                    href={moreUrl}
                    className="home-plant-drawer-more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
