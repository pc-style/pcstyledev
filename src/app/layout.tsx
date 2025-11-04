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
  title: {
    default: "pcstyle.dev — Adam Krupa | AI Developer & Creative Coder",
    template: "%s | pcstyle.dev — Adam Krupa"
  },
  description:
    "pcstyle / Adam Krupa: 18-letni student Sztucznej Inteligencji na Politechnice Częstochowskiej. Neo-brutalistyczne eksperymenty łączące AI, design i kreatywny kod. Portfolio projektów: Clock Gallery, AimDrift, PoliCalc, PixelForge.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "pcstyle",
    "Adam Krupa",
    "pcstyle.dev",
    "pcstyle developer",
    "Adam Krupa developer",
    "Adam Krupa portfolio",
    "neo brutalism",
    "neo-brutalizm",
    "creative coding",
    "web development",
    "AI developer",
    "Sztuczna Inteligencja",
    "Politechnika Częstochowska",
    "PCz",
    "student informatyki",
    "Clock Gallery",
    "AimDrift",
    "PoliCalc",
    "PixelForge",
    "react developer",
    "nextjs developer",
    "typescript developer",
    "framer motion",
    "interactive design",
    "generative art",
    "polish developer"
  ],
  authors: [{ name: "Adam Krupa (pcstyle)", url: siteUrl }],
  creator: "Adam Krupa (pcstyle)",
  publisher: "Adam Krupa (pcstyle)",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'twój-google-verification-code', // dodaj po weryfikacji w Google Search Console
    // yandex: 'twój-yandex-verification-code',
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "pcstyle.dev — Adam Krupa Portfolio",
    title: "pcstyle.dev — Adam Krupa | AI Developer & Creative Coder",
    description:
      "Bold AI + design experiments by Adam Krupa (pcstyle). Clock gallery, AimDrift, PoliCalc, PixelForge i więcej. Neo-brutalistyczne projekty łączące technologię i sztukę.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "pcstyle.dev — Portfolio Adama Krupy (pcstyle)",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pcstyle",
    creator: "@pcstyle",
    title: "pcstyle.dev — Adam Krupa | AI Developer & Creative Coder",
    description:
      "pcstyle (Adam Krupa) blenduje AI, design i kod w neo-brutalistycznych projektach. Clock Gallery, AimDrift, PoliCalc, PixelForge.",
    images: [`${siteUrl}/opengraph-image`],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* humans.txt — bo ludzie też mogą czytać metadata */}
        <link rel="author" href="/humans.txt" />
        
        {/* structured data dla lepszego SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Adam Krupa",
              alternateName: "pcstyle",
              url: "https://pcstyle.dev",
              jobTitle: "AI Developer & Creative Coder",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Politechnika Częstochowska",
              },
              knowsAbout: [
                "Artificial Intelligence",
                "Web Development",
                "Creative Coding",
                "Neo Brutalism Design",
                "React",
                "Next.js",
                "TypeScript",
              ],
              sameAs: [
                "https://github.com/pcstyle", // zaktualizuj do swoich linków
                "https://twitter.com/pcstyle",
              ],
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://pcstyle.dev",
              },
            }),
          }}
        />
      </head>
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
