"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Sending…" : "Email me a sign-in link"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(requestMagicLink, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2.5 text-base outline-none focus:border-foreground/60"
        />
      </label>

      <SubmitButton />

      {state.message ? (
        <p
          role="status"
          className={`text-sm ${state.status === "error" ? "text-red-600 dark:text-red-400" : "text-foreground/70"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
