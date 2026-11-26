import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/home/:path*",
        destination: "http://localhost:3000/home/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://localhost:3000/images/:path*",
      },
    ];
  },
};

export default nextConfig;
