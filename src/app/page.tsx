import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";

export default function Home() {
  return (
    <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-40 pt-16 sm:px-10 lg:px-16">
      <SmoothBackground />
      <ScrollIndicator />
      {/* intro ma robić pop i robi pop */}
      <Hero />
      <ProjectsSection />
    </main>
  );
}
