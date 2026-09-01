import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * The XML sitemap, served by Next at /sitemap.xml.
 *
 * One entry, because the site has exactly one crawlable route. Every section
 * heading on the page is an in-page anchor (#solutions, #contact, …) and an
 * anchor is not a separate document — listing them would submit URLs that all
 * resolve to the same page, which Google reports as duplicates.
 *
 * `site.url` must be an origin that actually resolves: it is what lands in
 * <loc> here, in the Sitemap: line of robots.ts, and in the canonical tag.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Trailing slash: the homepage is the origin root, and "…/" is the form
      // Google reports it under.
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
