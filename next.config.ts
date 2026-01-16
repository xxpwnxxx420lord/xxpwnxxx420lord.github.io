import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', <-- REMOVE THIS
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
