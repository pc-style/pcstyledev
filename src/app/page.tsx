"use client";

import Link from "next/link";
import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { loadProjects } from "@/lib/projects";
import { useLanguage } from "@/contexts/LanguageContext";

const repoDirectory = {
  typesim: "https://github.com/pc-style/typesim",
  "messenger-desktop": "https://github.com/pc-style/messenger-desktop",
} as const;

type LatestMetaItem = {
  label: string;
  value: string;
  href?: string;
};

function stripProtocol(url: string) {
  // szybkie sprzątanie — bez https:// wygląda schludniej
  return url.replace(/^https?:\/\//, "");
}

function pickLatestRole(projectId: string) {
  // zero rocket science, po prostu teksty dopasowane do projektu
  const roleMap = {
    "messenger-desktop": "Desktop development • React Native • Privacy-focused UX",
    typesim: "AI automation • Python CLI • detection bypass research",
    pixlab: "AI graphics • Image processing • Web-based creative tools",
    clock: "Generative art • Animation • Interactive timepieces",
    cosmos: "Procedural generation • Mathematical visualization • Real-time rendering",
    driftfield: "Game development • Precision training • Interactive visuals",
    dreamcats: "Multiplayer gaming • Real-time sync • State management",
    kalkulator: "Student utilities • Educational tools • Polish localisation",
    math: "Educational tech • Interactive visualization • Problem solving",
    os: "Experimental UI • System design • Browser innovation"
  };
  return roleMap[projectId as keyof typeof roleMap] || "Creative coding • Motion systems • UX glow-up";
}

function pickLatestStack(projectId: string) {
  // tak wiem, if else — późna noc, mózg mówi po polsku i english naraz
  const stackMap = {
    "messenger-desktop": "Electron · React · TypeScript · Native APIs · Modern desktop tooling",
    typesim: "Python · Typer · Rich TUI · asyncio pipelines · Next.js docs",
    pixlab: "Next.js · AI APIs · Canvas API · Image processing · WebGL shaders",
    clock: "React · Framer Motion · Canvas · SVG animations • Creative coding",
    cosmos: "WebGL · Three.js · Mathematical shaders · Procedural algorithms",
    driftfield: "React · Canvas · Game physics • Performance optimization",
    dreamcats: "React · WebSocket · State machines • Real-time sync",
    kalkulator: "Next.js • Polish localisation • Educational algorithms",
    math: "Canvas API • Math.js • Interactive algorithms • Visual computing",
    os: "React • System simulation • UI experimentation • Browser APIs"
  };
  return stackMap[projectId as keyof typeof stackMap] || "Next.js · Framer Motion · WebGL shader toys · Tailwind v4";
}

function findRepo(projectId: string) {
  // guard + mapa bo nie każda zabawka ma repo publicznie
  if (projectId in repoDirectory) {
    return repoDirectory[projectId as keyof typeof repoDirectory];
  }
  return null;
}

function navShellClasses() {
  // niby drobiazg, ale sticky top w mobile ratuje życie
  return "sticky top-4 z-50 mx-auto w-full max-w-6xl px-4 sm:top-6 sm:px-6 lg:fixed lg:left-1/2 lg:-translate-x-1/2 lg:px-10";
}

function navListClasses(isNarrow: boolean) {
  // no i lepiej niech się nie wysypie kiedy literki są szerokie
  const base =
    "flex w-full items-center gap-2 overflow-x-auto rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)]/95 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] backdrop-blur-sm sm:gap-3 sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.25em] lg:overflow-visible";
  return isNarrow ? `${base} snap-x snap-mandatory` : `${base} justify-end`;
}

function navLinkClasses() {
  return "whitespace-nowrap transition-colors hover:text-[var(--color-magenta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-magenta)]";
}

function sectionShell() {
  // helper bo sekcje mają tendencyjki do powtarzania klas // lenistwo? może
  return "relative flex flex-col gap-6 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 sm:gap-8 sm:p-8 lg:p-10 brutal-shadow";
}

export default function Home() {
  const { translations } = useLanguage();
  const projects = loadProjects();
  const [latestProject] = projects;
  const isMobile = useIsMobile(640);
  const spotlightProject =
    latestProject ??
    ({
      id: "portfolio",
      title: translations.latestDrop.label,
      description: "Nowy projekt jest w drodze — zaglądaj częściej po świeże rzeczy.",
      url: "https://pcstyle.dev",
    } as (typeof projects)[number]);

  const repoUrl = findRepo(spotlightProject.id);

  const latestMeta: LatestMetaItem[] = [
    {
      label: translations.latestDrop.role,
      value: pickLatestRole(spotlightProject.id),
    },
    {
      label: translations.latestDrop.stack,
      value: pickLatestStack(spotlightProject.id),
    },
    {
      label: translations.latestDrop.link,
      value: stripProtocol(spotlightProject.url),
      href: spotlightProject.url,
    },
  ];

  if (repoUrl) {
    latestMeta.push({
      label: translations.latestDrop.repo,
      value: stripProtocol(repoUrl),
      href: repoUrl,
    });
  }

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
        <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-4 pb-28 pt-20 sm:gap-20 sm:px-6 sm:pb-32 sm:pt-24 lg:gap-24 lg:px-16 lg:pb-40 lg:pt-28">
          <SmoothBackground />
          <nav role="navigation" aria-label="Main navigation" className={navShellClasses()}>
            <ul className={navListClasses(isMobile)}>
              <li className="snap-start">
                <a className={navLinkClasses()} href="#intro">
                  {translations.nav.intro}
                </a>
              </li>
              <li className="snap-start">
                <a className={navLinkClasses()} href="#latest">
                  {translations.nav.latestDrop}
                </a>
              </li>
              <li className="snap-start">
                <a className={navLinkClasses()} href="#projects">
                  {translations.nav.projects}
                </a>
              </li>
              <li className="snap-start">
                <a className={navLinkClasses()} href="#lab">
                  {translations.nav.labNotes}
                </a>
              </li>
              <li className="snap-start">
                <a className={navLinkClasses()} href="#faq">
                  {translations.nav.faq}
                </a>
              </li>
              <li className="snap-end">
                <LanguageToggle compact />
              </li>
            </ul>
          </nav>
          <ScrollIndicator />
          <Hero />
          <section id="latest" aria-labelledby="latest-heading" className={sectionShell()}>
            <header className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink)] shadow-[5px_5px_0_var(--color-ink)] sm:px-4 sm:text-xs sm:tracking-[0.28em]">
                {translations.latestDrop.label}
              </span>
              <h2 id="latest-heading" className="text-[clamp(2.2rem,5.2vw,3.4rem)] font-black uppercase leading-tight text-[color:var(--color-ink)]">
                {spotlightProject.title}
              </h2>
            </header>
            <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:gap-8">
              <p className="text-pretty text-sm leading-relaxed text-[color:var(--color-ink)]/90 sm:text-base">
                {spotlightProject.description} {translations.latestDrop.descriptionSuffix}
              </p>
              <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] sm:text-sm sm:tracking-[0.24em]">
                {latestMeta.map((item) => (
                  <div className="flex flex-col gap-2" key={`${spotlightProject.id}-${item.label}`}>
                    <span className="text-[0.7rem] opacity-60 sm:text-xs">{item.label}</span>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-2 text-[color:var(--color-magenta)] underline-offset-4 hover:underline"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[color:var(--color-ink)]">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

        <ProjectsSection />

        <section id="lab" aria-labelledby="lab-heading" className={sectionShell()}>
          <header className="flex flex-col gap-4">
            <h2 id="lab-heading" className="text-[clamp(1.9rem,4vw,3rem)] font-black uppercase text-[color:var(--color-ink)]">
              {translations.explorations.title}
            </h2>
            <p className="text-pretty text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink)]/70 sm:text-sm sm:tracking-[0.28em]">
              {translations.explorations.subtitle}
            </p>
          </header>
          <ul className="flex flex-col gap-5 sm:gap-6">
            {explorations.map((item) => (
              <li
                key={item.title}
                className="group flex flex-col gap-3 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 transition-all hover:scale-[1.02] hover:bg-[var(--color-magenta)]/10 hover:shadow-[8px_8px_0_var(--color-magenta)] sm:p-8"
              >
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-ink)]/70 group-hover:text-[color:var(--color-ink)] sm:text-xs sm:tracking-[0.3em]">
                  {item.status}
                </span>
                <h3 className="text-lg font-black uppercase text-[color:var(--color-ink)] sm:text-2xl">{item.title}</h3>
                <p className="text-pretty text-sm leading-relaxed text-[color:var(--color-ink)]/90 sm:text-base">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className={sectionShell()}>
          <header className="flex flex-col gap-3">
            <h2 id="faq-heading" className="text-[clamp(1.9rem,4.5vw,3.3rem)] font-black uppercase text-[color:var(--color-ink)]">
              {translations.faq.title}
            </h2>
            <p className="max-w-[60ch] text-sm text-[color:var(--color-ink)]/80 sm:text-base">
              {translations.faq.subtitle}
            </p>
          </header>
          <dl className="grid gap-5 md:grid-cols-2 md:gap-6">
            {faqEntries.map(({ question, answer }, index) => {
              const faqId = `faq-${index}`;
              return (
                <div
                  key={question}
                  id={faqId}
                  className="group flex flex-col gap-2 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 transition-colors hover:bg-[var(--color-magenta)]/10 sm:p-6"
                >
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-ink)]/70 sm:text-xs sm:tracking-[0.3em]">
                    <a
                      href={`#${faqId}`}
                      className="rounded transition-colors hover:text-[var(--color-magenta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-magenta)]"
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
