"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { InfoBadge } from "./info-badge";

type InfoPanelProps = {
  /** Pill label, e.g. "Podcast Info". */
  label: string;
  /** Heading and body, from the section's `pages` row. */
  title: string;
  body: string | null;
};

const GROW = { type: "spring", duration: 0.45, bounce: 0.12 } as const;

export function InfoPanel({ label, title, body }: InfoPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      transition={GROW}
      // Anchored flush to the right edge, so only the left corners are rounded.
      className={`rounded-l-card bg-surface shadow-card backdrop-blur-card fixed top-[118px] right-0 z-20 overflow-hidden ${
        open ? "w-[566px] max-w-[calc(100vw-2rem)] px-5 pt-5 pb-3" : "px-5 py-3"
      }`}
    >
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <InfoBadge label={label} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={`Close ${label}`}
                className="mt-2 shrink-0 cursor-pointer"
              >
                <Image
                  src="/figma/close.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </button>
            </div>

            <hr className="border-rule border-t" />

            <div className="font-display text-xl leading-7 text-black">
              <p className="font-bold">{title}</p>
              {body?.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-7">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex cursor-pointer items-start"
          >
            <InfoBadge label={label} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

