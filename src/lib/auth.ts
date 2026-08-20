import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/** Addresses are stored and looked up lowercase. */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Who is signed in, and whether they are allowed in — two separate facts.
 *
 * `getClaims` verifies the JWT signature rather than trusting the cookie, and
 * the `admins` row decides whether that verified identity has access. Deleting
 * the row locks the user out on their next request, without touching Supabase
 * Auth. `email` without `admin` means someone holds a valid session but is not
 * on the allowlist, which is worth telling them rather than looping them
 * through the login form.
 */
export async function getAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email ? normalizeEmail(data.claims.email) : null;

  return {
    email,
    admin: email
      ? await prisma.admin.findUnique({ where: { email } })
      : null,
  };
}

/** Shorthand for the common case: the `admins` row, or null. */
export async function getAdmin() {
  return (await getAuth()).admin;
}
