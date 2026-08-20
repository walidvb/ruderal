"use server";

import { headers } from "next/headers";
import { normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

/**
 * Deliberately identical whether or not the address is on the allowlist, so
 * the form can't be used to enumerate who has admin access.
 */
const SENT =
  "If that address has admin access, a sign-in link is on its way. It expires in an hour.";

/** Only ever come back inside the admin, never to an attacker-supplied URL. */
const safeNext = (next: string | null) =>
  next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

export async function requestMagicLink(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const next = safeNext(
    formData.get("next") ? String(formData.get("next")) : null,
  );

  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  console.log({ email, admin  });

  // No row, no email. The allowlist is the gate; Supabase never hears about
  // addresses that aren't on it, so no stray auth users get created.
  if (!admin) return { status: "sent", message: SENT };

  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ?? `https://${requestHeaders.get("host")}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Safe to create: we only get here for an address already on the
      // allowlist, so first sign-in provisions the Supabase user for us.
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return {
      status: "error",
      // Surfaces the real cause of the two failures worth acting on: the
      // 60-second resend cooldown, and unconfigured email delivery.
      message: error.message,
    };
  }

  return { status: "sent", message: SENT };
}
