import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    // Warning: Disables build from failing on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
