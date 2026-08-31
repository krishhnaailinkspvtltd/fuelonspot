import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives under a OneDrive path with a lockfile above it; pin the root
  // so Turbopack does not walk up and warn.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
