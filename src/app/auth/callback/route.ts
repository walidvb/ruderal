import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Only ever come back inside the admin, never to an attacker-supplied URL. */
const safeNext = (next: string | null) =>
  next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

/**
 * Where the magic link lands. Handles both shapes an email template can
 * produce, so it works with the stock template and a customised one:
 *
 * - `?code=…`       the default `{{ .ConfirmationURL }}`, PKCE flow. Requires
 *                   the link to be opened in the browser that requested it,
 *                   because the code verifier lives in a cookie there.
 * - `?token_hash=…` a template using `{{ .TokenHash }}`. Works on any device.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type ?? "email",
        })
      : { error: { message: "Missing sign-in code." } };

  if (error) {
    const url = new URL("/admin/login", origin);
    // Expired, already used, or opened in a different browser than it was
    // requested from. All the user can do is ask for a fresh link.
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // The allowlist check happens on the destination — signing in is not the
  // same as being allowed in, and the row may have been removed since.
  return NextResponse.redirect(new URL(next, origin));
}
