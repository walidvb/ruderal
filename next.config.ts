import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Thumbnails resolve to the public `media` bucket on the Supabase project.
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(supabaseUrl).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  turbopack: {
    resolveAlias: {
      // next-admin 8.4.2 still has one import of Prisma 6's runtime entrypoint,
      // which Prisma 7 renamed to "runtime/client". Identical exports, new path.
      "@prisma/client/runtime/library": "@prisma/client/runtime/client",
    },
  },
};

export default nextConfig;
