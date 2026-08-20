import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations and introspection must go through the session-mode pooler
    // (port 5432); the transaction-mode pooler in DATABASE_URL cannot run them.
    url: process.env["DIRECT_URL"],
  },
});
