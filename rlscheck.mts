import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL! }),
});

const asAnon = async (sql: string) =>
  prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe("SET LOCAL ROLE anon");
    return tx.$queryRawUnsafe<Record<string, unknown>[]>(sql);
  });

for (const table of ["podcasts", "study_groups", "pages"]) {
  const owner = await prisma.$queryRawUnsafe<{ n: bigint }[]>(
    `SELECT count(*)::int AS n FROM ${table}`,
  );
  const anon = await asAnon(`SELECT count(*)::int AS n FROM ${table}`);
  console.log(`${table}: owner=${owner[0].n}  anon=${anon[0].n}`);
}

console.log("\nanon sees these podcasts:");
console.log(await asAnon("SELECT title FROM podcasts ORDER BY date DESC"));
await prisma.$disconnect();
