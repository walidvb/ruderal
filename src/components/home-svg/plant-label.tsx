import Link from "next/link";

/**
 * Card geometry as fractions of the artwork's viewBox width (cqw units), so it
 * stays in proportion as the artwork is scaled to fit any viewport — see
 * `home-svg.tsx` for the `container-type: inline-size` this relies on. Values
 * are the Figma pixel specs (at the 1280-wide viewBox) divided by 1280.
 */
const CARD =
  "px-[1.1574cqw] py-[0.6945cqw] rounded-[0.6945cqw] gap-[0.625cqw] " +
  "hover:w-[21.7188cqw] hover:px-[1.5625cqw] hover:py-[0.9375cqw] hover:rounded-[0.9375cqw] hover:gap-[0.625cqw]";

export type PlantLabelProps = {
  href: string;
  label: string;
  blurb: string;
  leftPct: number;
  topPct: number;
};

export function PlantLabel({ href, label, blurb, leftPct, topPct }: PlantLabelProps) {
  return (
    <Link
      href={href}
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      className={`group pointer-events-auto absolute inline-flex flex-col items-start whitespace-nowrap shadow-card backdrop-blur-[0.6945cqw] transition-[background-color,width,padding,border-radius] duration-200 ease-out no-underline hover:bg-surface hover:backdrop-blur-[0.9375cqw] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${CARD}`}
    >
      <span className="flex w-full items-start justify-between">
        <span className="font-display tracking-brand text-[1.5625cqw] font-bold text-black">
          {label}
        </span>
        <span
          aria-hidden
          className="hidden font-display text-[1.5625cqw] font-bold text-[#1e1e1e] group-hover:inline"
        >
          →
        </span>
      </span>
      <span className="hidden w-full border-t border-[color:var(--color-rule)] group-hover:block" />
      <span className="hidden w-full font-display text-[1.25cqw] leading-[1.75] font-semibold whitespace-normal text-black group-hover:block">
        {blurb}
      </span>
    </Link>
  );
}
