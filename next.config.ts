import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Public Vercel Blob covers.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Profile pictures from Google sign-in.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // The pg driver and the Prisma adapter need real Node modules; keep them
  // out of the server bundle.
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  experimental: {
    serverActions: {
      // Book files never travel through a server action (see src/lib/storage.ts),
      // but the local-disk development driver posts covers to a route handler,
      // and a little headroom here keeps form submissions comfortable.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
