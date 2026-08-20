import { notFound } from "next/navigation";

import { InfoBadge } from "@/components/info-badge";
import { getPageCopy } from "@/lib/content";
import { navItem } from "@/lib/nav";

const nav = navItem("/about");

export const metadata = { title: "About — Ruderal" };

/** About shows the same copy as the info panel, but opened out across the page. */
export default async function AboutPage() {
  const copy = await getPageCopy(nav.pageSlug);
  if (!copy) notFound();

  return (
    <div className="mx-auto w-full max-w-[1145px] px-6">
      <div className="rounded-card bg-surface shadow-card backdrop-blur-card flex flex-col gap-2 px-5 pt-5 pb-3">
        <InfoBadge label={nav.infoLabel} />
        <hr className="border-rule border-t" />
        <div className="font-display text-xl leading-7 text-black">
          <p className="font-bold">{copy.title}</p>
          {copy.description && (
            <div className="mt-7 gap-15 md:columns-2">
              {copy.description.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mb-7">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
