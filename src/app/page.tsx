import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";

// lepsze SEO przez semantic HTML i dodatkowy content
export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        pcstyle.dev — Adam Krupa | Portfolio AI Developer & Creative Coder
      </h1>
      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-40 pt-16 sm:px-10 lg:px-16">
        <SmoothBackground />
        <ScrollIndicator />
        {/* intro ma robić pop i robi pop */}
        <Hero />
        <ProjectsSection />
        
        {/* dodatkowy content dla SEO — niewidoczny ale indeksowany */}
        <section className="sr-only" aria-hidden="true">
          <h2>O mnie - pcstyle / Adam Krupa</h2>
          <p>
            Adam Krupa, znany jako pcstyle, to 18-letni student Sztucznej Inteligencji 
            na Politechnice Częstochowskiej. Specjalizuje się w web development, 
            AI development i creative coding. Tworzy neo-brutalistyczne projekty 
            łączące technologię, design i sztukę.
          </p>
          <h3>Projekty pcstyle</h3>
          <ul>
            <li>Clock Gallery - Kreatywna galeria animowanych zegarów z efektami doodle, mycelium, particle clouds i neon</li>
            <li>AimDrift - Interaktywny trener precyzji i celowania z multiple modes i evolving visual styles</li>
            <li>PoliCalc - Kalkulator ocen dla Politechniki Częstochowskiej (open source)</li>
            <li>PixelForge - AI-powered image studio z point-and-edit i style transfer</li>
          </ul>
          <h3>Technologie</h3>
          <p>
            React, Next.js, TypeScript, Framer Motion, Tailwind CSS, 
            Artificial Intelligence, Machine Learning, Creative Coding, 
            Web Development, Interactive Design, Generative Art
          </p>
        </section>
      </main>
      
      {/* structured data dla projektów */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "pcstyle Projects by Adam Krupa",
            itemListElement: [
              {
                "@type": "CreativeWork",
                position: 1,
                name: "Clock Gallery",
                url: "https://clock.pcstyle.dev",
                description: "Creative gallery of animated clocks by pcstyle (Adam Krupa)",
                author: { "@type": "Person", name: "Adam Krupa" },
              },
              {
                "@type": "CreativeWork",
                position: 2,
                name: "AimDrift",
                url: "https://driftfield.pcstyle.dev",
                description: "Interactive aim trainer by pcstyle (Adam Krupa)",
                author: { "@type": "Person", name: "Adam Krupa" },
              },
              {
                "@type": "SoftwareApplication",
                position: 3,
                name: "PoliCalc",
                url: "https://kalkulator.pcstyle.dev",
                description: "Grade calculator for Politechnika Częstochowska by pcstyle (Adam Krupa)",
                author: { "@type": "Person", name: "Adam Krupa" },
                applicationCategory: "UtilityApplication",
              },
              {
                "@type": "SoftwareApplication",
                position: 4,
                name: "PixelForge",
                url: "https://pixlab.pcstyle.dev",
                description: "AI-powered image studio by pcstyle (Adam Krupa)",
                author: { "@type": "Person", name: "Adam Krupa" },
                applicationCategory: "MultimediaApplication",
              },
            ],
          }),
        }}
      />
    </>
  );
}
