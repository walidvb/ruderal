import type { PrismaClient } from "@premieroctet/next-admin";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { options } from "@/app/admin/options";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma: prisma as unknown as PrismaClient,
  options,
});

// Next types an optional catch-all's params as `{ nextadmin?: string[] }`,
// while next-admin declares them required. Default to [] to bridge the two.
const handler = async (
  request: Request,
  context: RouteContext<"/api/admin/[[...nextadmin]]">,
) => {
  // This handler reads and writes every model, so it needs the same gate as
  // the UI — the page redirect protects nothing if the API is left open.
  if (!(await getAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return run(request, {
    params: context.params.then(({ nextadmin }) => ({
      nextadmin: nextadmin ?? [],
    })),
  });
};

export { handler as DELETE, handler as GET, handler as POST };
