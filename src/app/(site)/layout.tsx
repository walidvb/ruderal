import type { ReactNode } from "react";

import { Menu } from "@/components/menu";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-center px-10 py-5">
        <p className="font-display text-wordmark font-semibold text-black">
          Ruderal
        </p>
      </header>
      {/* Bottom padding clears the floating menu. */}
      <main className="flex-1 pb-28">{children}</main>
      <Menu />
    </>
  );
}
