import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    // or use remotePatterns for more control
  },
  eslint: {
    // This will ignore ESLint errors during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
