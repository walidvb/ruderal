import { EntryGrid } from "@/components/entry-grid";
import { InfoPanel } from "@/components/info-panel";
import { getHappenings, getPageCopy } from "@/lib/content";
import { navItem } from "@/lib/nav";

const nav = navItem("/happenings");

export const metadata = { title: "Happenings — Ruderal" };

export default async function HappeningsPage() {
  const [entries, copy] = await Promise.all([
    getHappenings(),
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
      <div className="py-33">
        <EntryGrid entries={entries} />
      </div>
    </>
  );
}
