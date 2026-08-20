"use client";

import { Dialog } from "radix-ui";

const stack = [
  ["Next.js", "App Router, React 19, Turbopack"],
  ["Supabase", "Postgres + Auth via @supabase/ssr"],
  ["Prisma", "Typed queries through the pg driver adapter"],
  ["Next Admin", "Generated CRUD admin at /admin"],
  ["Tailwind CSS", "v4, configured in CSS"],
  ["Radix UI", "Unstyled, accessible primitives"],
];

export function StackDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
        What&rsquo;s in the box?
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[var(--background)] p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold">Stack</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm opacity-70">
            Everything wired up in this project.
          </Dialog.Description>

          <dl className="mt-4 space-y-3">
            {stack.map(([name, detail]) => (
              <div key={name}>
                <dt className="text-sm font-medium">{name}</dt>
                <dd className="text-sm opacity-70">{detail}</dd>
              </div>
            ))}
          </dl>

          <Dialog.Close className="mt-6 w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
