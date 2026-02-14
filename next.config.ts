import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "robohash.org" },
      { protocol: "https", hostname: "dummyjson.com" },
    ],
  },
};

export default nextConfig;
