import Image from "next/image";

import type { Entry } from "@/lib/content";

/** The poster grid shared by study groups and happenings. */
export function EntryGrid({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <p className="font-sans text-xs leading-caption text-black">
        Nothing published yet.
      </p>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1168px] grid-cols-2 gap-15 px-6 md:grid-cols-4">
      {entries.map((entry) => (
        <article key={entry.id} className="flex flex-col gap-2">
          <div className="rounded-card bg-media relative aspect-[247/320] w-full overflow-hidden">
            {entry.imageUrl ? (
              <Image
                src={entry.imageUrl}
                alt=""
                fill
                sizes="247px"
                className="object-cover"
              />
            ) : (
              <span className="text-accent font-sans text-xs leading-caption absolute inset-0 flex items-center justify-center text-center">
                OPEN CALL
                <br />
                POSTER
              </span>
            )}
          </div>
          <p className="font-sans text-xs leading-caption text-black">
            {entry.description}
          </p>
        </article>
      ))}
    </div>
  );
}
