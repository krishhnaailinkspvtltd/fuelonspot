import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — doorstep diesel delivery across Gujarat`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "fuelonspot-logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#04182e",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#ffffff",
              borderRadius: 6,
              padding: "18px 24px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="" width={320} height={128} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 72,
              height: 6,
              backgroundColor: "#17a34a",
              marginBottom: 32,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Fuel Delivered. Right Where You Need It.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 28,
              color: "#a9bdd2",
              letterSpacing: "-0.01em",
            }}
          >
            Doorstep diesel delivery for industries, construction sites,
            generators and fleets across Gujarat.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#6f8aa6" }}>
            {site.addressShort}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: "#4fae3b",
            }}
          >
            {site.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
