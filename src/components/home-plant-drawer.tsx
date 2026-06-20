import * as Dialog from '@radix-ui/react-dialog'
import { Link } from '@tanstack/react-router'
import { ArrowRight, X } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  HOME_PLANTS,
  type HomePlant,
  type HomePlantId,
} from '../data/home-plants'
import { cn } from '#/lib/cn'

type HomePlantDrawerProps = {
  plant: HomePlant | null
  customContent?: ReactNode
  onOpenChange: (open: boolean) => void
  onMenuClick: (id: HomePlantId) => void
  selectedMenu: HomePlant | null
}

function isInternalUrl(url: string) {
  return url.startsWith('/')
}

const TopMenu = ({
  onClick,
  selectedMenu,
}: {
  onClick: (id: HomePlantId) => void
  selectedMenu: HomePlant | null
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 items-center  text-xs pr-10 gap-y-4">
    {HOME_PLANTS.map((plant) => (
      <button
        onClick={() => onClick(plant.id)}
        key={plant.id}
        className={cn(
          'flex items-center gap-[3px] px-3 cursor-pointer',
          'hover:font-bold',
          'whitespace-nowrap',
          selectedMenu?.id === plant.id && 'font-bold',
        )}
      >
        <img src={plant.imageSrc} alt={plant.title} className="h-8" />
        {plant.title}
      </button>
    ))}
  </div>
)


export function HomePlantDrawer({
  plant,
  customContent,
  onOpenChange,
  onMenuClick,
  selectedMenu,
}: HomePlantDrawerProps) {
  const title = plant?.dialogTitle ?? plant?.title ?? ''
  const moreUrl = plant?.url

  return (
    <Dialog.Root
      open={plant !== null}
      onOpenChange={onOpenChange}
      modal={false}
    >
      <Dialog.Portal>
        <Dialog.Content
          className={cn(
            'bg-white/70 backdrop-blur-sm',
            'fixed right-0 top-0 bottom-0',
            'w-[min(100vw,660px)]',
            'p-4',
            'flex flex-col gap-4',
            'overflow-auto',
          )}
          {...(!plant?.description ? { 'aria-describedby': undefined } : {})}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Close className="home-plant-drawer-close" aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </Dialog.Close>

          <TopMenu onClick={onMenuClick} selectedMenu={selectedMenu} />

          <hr className="text-gray-300" />
          <div className="inline-flex flex-col grow md:overflow-hidden">
            <Dialog.Title className="font-bold mb-5 mt-3">{title}</Dialog.Title>

            <div className="grow md:overflow-y-auto">
              {plant?.description ? (
                <Dialog.Description asChild>
                  <p className="">{plant.description}</p>
                </Dialog.Description>
              ) : null}

              {customContent ? (
                <div className="home-plant-drawer-custom">{customContent}</div>
              ) : null}
            </div>

            {moreUrl ? (
              <div className=" inline-flex justify-end pb-3 ">
                {isInternalUrl(moreUrl) ? (
                  <Link to={moreUrl} className="flex gap-2 items-center">
                    More
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <a
                    href={moreUrl}
                    className="flex gap-2 items-center"
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
