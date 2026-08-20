import { PlantIcon } from "./plant-icon";

/** The plant-and-label badge that heads the info pill, panel and About page. */
export function InfoBadge({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center justify-center gap-1 py-2">
      <PlantIcon variant="a" />
      <span className="font-display tracking-brand text-sm font-bold whitespace-nowrap text-black">
        {label}
      </span>
    </span>
  );
}
