# Ruderal

Next.js 16 (App Router) + Supabase + Prisma 7 + [Next Admin](https://next-admin.js.org)
+ Tailwind CSS v4 + Radix UI.

## Setup

1. Install dependencies (runs `prisma generate` via `postinstall`):

   ```bash
   pnpm install
   ```

2. Fill in `.env`. `.env.example` documents every variable.

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | Supabase transaction-mode pooler (port 6543). Used by Prisma Client at runtime. |
   | `DIRECT_URL` | Supabase session-mode pooler (port 5432). Used by the Prisma CLI for migrations. |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key. |

   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is still the literal
   `[YOUR-PUBLISHABLE-KEY]` placeholder — copy the real key from the Supabase
   dashboard (*Project Settings → API Keys*). Nothing that talks to Supabase
   over HTTP works until it is set, **admin sign-in included**; Prisma is
   unaffected because it goes straight to Postgres.

3. Start the app:

   ```bash
   pnpm dev
   ```

   The Supabase database already contains the content schema, so the migration
   history was **baselined** rather than applied from scratch — see
   *Migrations* below before running anything against a fresh database.

Visit http://localhost:3000 and http://localhost:3000/admin — the admin
redirects to a sign-in form, see *Admin authentication* below.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm db:migrate` | Create and apply a migration |
| `pnpm db:seed` | Seed sample podcasts and study groups |
| `pnpm db:push` | Push the schema without a migration |
| `pnpm db:generate` | Regenerate Prisma Client + the Next Admin schema |
| `pnpm db:studio` | Open Prisma Studio |

## Layout

```
prisma/schema.prisma              Models, plus the client and next-admin generators
prisma/seed.ts                    Sample podcasts and study groups (leaves `pages` alone)
prisma.config.ts                  Prisma CLI config (points migrations at DIRECT_URL)
src/lib/prisma.ts                 Prisma Client singleton, using the pg driver adapter
src/lib/supabase/client.ts        Supabase browser client
src/lib/supabase/server.ts        Supabase server client (Server Components, Route Handlers)
src/lib/supabase/middleware.ts    Auth token refresh + optimistic /admin redirect
src/lib/auth.ts                   getAuth() — verified identity + `admins` allowlist lookup
src/proxy.ts                      Next 16 proxy (formerly middleware) that refreshes the session
src/app/admin/options.ts          Next Admin model configuration
src/app/admin/next-admin.css      Tailwind entrypoint for the admin's theme
src/app/admin/[[...nextadmin]]/   Admin UI
src/app/admin/login/              Magic-link sign-in form
src/app/api/admin/[[...nextadmin]]/  Admin API
src/app/auth/callback/route.ts    Where the magic link lands; creates the session
src/app/auth/signout/route.ts     POST-only sign out
```

## Data model

Four unrelated tables in `public`, all lowercase snake_case:

- `podcasts` — uuid pk, unique nullable `slug`, `tags text[]`, `video_url`,
  `thumbnail_url`, and an editorial `date` distinct from `published_at`.
- `study_groups` — same shape, with `image_url` and no tags or video.
- `pages` — singleton copy keyed by a text `slug` pk
  (`podcast-page`, `study-group-page`, `happening-page`, `about-page`).
- `admins` — the sign-in allowlist. See *Admin authentication* below.

### Publishing is enforced by RLS, not by app code

Every table has `created_at`, `updated_at` and `published_at`. `published_at`
null means draft, a past date means live, a future date means scheduled. Each
table has one `SELECT` policy for `anon` + `authenticated`:

```sql
published_at is not null and published_at <= now()
```

So the publishable key only ever sees live rows — **never add a published
filter in application code**. RLS is deliberately not `FORCE`d: Prisma connects
as the table owner and bypasses it, which is what lets the admin edit drafts.

### Media

`thumbnail_url` / `image_url` hold either an absolute URL (`http…`, `//…`,
`data:`) or a path inside the public `media` storage bucket (e.g.
`podcasts/ep-1.jpg`). Resolve the latter with
`supabase.storage.from('media').getPublicUrl(path)` and pass absolute values
through untouched.

## Admin authentication

`/admin` is behind Supabase Auth with a passwordless magic link, and the
`admins` table is the allowlist. There are no passwords and no roles: an email
address in `admins` can sign in, everything else cannot.

**To grant someone access**, add their address under *Admins* in the admin UI
(or `insert into admins (email) values ('…')`). Nothing else is needed — their
Supabase Auth user is created the first time they sign in. **To revoke access**,
delete the row; they are locked out on their next request, without touching
Supabase Auth.

### The flow

1. `/admin/login` takes an email and calls a Server Action.
2. The action looks the address up in `admins` **before** talking to Supabase.
   Addresses that aren't on the list are never sent to Supabase, so no stray
   auth users get created. The response is identical either way, so the form
   can't be used to enumerate who has access.
3. `signInWithOtp` emails a magic link pointing at `/auth/callback`.
4. `/auth/callback` turns the link into a session and redirects into `/admin`.
5. Every `/admin` render and every `/api/admin` request calls `getAuth()`,
   which re-checks the allowlist.

### Where the check actually happens

`src/lib/auth.ts` is the only thing that decides access, and it asks two
separate questions: `supabase.auth.getClaims()` verifies the JWT **signature**
(never trust the session cookie on its own — `getSession()` does not
revalidate), and the `admins` row decides whether that verified identity is
allowed in.

It is called in two places, and both are required:

- `src/app/admin/[[...nextadmin]]/page.tsx` — redirects to `/admin/login`.
- `src/app/api/admin/[[...nextadmin]]/route.ts` — returns `401`. Next Admin's
  API reads and writes every model, so gating only the UI would protect
  nothing.

The redirect in `src/lib/supabase/middleware.ts` is an **optimistic check
only** — it keeps signed-out visitors off the admin shell and knows nothing
about the allowlist. Per the Next.js docs, proxy is not an authorization layer.
Don't move the real check there.

### Supabase dashboard setup

- **Redirect URLs.** `/auth/callback` must be an allowed redirect for every
  origin you sign in from — add `http://localhost:3000/**` for local
  development under *Authentication → URL Configuration*.
- **Email delivery.** The stock Supabase SMTP is rate-limited to a handful of
  messages an hour; configure a real SMTP provider before relying on this.
- **Email template.** The default magic-link template works as-is:
  `{{ .ConfirmationURL }}` sends a PKCE `?code=`, which means the link must be
  opened in the browser that requested it. `/auth/callback` also accepts a
  `?token_hash=` link, so switching the template to `{{ .TokenHash }}` makes
  links work on any device without further code changes.

### The `admins` table

RLS is enabled with **no policies at all**, so the allowlist is unreadable
through the publishable key — otherwise anyone could enumerate who can log in.
Prisma connects as the table owner and bypasses RLS, which is how the admin UI
still reads and writes it.

A CHECK constraint enforces lowercase addresses, because sign-in lowercases
before looking up and a mixed-case row would silently never match — better a
loud write error than a locked-out admin.

## Migrations

The Supabase database predates this project, so `20260820000000_init_content`
is a **baseline**: it reproduces the schema, RLS policies and `media` bucket
that already existed, and was marked as applied with `prisma migrate resolve`
rather than executed. `20260820000100_index_published_at` and
`20260820000200_admins` have actually run against Supabase.

Against an empty database all three migrations apply cleanly and reproduce the
full structure.

## Notes

- **Prisma Client output.** The client is generated to `src/generated/prisma`
  (gitignored), so run `pnpm db:generate` after changing the schema.
- **Next Admin generator.** It writes its JSON schema into the
  `@premieroctet/next-admin` package inside `node_modules`, which is why
  `prisma generate` runs on `postinstall`.
- **Prisma 7 alias.** `next.config.ts` aliases
  `@prisma/client/runtime/library` to `@prisma/client/runtime/client`. Next
  Admin 8.4.2 has one remaining import of Prisma 6's entrypoint, which Prisma 7
  renamed; the exports are identical. The alias can be removed once Next Admin
  ships a fix.
- **`tags` is `NOT NULL`.** Prisma emits array columns without `NOT NULL`, so
  the baseline migration is hand-edited to match the live table. Verified
  drift-free with `prisma migrate diff`.
- **CHECK constraints are invisible to Prisma.** `admins_email_lowercase` is
  hand-written in `20260820000200_admins`. Prisma does not model CHECK
  constraints, so it never appears in `schema.prisma` and does not register as
  drift — verified with `prisma migrate diff`.
- **Admin route params.** `src/app/api/admin/[[...nextadmin]]/route.ts` defaults
  `nextadmin` to `[]` because Next types an optional catch-all's params as
  optional while Next Admin declares them required.
