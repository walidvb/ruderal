import { readFile } from "node:fs/promises";
import path from "node:path";

import { HomeSvgAnimation } from "./home-svg-animation";
import { PlantLabel, type PlantLabelProps } from "./plant-label";

/** Id the animation uses to find the artwork it drives. */
const ARTWORK_ID = "home-artwork";

const ROOT_SVG = /<svg\b([^>]*)>([\s\S]*)<\/svg>/;

/**
 * The artwork used to bake these in as vector text (Figma flattens type to
 * outlines on export). Left/top are the pill's position in the artwork,
 * read off the exported SVG before its label groups were stripped, as a
 * percentage of the 1280x832 viewBox.
 */
const PLANT_LABELS: PlantLabelProps[] = [
  {
    href: "/happenings",
    label: "Happenings",
    blurb: "Cultural participation and territorial cooperation",
    leftPct: 46.0068,
    topPct: 70.6241,
  },
  {
    href: "/podcasts",
    label: "Podcast",
    blurb: "Documenting artistic practices and circulating knowledge",
    leftPct: 36.169,
    topPct: 33.2309,
  },
  {
    href: "/about",
    label: "About",
    blurb: "Extending ecological logic into cultural realms",
    leftPct: 76.3308,
    topPct: 17.5614,
  },
  {
    href: "/study-groups",
    label: "Study group",
    blurb: "Research, learning and collective experimentation",
    leftPct: 12.8472,
    topPct: 70.8912,
  },
];

/**
 * The artwork is used as-is rather than hand-converted to JSX, so it can be
 * re-exported from Figma without touching this file. The animation finds what it
 * drives by querying the DOM, so it keeps working as the artwork changes.
 */
function parseRootSvg(raw: string) {
  const match = raw.match(ROOT_SVG);
  if (!match) {
    throw new Error("HomeSvg: no root <svg> element found in home-artwork.svg");
  }

  const [, attributes, markup] = match;
  const readAttribute = (name: string) =>
    attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];

  return {
    markup,
    width: readAttribute("width"),
    height: readAttribute("height"),
    viewBox: readAttribute("viewBox"),
  };
}

export async function HomeSvg({ className }: { className?: string }) {
  const raw = await readFile(
    path.join(process.cwd(), "public", "home-artwork.svg"),
    "utf8",
  );
  const { markup, width, height, viewBox } = parseRootSvg(raw);

  return (
    <div
      className={`relative aspect-[1280/832] h-auto max-h-full w-auto max-w-full ${className ?? ""}`}
    >
      <svg
        id={ARTWORK_ID}
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="block h-full w-full"
        // The artwork is a build-time asset from this repo, not user input.
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <div className="pointer-events-none absolute inset-0 [container-type:inline-size]">
        {PLANT_LABELS.map((plant) => (
          <PlantLabel key={plant.href} {...plant} />
        ))}
      </div>
      <HomeSvgAnimation artworkId={ARTWORK_ID} viewBox={viewBox ?? ""} />
    </div>
  );
}
