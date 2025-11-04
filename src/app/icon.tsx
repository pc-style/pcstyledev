import { ImageResponse } from "next/og";

// pcstyle logo jako favicon — generowany dynamically
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
        }}
      >
        {/* simplified pcstyle logo dla favicon */}
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* magenta P shape — stylized */}
          <path
            d="M140 100 L140 320 L100 350 L100 100 L140 100 Z M140 100 L260 100 C290 100 310 120 310 160 C310 200 290 220 260 220 L140 220 L140 100 Z M190 150 L190 280 M240 190 C240 210 240 240 220 260 C200 280 180 280 160 280"
            stroke="#E6007E"
            strokeWidth="24"
            fill="#E6007E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* drips/glitch elements */}
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

