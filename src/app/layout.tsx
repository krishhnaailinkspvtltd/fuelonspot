import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const title = "FuelOnSpot | Doorstep Diesel Delivery in Gujarat";
const description =
  "FuelOnSpot provides reliable doorstep diesel delivery for industries, construction sites, generators, fleets and businesses across Gujarat.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: site.name,
  keywords: [
    "doorstep diesel delivery",
    "mobile refueling",
    "diesel delivery Gujarat",
    "on-site fuel delivery",
    "generator diesel delivery",
    "construction site fuel",
    "fleet refueling Vadodara",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3357",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* Without JS the scroll observer never runs, so unhide everything. */}
        <noscript>
          <style>{`.fos-reveal,.fos-fade{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
