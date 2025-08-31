import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will ignore ESLint errors during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
