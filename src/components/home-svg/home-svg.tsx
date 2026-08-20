import { readFile } from "node:fs/promises";
import path from "node:path";

import { HomeSvgAnimation } from "./home-svg-animation";

/** Id the animation uses to find the artwork it drives. */
const ARTWORK_ID = "home-artwork";

const ROOT_SVG = /<svg\b([^>]*)>([\s\S]*)<\/svg>/;

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
    <>
      <svg
        id={ARTWORK_ID}
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={className}
        // The artwork is a build-time asset from this repo, not user input.
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <HomeSvgAnimation artworkId={ARTWORK_ID} viewBox={viewBox ?? ""} />
    </>
  );
}
