"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import { InfoBadge } from "./info-badge";

type InfoPanelProps = {
  /** Pill label, e.g. "Podcast Info". */
  label: string;
  /** Heading and body, from the section's `pages` row. */
  title: string;
  body: string | null;
};

const GROW = { type: "spring", stiffness: 260, damping: 26, mass: 1 } as const;
const CONTENT_IN = { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as const;
const CONTENT_OUT = { duration: 0.15, ease: "easeIn" } as const;
// Let the content start revealing a bit before the box spring has fully
// settled, rather than waiting for it to come to a dead stop.
const CONTENT_REVEAL_DELAY_MS = 300;

export function InfoPanel({ label, title, body }: InfoPanelProps) {
  const [open, setOpen] = useState(false);
  // Only true once the box is most of the way through growing, so the
  // content reveal overlaps the tail of the resize instead of the start.
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setShowContent(true), CONTENT_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

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
        {showContent ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={CONTENT_IN}
            className="flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <InfoBadge label={label} />
              <button
                type="button"
                onClick={() => {
                  setShowContent(false);
                  setOpen(false);
                }}
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
            transition={CONTENT_OUT}
            className="flex cursor-pointer items-start"
          >
            <InfoBadge label={label} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

