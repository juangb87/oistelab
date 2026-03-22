import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "t3.gstatic.com",
        pathname: "/faviconV2/**",
      },
    ],
  },
};

export default nextConfig;
