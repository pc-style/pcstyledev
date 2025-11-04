import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: "20%",
        }}
      >
        {/* pcstyle P dla apple touch icon */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M140 100 L140 320 L100 350 L100 100 L140 100 Z M140 100 L260 100 C290 100 310 120 310 160 C310 200 290 220 260 220 L140 220 L140 100 Z M190 150 L190 280 M240 190 C240 210 240 240 220 260 C200 280 180 280 160 280"
            stroke="#E6007E"
            strokeWidth="24"
            fill="#E6007E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="160" cy="340" r="12" fill="#E6007E" />
          <circle cx="220" cy="340" r="12" fill="#E6007E" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

