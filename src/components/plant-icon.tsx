import Image from "next/image";

/**
 * The plant badges are crops of a single full-bleed PNG: Figma scales the source
 * up and offsets it inside a small window. The percentages here are that crop
 * transform kept verbatim, so the visible leaf matches the design — rounding
 * them to spacing-scale values would reframe the crop.
 */
const SOURCE = { width: 736, height: 981 };

export function PlantIcon({ variant }: { variant: "a" | "b" }) {
  if (variant === "b") {
    return (
      <span className="flex h-6 w-[42px] shrink-0 items-center justify-center">
        <span className="block -rotate-90">
          <span className="relative block h-[42px] w-6 overflow-hidden">
            <Image
              src="/figma/plant-b.png"
              alt=""
              {...SOURCE}
              className="absolute top-[-4.86%] left-[-5%] h-[107.1%] w-[139.9%] max-w-none"
            />
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="relative block h-[25.26px] w-[39.469px] shrink-0 -scale-x-100 overflow-hidden">
      <Image
        src="/figma/plant-a.png"
        alt=""
        {...SOURCE}
        className="absolute top-[-190.32%] left-[-43.67%] h-[395.56%] w-[190.18%] max-w-none"
      />
    </span>
  );
}
