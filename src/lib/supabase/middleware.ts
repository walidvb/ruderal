import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const LOGIN_PATH = "/admin/login";

/** Routes that must stay reachable while signed out, or sign-in can't happen. */
const isPublicAuthPath = (pathname: string) =>
  pathname === LOGIN_PATH || pathname.startsWith("/auth/");

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Without these a CDN can cache a response carrying someone's
          // refreshed session cookie and serve it to the next visitor.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not remove: this refreshes the auth token and must run before any
  // other logic in the middleware. getClaims verifies the JWT signature —
  // getSession would hand back whatever the cookie claims.
  const { data } = await supabase.auth.getClaims();

  // Optimistic redirect only: it keeps signed-out visitors off the admin shell,
  // but says nothing about the allowlist. `getAdmin` in the page and the API
  // route is the check that actually decides access.
  const { pathname } = request.nextUrl;
  if (
    !data?.claims &&
    pathname.startsWith("/admin") &&
    !isPublicAuthPath(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
