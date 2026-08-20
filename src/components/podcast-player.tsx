"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import type { Entry } from "@/lib/content";

// react-player builds on custom elements, so it only renders in the browser.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function PodcastPlayer({ items }: { items: Entry[] }) {
  // Open on the most recent episode that actually has a video, so the player
  // is never empty on load; fall back to the newest episode either way.
  const [selectedId, setSelectedId] = useState(
    (items.find((item) => item.videoUrl) ?? items[0])?.id,
  );
  const featured = items.find((item) => item.id === selectedId) ?? items[0];

  if (!featured) {
    return (
      <p className="font-sans text-xs leading-caption text-black">
        No episodes published yet.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-col gap-2">
        <div className="rounded-card bg-media aspect-[682/320] w-full overflow-hidden">
          {featured.videoUrl ? (
            <ReactPlayer
              // Remount on change so the new source starts cleanly.
              key={featured.id}
              src={featured.videoUrl}
              controls
              width="100%"
              height="100%"
            />
          ) : (
            featured.imageUrl && (
              <Image
                src={featured.imageUrl}
                alt=""
                width={682}
                height={320}
                className="size-full object-cover"
              />
            )
          )}
        </div>
        <p className="font-sans text-xs leading-caption text-black">
          {featured.description}
        </p>
      </div>

      <div className="grid w-full grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            aria-current={item.id === featured.id}
            title={item.title}
            className="rounded-card bg-media h-28 cursor-pointer overflow-hidden aria-[current=true]:opacity-60"
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt=""
                width={218}
                height={112}
                className="size-full object-cover"
              />
            )}
            <span className="sr-only">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
