/**
 * The four destinations shown in the Figma menu. `infoLabel` is the label on the
 * collapsed info pill, and `pageSlug` points at the `pages` row holding that
 * section's editorial copy.
 */
export const NAV_ITEMS = [
  {
    href: "/podcasts",
    label: "Podcasts",
    icon: "a",
    infoLabel: "Podcast Info",
    pageSlug: "podcast-page",
  },
  {
    href: "/study-groups",
    label: "Study group",
    icon: "b",
    infoLabel: "Study group info",
    pageSlug: "study-group-page",
  },
  {
    href: "/happenings",
    label: "Happenings",
    icon: "a",
    infoLabel: "Happenings info",
    pageSlug: "happening-page",
  },
  {
    href: "/about",
    label: "About",
    icon: "a",
    infoLabel: "About info",
    pageSlug: "about-page",
  },
] as const satisfies readonly {
  href: string;
  label: string;
  icon: "a" | "b";
  infoLabel: string;
  pageSlug: string;
}[];

export function navItem(href: (typeof NAV_ITEMS)[number]["href"]) {
  const item = NAV_ITEMS.find((candidate) => candidate.href === href);
  if (!item) throw new Error(`Unknown nav href: ${href}`);
  return item;
}
