import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { CursorFollower } from "@/components/CursorFollower";
import { PageIntro } from "@/components/PageIntro";
import "./globals.css";

const pcstyleSans = Space_Grotesk({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const pcstyleMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://pcstyle.dev";

export const metadata: Metadata = {
  title: "pcstyle.dev — Adam Krupa",
  description:
    "pcstyle / Adam Krupa: 18-letni student SI na PCz. Neo-brutalistyczne eksperymenty łączące AI, design i kreatywny kod.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "pcstyle",
    "Adam Krupa",
    "neo brutalism",
    "creative coding",
    "Sztuczna Inteligencja",
    "Politechnika Częstochowska",
  ],
  authors: [{ name: "Adam Krupa", url: siteUrl }],
  openGraph: {
    title: "pcstyle.dev — experimental hub by Adam Krupa",
    description:
      "Bold AI + design experiments. Clock gallery, AimDrift, PoliCalc, PixelForge i więcej.",
    url: siteUrl,
    siteName: "pcstyle.dev",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "pcstyle.dev neo-brutal playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "pcstyle.dev — experimental hub",
    description:
      "pcstyle blenduje AI, design i kod w neo-brutalistycznych projektach.",
    creator: "@pcstyle",
    images: [`${siteUrl}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pcstyleSans.variable} ${pcstyleMono.variable} antialiased`}
      >
        <PageIntro />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
