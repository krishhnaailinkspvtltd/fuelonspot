import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Doorstep Diesel Delivery`,
    short_name: site.name,
    description:
      "Reliable doorstep diesel delivery for industries, construction sites, generators, fleets and businesses across Gujarat.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b3357",
    icons: [
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
