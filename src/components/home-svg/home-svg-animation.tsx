"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useLayoutEffect } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Time a single mask line takes to retract, so its line draws all the way out. */
const MASK_DURATION = 0.9;
/** Gap between consecutive mask lines, and between consecutive plants. */
const STAGGER = 0.05;
/** Plant pop-in. */
const PLANT_SPRING = { type: "spring", duration: 0.7, bounce: 0.5 } as const;
/** Stands in for "everywhere" as the outer subpath of a knock-out clip path. */
const EVERYWHERE = "M-100000,-100000H100000V100000H-100000Z";

const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

type Point = { x: number; y: number };

function distance(from: Point, to: Point) {
  return Math.hypot(from.x - to.x, from.y - to.y);
}

/** The point every line grows out of, and how far the wavefront has to travel. */
function measure(viewBox: string) {
  const [x, y, width, height] = viewBox.split(/[\s,]+/).map(Number);
  return {
    origin: { x: x + width / 2, y: y + height / 2 },
    // Half the diagonal, since the origin is the centre.
    reach: Math.hypot(width, height) / 2,
  };
}

/* -------------------------------------------------------------------------- */
/* Mask reveal                                                                */
/* -------------------------------------------------------------------------- */

/** Drives one mask shape: 0 leaves it whole, 1 has it fully retracted. */
type Reveal = (progress: number) => void;

function isStroked(element: SVGElement) {
  const styles = getComputedStyle(element);
  return (
    styles.stroke !== "none" && Number.parseFloat(styles.strokeWidth || "0") > 0
  );
}

/**
 * Stroked shapes retract along the path itself, starting at whichever end sits
 * nearest the origin — so the line underneath draws outwards from the centre.
 */
function createStrokeReveal(path: SVGPathElement, origin: Point): Reveal {
  const length = path.getTotalLength();
  const startsNearOrigin =
    distance(path.getPointAtLength(0), origin) <=
    distance(path.getPointAtLength(length), origin);

  return (progress) => {
    const visible = length * (1 - progress);
    path.style.strokeDasharray = `${visible} ${length + 1}`;
    // Leave the surviving dash at the far end, wherever that happens to be.
    path.style.strokeDashoffset = startsNearOrigin
      ? `${-(length - visible)}`
      : "0";
  };
}

/**
 * Figma flattens some of the mask strokes into filled outlines, which a dash
 * can't touch. Those retract behind a circle centred on the origin that grows
 * until it has swallowed the shape — the same outward sweep, minus the ability
 * to follow a curve. The radius spans the whole artwork rather than each shape's
 * own extent, so a shape far from the origin waits for the wavefront to arrive
 * instead of uncovering its near edge straight away.
 */
function createClipReveal(
  path: SVGPathElement,
  defs: SVGDefsElement,
  clipId: string,
  origin: Point,
  reach: number,
): Reveal {
  const clipPath = document.createElementNS(SVG_NS, "clipPath");
  clipPath.setAttribute("id", clipId);
  clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

  const hole = document.createElementNS(SVG_NS, "path");
  // Even-odd turns the circle into a hole punched out of everywhere else.
  hole.setAttribute("clip-rule", "evenodd");

  clipPath.append(hole);
  defs.append(clipPath);
  path.setAttribute("clip-path", `url(#${clipId})`);

  return (progress) => {
    const r = reach * progress;
    const circle = `M${origin.x - r},${origin.y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`;
    hole.setAttribute("d", `${EVERYWHERE}${circle}`);
  };
}

function collectMaskReveals(
  svg: SVGSVGElement,
  origin: Point,
  reach: number,
): Reveal[] {
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>("#mask path"));
  if (!paths.length) return [];

  let defs = svg.querySelector<SVGDefsElement>("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.prepend(defs);
  }

  return paths.map((path, index) =>
    isStroked(path)
      ? createStrokeReveal(path, origin)
      : createClipReveal(
          path,
          defs,
          `home-mask-reveal-${index}`,
          origin,
          reach,
        ),
  );
}

/* -------------------------------------------------------------------------- */
/* Plants                                                                     */
/* -------------------------------------------------------------------------- */

const PLANT_UNIT_ATTRIBUTE = "data-home-plant-unit";

/**
 * Wraps every item in `#plants` in a plain `<g>`, so it can be scaled around its
 * own centre without disturbing the transforms Figma put on the artwork itself.
 */
function wrapPlantUnits(plants: Element) {
  const wrappers: SVGGElement[] = [];
  const children = Array.from(plants.children);

  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const unit = [child];

    // Figma emits a backdrop-blur <foreignObject> immediately before the frame
    // it sits behind — that pair is one item, and shares one beat.
    if (child.tagName.toLowerCase() === "foreignobject" && children[index + 1]) {
      unit.push(children[index + 1]);
      index++;
    }

    const wrapper = document.createElementNS(SVG_NS, "g");
    wrapper.setAttribute(PLANT_UNIT_ATTRIBUTE, "");
    unit[0].before(wrapper);
    wrapper.append(...unit);
    wrappers.push(wrapper);
  }

  return wrappers;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

type HomeSvgAnimationProps = {
  /** Id of the `<svg>` this drives; it is rendered on the server. */
  artworkId: string;
  viewBox: string;
};

/**
 * Renders nothing: it animates the artwork the server already put in the page —
 * lines drawing outwards from the centre, then the plants popping in.
 */
export function HomeSvgAnimation({ artworkId, viewBox }: HomeSvgAnimationProps) {
  // Runs before paint, so the plants are already scaled to 0 on the first frame.
  useIsomorphicLayoutEffect(() => {
    const svg = document.getElementById(
      artworkId,
    ) as SVGSVGElement | null;
    if (!svg) return;

    const { origin, reach } = measure(viewBox);
    const reveals = collectMaskReveals(svg, origin, reach);
    const plants = svg.querySelector("#plants");
    const plantWrappers = plants ? wrapPlantUnits(plants) : [];

    for (const wrapper of plantWrappers) {
      wrapper.style.transformBox = "fill-box";
      wrapper.style.transformOrigin = "center";
      wrapper.style.transform = "scale(0)";
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      for (const reveal of reveals) reveal(1);
      for (const wrapper of plantWrappers) wrapper.style.transform = "none";
      return;
    }

    const controls: AnimationPlaybackControls[] = [];

    reveals.forEach((reveal, index) => {
      reveal(0);
      controls.push(
        animate(0, 1, {
          duration: MASK_DURATION,
          ease: "easeInOut",
          delay: index * STAGGER,
          onUpdate: reveal,
          onComplete: () => reveal(1),
        }),
      );
    });

    // Plants only start once the last mask line has finished retracting.
    const plantsStart =
      reveals.length > 0 ? MASK_DURATION + (reveals.length - 1) * STAGGER : 0;

    plantWrappers.forEach((wrapper, index) => {
      controls.push(
        animate(
          wrapper,
          { scale: [0, 1] },
          { ...PLANT_SPRING, delay: plantsStart + index * STAGGER },
        ),
      );
    });

    return () => {
      for (const control of controls) control.stop();
    };
  }, [artworkId, viewBox]);

  return null;
}
