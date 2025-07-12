import type { NextConfig } from "next";

import createMDX from "@next/mdx";

import "@/lib/env";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/terms-of-service",
          destination: "/terms-of-service",
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
  pageExtensions: ["md", "mdx", "tsx"],
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

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
