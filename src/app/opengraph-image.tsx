import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          backgroundColor: "#fefefe",
          color: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          border: "12px solid #050505",
        }}
      >
        <div style={{ fontSize: 42, letterSpacing: "0.35em", textTransform: "uppercase" }}>
          pcstyle.dev
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}
          >
            neo brutal playground
          </div>
          <div style={{ fontSize: 32, maxWidth: 640, lineHeight: 1.3 }}>
            Adam Krupa // pcstyle — 18yo AI student @ Politechnika Częstochowska.
            Zegary, aim drift, kalkulatory, pixelowe AI hacki.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#e6007e",
              border: "6px solid #050505",
              boxShadow: "12px 12px 0 #050505",
            }}
          />
          pcstyle // ai + design + code
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

