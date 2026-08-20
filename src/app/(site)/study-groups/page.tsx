import { EntryGrid } from "@/components/entry-grid";
import { InfoPanel } from "@/components/info-panel";
import { getPageCopy, getStudyGroups } from "@/lib/content";
import { navItem } from "@/lib/nav";

const nav = navItem("/study-groups");

export const metadata = { title: "Study groups — Ruderal" };

export default async function StudyGroupsPage() {
  const [entries, copy] = await Promise.all([
    getStudyGroups(),
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
