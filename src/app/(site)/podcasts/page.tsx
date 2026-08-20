import { InfoPanel } from "@/components/info-panel";
import { PodcastPlayer } from "@/components/podcast-player";
import { getPageCopy, getPodcasts } from "@/lib/content";
import { navItem } from "@/lib/nav";

const nav = navItem("/podcasts");

export const metadata = { title: "Podcasts — Ruderal" };

export default async function PodcastsPage() {
  const [items, copy] = await Promise.all([
    getPodcasts(),
    getPageCopy(nav.pageSlug),
  ]);

  return (
    <>
      {copy && (
        <InfoPanel
          label={nav.infoLabel}
          title={copy.title}
          body={copy.description}
        />
      )}
      <div className="mx-auto w-full max-w-[682px] px-3 py-5">
        <PodcastPlayer items={items} />
      </div>
    </>
  );
}
