import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/home/:path*",
        destination: "http://localhost:3000/home/:path*",
      },
      {
        source: "/Product/:path*",
        destination: "http://localhost:3000/Product/:path*",
      },
      {
        source: "/custom pack/:path*",
        destination: "http://localhost:3000/custom%20pack/:path*",
      },
      {
        source: "/Industries/:path*",
        destination: "http://localhost:3000/Industries/:path*",
      },
      {
        source: "/contact/:path*",
        destination: "http://localhost:3000/contact/:path*",
      },
      {
        source: "/machinery/:path*",
        destination: "http://localhost:3000/machinery/:path*",
      },
      {
        source: "/Machinery/:path*",
        destination: "http://localhost:3000/Machinery/:path*",
      },
      {
        source: "/Gallery/:path*",
        destination: "http://localhost:3000/Gallery/:path*",
      },
      {
        source: "/gallery/:path*",
        destination: "http://localhost:3000/gallery/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://localhost:3000/images/:path*",
      },
    ];
  },
};

export default nextConfig;
