import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import LoginForm from "./login-form";
import SignOutButton from "./sign-out-button";

export const metadata = { title: "Sign in — Ruderal Admin" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { next, error } = await searchParams;
  const target = typeof next === "string" ? next : "/admin";
  const { email, admin } = await getAuth();

  // Already signed in and on the allowlist: skip the form.
  if (admin) redirect(target);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">Ruderal Admin</h1>

        {email ? (
          // A valid session that the allowlist doesn't recognise. Sending
          // another link would just repeat this, so offer the way out instead.
          <>
            <p className="mt-1 mb-6 text-sm text-foreground/60">
              You&rsquo;re signed in as <strong>{email}</strong>, which
              isn&rsquo;t on the admin allowlist. Ask an existing admin to add
              it, or sign in with a different address.
            </p>
            <SignOutButton className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90" />
          </>
        ) : (
          <>
            <p className="mt-1 mb-6 text-sm text-foreground/60">
              Sign in with the address on the admin allowlist.
            </p>

            {typeof error === "string" ? (
              <p className="mb-4 rounded-md border border-red-600/30 bg-red-600/5 p-3 text-sm text-red-600 dark:text-red-400">
                {error} Request a new link below.
              </p>
            ) : null}

            <LoginForm next={target} />
          </>
        )}
      </div>
    </main>
  );
}
