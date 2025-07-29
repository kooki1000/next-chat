import type { NextConfig } from "next";

import createMDX from "@next/mdx";
import "@/lib/env";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/terms-of-service",
          destination: "/terms-of-service",
        },
        {
          source: "/privacy-policy",
          destination: "/privacy-policy",
        },
        {
          source: "/security-policy",
          destination: "/security-policy",
        },
        {
          source: "/api/:path*",
          destination: "/api/:path*",
        },
      ],
      fallback: [
        {
          source: "/:path*",
          destination: "/",
        },
      ],
    };
  },
  pageExtensions: ["mdx", "tsx", "ts"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    reactCompiler: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
