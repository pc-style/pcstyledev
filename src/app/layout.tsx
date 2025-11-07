import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { CursorFollower } from "@/components/CursorFollower";
import { PageIntro } from "@/components/PageIntro";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
    default: "Adam Krupa — Developer z Polski | pcstyle.dev | AI Developer & Creative Coder",
    template: "%s | Adam Krupa — pcstyle.dev"
  },
  description:
    "Adam Krupa (pcstyle) — Developer z Polski. 18-letni student Sztucznej Inteligencji na Politechnice Częstochowskiej. Neo-brutalistyczne eksperymenty łączące AI, design i kreatywny kod. Portfolio projektów: Clock Gallery, AimDrift, PoliCalc, PixelForge.",
  metadataBase: new URL(siteUrl),
  keywords: [
    // name variations - bo google lubi dokładność
    "pcstyle",
    "Adam Krupa",
    "Adam Krupa developer",
    "Adam Krupa Poland",
    "Adam Krupa poland",
    "Adam Krupa developer Poland",
    "Adam Krupa developer poland",
    "Adam Krupa portfolio",
    "Adam Krupa pcstyle",
    "Adam Krupa web developer",
    "Adam Krupa AI developer",
    "Adam Krupa Politechnika Częstochowska",
    "Adam Krupa Częstochowa",
    "pcstyle.dev",
    "pcstyle developer",
    "pcstyle Adam Krupa",
    
    // long-tail keywords - bo to działa
    "Adam Krupa portfolio developer",
    "Adam Krupa student AI",
    "Adam Krupa Sztuczna Inteligencja",
    "młody developer Polska",
    "programista AI Polska",
    "web developer Częstochowa",
    "AI developer Częstochowa",
    "student programowania Polska",
    
    // design & tech keywords
    "neo brutalism",
    "neo-brutalizm",
    "neo brutalism web design",
    "creative coding portfolio",
    "interactive portfolio",
    "web development",
    "AI developer",
    "AI developer Poland",
    "AI developer poland",
    "Sztuczna Inteligencja",
    "Politechnika Częstochowska",
    "PCz",
    "student informatyki",
    "polish developer",
    "polish web developer",
    "polish AI developer",
    "developer Poland",
    
    // tech stack - bo ludzie szukają konkretów
    "react developer",
    "react developer Poland",
    "nextjs developer",
    "next.js portfolio",
    "typescript developer",
    "typescript Poland",
    "framer motion developer",
    "framer motion",
    "interactive design",
    "generative art",
    "creative web development",
    
    // projects - każdy projekt to keyword
    "Clock Gallery",
    "Clock Gallery pcstyle",
    "AimDrift",
    "AimDrift game",
    "PoliCalc",
    "PoliCalc kalkulator",
    "PixelForge",
    "PixelForge AI",
    
    // location specific - bo SEO to też geografia
    "developer Częstochowa",
    "programista Częstochowa",
    "web developer Śląsk",
    "AI developer Śląsk",
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
      "Adam Krupa (pcstyle) — Developer z Polski. Bold AI + design experiments. Clock gallery, AimDrift, PoliCalc, PixelForge i więcej. Neo-brutalistyczne projekty łączące technologię i sztukę.",
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
      "Adam Krupa (pcstyle) — Developer z Polski. Blenduje AI, design i kod w neo-brutalistycznych projektach. Clock Gallery, AimDrift, PoliCalc, PixelForge.",
    images: [`${siteUrl}/opengraph-image`],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#ffffff",
    // geo tags dla lepszej lokalizacji
    "geo.region": "PL-SL",
    "geo.placename": "Częstochowa",
    "geo.position": "50.8118;19.1203",
    "ICBM": "50.8118, 19.1203",
    // classification tags
    "rating": "General",
    "distribution": "Global",
    "coverage": "Worldwide",
    "revisit-after": "7 days",
    "content-language": "pl, en",
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
        {/* performance optimization - dns prefetch dla szybszego ładowania */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* humans.txt — bo ludzie też mogą czytać metadata */}
        <link rel="author" href="/humans.txt" />
        
        {/* structured data - Person schema (główny) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Adam Krupa",
              alternateName: ["pcstyle", "Adam Krupa pcstyle"],
              givenName: "Adam",
              familyName: "Krupa",
              url: "https://pcstyle.dev",
              image: "https://pcstyle.dev/opengraph-image",
              jobTitle: "AI Developer & Creative Coder",
              description: "Adam Krupa (pcstyle) — Developer z Polski specjalizujący się w AI, web development i creative coding. Student Sztucznej Inteligencji na Politechnice Częstochowskiej.",
              nationality: {
                "@type": "Country",
                name: "Poland"
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "PL",
                addressRegion: "Śląskie",
                addressLocality: "Częstochowa"
              },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Politechnika Częstochowska",
                sameAs: "https://pcz.pl",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Częstochowa",
                  addressCountry: "PL"
                }
              },
              knowsAbout: [
                "Artificial Intelligence",
                "Machine Learning",
                "Web Development",
                "Creative Coding",
                "Neo Brutalism Design",
                "React",
                "Next.js",
                "TypeScript",
                "Framer Motion",
                "Interactive Design",
                "Generative Art",
              ],
              knowsLanguage: ["pl", "en"],
              sameAs: [
                "https://github.com/pcstyle",
                "https://twitter.com/pcstyle",
                "https://www.facebook.com/adam.krupa.771/",
              ],
              email: "adamkrupa@tuta.io",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://pcstyle.dev",
              },
            }),
          }}
        />
        
        {/* structured data - WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "pcstyle.dev — Adam Krupa Portfolio",
              alternateName: "Adam Krupa Developer Portfolio",
              url: "https://pcstyle.dev",
              description: "Portfolio Adama Krupy (pcstyle) — Developer z Polski. AI, web development, creative coding.",
              inLanguage: ["pl", "en"],
              author: {
                "@type": "Person",
                name: "Adam Krupa",
                alternateName: "pcstyle"
              },
              copyrightYear: 2025,
              copyrightHolder: {
                "@type": "Person",
                name: "Adam Krupa"
              }
            }),
          }}
        />
        
        {/* structured data - BreadcrumbList dla nawigacji */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://pcstyle.dev"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Projects",
                  item: "https://pcstyle.dev#projects"
                }
              ]
            }),
          }}
        />
        
        {/* structured data - ProfilePage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              dateCreated: "2024-01-01T00:00:00+00:00",
              dateModified: new Date().toISOString(),
              mainEntity: {
                "@type": "Person",
                name: "Adam Krupa",
                alternateName: "pcstyle",
                description: "Adam Krupa (pcstyle) — Developer z Polski, student AI na Politechnice Częstochowskiej"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${pcstyleSans.variable} ${pcstyleMono.variable} antialiased`}
      >
        <LanguageProvider>
          <PageIntro />
          <CursorFollower />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
