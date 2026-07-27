import { ImageResponse } from "next/og";
import { site } from "@/lib/site-config";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(circle at 78% 18%, #0d3b34 0%, transparent 55%), radial-gradient(circle at 12% 88%, #0a2e3a 0%, transparent 55%), #0a0e12",
          color: "#edf2f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #34d399, #2dd4bf)",
              color: "#06231d",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            JV
          </div>
          <div style={{ fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#9fb0bf" }}>
            {site.crm} · Goiânia-GO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
            Dr. José Victor
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              background: "linear-gradient(100deg, #10b981, #2dd4bf)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Lisboa Cardoso Gomes
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#9fb0bf", maxWidth: 900 }}>
            Medicina Endocanabinoide · Clínica Médica · Medicina Esportiva
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#6b7c8c" }}>
          Presencial em Goiânia e telemedicina para todo o Brasil
        </div>
      </div>
    ),
    size
  );
}
