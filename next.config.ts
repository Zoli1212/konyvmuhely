import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Nyilvános Vercel Blob borítók.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Google-fiókos bejelentkezés profilképei.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // A pg driver és a Prisma adapter natív Node-ot akar, ne bundle-ölje a szerver build.
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  experimental: {
    serverActions: {
      // A nagy fájlok nem server actionön mennek át (lásd src/lib/storage.ts),
      // de a borítóknak a helyi fejlesztői módban kell egy kis ráhagyás.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
