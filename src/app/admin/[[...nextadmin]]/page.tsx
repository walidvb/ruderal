import type {
  AdminComponentProps,
  PrismaClient,
} from "@premieroctet/next-admin";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { options } from "../options";
import VideoUrlInput from "../video-url-input";
import "../next-admin.css";

export default async function AdminPage({
  params,
  searchParams,
}: PageProps<"/admin/[[...nextadmin]]">) {
  // The proxy already bounces requests with no session, but that check is
  // optimistic and says nothing about the allowlist. This is the real gate.
  const { email, admin } = await getAuth();
  if (!admin) redirect("/admin/login");

  const { nextadmin } = await params;

  const props = await getNextAdminProps({
    params: nextadmin,
    searchParams: await searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma: prisma as unknown as PrismaClient,
    options,
  });

  // App Router ignores `edit.fields.*.input` from the options object — custom
  // inputs are passed here instead, keyed by field name across all models.
  // The cast is needed because next-admin types the keys as the fields *every*
  // model shares — and requires all of them — so a model-specific key like
  // `videoUrl` cannot be expressed without it.
  const customInputs = {
    videoUrl: <VideoUrlInput />,
  } as unknown as AdminComponentProps["customInputs"];

  return (
    <NextAdmin
      {...props}
      customInputs={customInputs}
      // Puts the current admin and a sign-out button in the sidebar. The
      // tuple is passed straight to `fetch`, then the page reloads and the
      // gate above sends the now-signed-out visitor to the login form.
      user={{
        data: { name: admin.name ?? email! },
        logout: ["/auth/signout", { method: "POST" }],
      }}
    />
  );
}
