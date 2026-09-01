import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives under a OneDrive path with a lockfile above it; pin the root
  // so Turbopack does not walk up and warn.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is the Next 16 default and covers every photograph on the page. 90 is
    // used by one asset only — the supplied campaign poster, which is dense
    // gold-on-navy display lettering and goes mushy at the default quality.
    qualities: [75, 90],
  },
};

export default nextConfig;
