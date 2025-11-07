"use client";

import Link from "next/link";
import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { LanguageToggle } from "@/components/LanguageToggle";
import { loadProjects } from "@/lib/projects";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { translations } = useLanguage();
  const projects = loadProjects();
  const [latestProject] = projects;
  const spotlightProject =
    latestProject ??
    ({
      id: "portfolio",
      title: translations.latestDrop.label,
      description: "Nowy projekt jest w drodze — zaglądaj częściej po świeże rzeczy.",
      url: "https://pcstyle.dev",
    } as (typeof projects)[number]);

  const explorations = [
    {
      title: translations.explorations.items.realtimeAI.title,
      description: translations.explorations.items.realtimeAI.description,
      status: translations.explorations.items.realtimeAI.status,
    },
    {
      title: translations.explorations.items.neoBrutalist.title,
      description: translations.explorations.items.neoBrutalist.description,
      status: translations.explorations.items.neoBrutalist.status,
    },
    {
      title: translations.explorations.items.sshContact.title,
      description: translations.explorations.items.sshContact.description,
      status: translations.explorations.items.sshContact.status,
    },
  ];

  const faqEntries = [
    {
      question: translations.faq.items.who.question,
      answer: translations.faq.items.who.answer,
    },
    {
      question: translations.faq.items.projects.question,
      answer: translations.faq.items.projects.answer,
    },
    {
      question: translations.faq.items.stack.question,
      answer: translations.faq.items.stack.answer,
    },
    {
      question: translations.faq.items.contact.question,
      answer: translations.faq.items.contact.answer,
    },
  ];

  return (
    <>
      <h1 className="sr-only">
        Adam Krupa — Developer z Polski | pcstyle.dev Portfolio | AI Developer & Creative Coder
      </h1>
      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-40 pt-16 sm:px-10 lg:px-16">
        <SmoothBackground />
        <nav role="navigation" aria-label="Main navigation" className="fixed top-6 left-1/2 z-50 mb-4 flex w-full max-w-6xl -translate-x-1/2 justify-end px-6 sm:px-10 lg:px-16">
          <ul className="flex flex-wrap items-center gap-3 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)]/95 backdrop-blur-sm px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] shadow-[6px_6px_0_var(--color-ink)] sm:text-sm">
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#intro">
                {translations.nav.intro}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#latest">
                {translations.nav.latestDrop}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#projects">
                {translations.nav.projects}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#lab">
                {translations.nav.labNotes}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#faq">
                {translations.nav.faq}
              </a>
            </li>
            <li>
              <LanguageToggle />
            </li>
          </ul>
        </nav>
        <ScrollIndicator />
        <Hero />

        <section
          id="latest"
          aria-labelledby="latest-heading"
          className="relative flex flex-col gap-8 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow"
        >
          <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)]">
              {translations.latestDrop.label}
            </span>
            <h2 id="latest-heading" className="text-[clamp(2.4rem,5vw,3.4rem)] font-black uppercase leading-tight text-[color:var(--color-ink)]">
              {spotlightProject.title}
            </h2>
          </header>
          <div className="grid gap-8 md:grid-cols-[1.3fr,1fr]">
            <p className="text-pretty text-base leading-relaxed text-[color:var(--color-ink)]/90 sm:text-lg">
              {spotlightProject.description} {translations.latestDrop.descriptionSuffix}
            </p>
            <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 text-sm uppercase tracking-[0.25em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)]">
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">{translations.latestDrop.role}</span>
                <span className="font-semibold">Creative coding • Motion systems • UX glow-up</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">{translations.latestDrop.stack}</span>
                <span className="font-semibold">Next.js · Framer Motion · WebGL shader toys · Tailwind v4</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">{translations.latestDrop.link}</span>
                <Link
                  href={spotlightProject.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-[color:var(--color-magenta)] underline-offset-4 hover:underline"
                >
                  {spotlightProject.url.replace(/^https:\/\//, "")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ProjectsSection />

        <section
          id="lab"
          aria-labelledby="lab-heading"
          className="relative flex flex-col gap-10 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow"
        >
          <header className="flex flex-col gap-4">
            <h2 id="lab-heading" className="text-[clamp(2rem,4vw,3rem)] font-black uppercase text-[color:var(--color-ink)]">
              {translations.explorations.title}
            </h2>
            <p className="text-pretty text-sm uppercase tracking-[0.3em] text-[color:var(--color-ink)]/70 sm:text-base">
              {translations.explorations.subtitle}
            </p>
          </header>
          <ul className="flex flex-col gap-6">
            {explorations.map((item) => (
              <li
                key={item.title}
                className="group flex flex-col gap-4 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-8 transition-all hover:scale-[1.02] hover:bg-[var(--color-magenta)]/10 hover:shadow-[8px_8px_0_var(--color-magenta)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)]/70 group-hover:text-[color:var(--color-ink)]">
                  {item.status}
                </span>
                <h3 className="text-xl font-black uppercase text-[color:var(--color-ink)] sm:text-2xl">{item.title}</h3>
                <p className="text-pretty text-base leading-relaxed text-[color:var(--color-ink)]/90">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="relative flex flex-col gap-8 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow"
        >
          <header className="flex flex-col gap-3">
            <h2 id="faq-heading" className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-black uppercase text-[color:var(--color-ink)]">
              {translations.faq.title}
            </h2>
            <p className="max-w-[60ch] text-sm text-[color:var(--color-ink)]/80 sm:text-base">
              {translations.faq.subtitle}
            </p>
          </header>
          <dl className="grid gap-6 md:grid-cols-2">
            {faqEntries.map(({ question, answer }, index) => {
              const faqId = `faq-${index}`;
              return (
                <div
                  key={question}
                  id={faqId}
                  className="group flex flex-col gap-2 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-colors hover:bg-[var(--color-magenta)]/10"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)]/70">
                    <a
                      href={`#${faqId}`}
                      className="hover:text-[var(--color-magenta)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-magenta)] rounded"
                      aria-label={`Link to ${question}`}
                    >
                      {question}
                    </a>
                  </dt>
                  <dd className="text-sm leading-relaxed text-[color:var(--color-ink)]/90">{answer}</dd>
                </div>
              );
            })}
          </dl>
        </section>
      </main>

      {/* structured data - FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqEntries.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          }),
        }}
      />

      {/* structured data dla projektów */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "pcstyle Projects by Adam Krupa — Developer z Polski",
            itemListElement: projects.map((project, index) => ({
              "@type": "CreativeWork",
              position: index + 1,
              name: project.title,
              url: project.url,
              description: project.description,
              author: {
                "@type": "Person",
                name: "Adam Krupa",
                alternateName: "pcstyle",
                nationality: { "@type": "Country", name: "Poland" },
              },
            })),
          }),
        }}
      />
    </>
  );
}
