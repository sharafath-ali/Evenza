import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow any external hostname (user-submitted URLs)
      },
      // {
      //   protocol: "http",
      //   hostname: "**",
      // },
    ],
  },
};

export default nextConfig;
