"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/lib/nav";
import { PlantIcon } from "./plant-icon";

const ITEM = "flex shrink-0 items-center justify-center gap-1 py-2";
const LABEL =
  "font-display text-base font-bold tracking-brand whitespace-nowrap text-black";

export function Menu() {
  const pathname = usePathname();

  return (
    <nav className="rounded-card bg-surface shadow-card backdrop-blur-card fixed bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-start gap-2 px-5 py-3">
      {NAV_ITEMS.map((item) => {
        const content = (
          <>
            <PlantIcon variant={item.icon} />
            <span className={LABEL}>{item.label}</span>
          </>
        );

        // The design renders the current section as plain text, not a link.
        return pathname === item.href ? (
          <span key={item.href} className={ITEM} aria-current="page">
            {content}
          </span>
        ) : (
          <Link key={item.href} href={item.href} className={ITEM}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
