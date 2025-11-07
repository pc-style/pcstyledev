"use client";

import { ProjectsGrid } from "@/components/ProjectsGrid";
import { loadProjects } from "@/lib/projects";
import { motion } from "framer-motion";
import { Rocket, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProjectsSection() {
  const { translations } = useLanguage();
  const projects = loadProjects();

  return (
    <section id="projects" className="relative flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Rocket className="h-10 w-10 text-[var(--color-magenta)]" aria-hidden="true" />
          <h2 className="text-[clamp(2.4rem,5vw,3.6rem)] font-black uppercase text-[color:var(--color-ink)]">
            {translations.projects.title}
          </h2>
        </motion.div>
        <motion.div
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Terminal className="h-5 w-5 text-[var(--color-cyan)] mt-1" aria-hidden="true" />
          <p className="max-w-[60ch] text-sm uppercase tracking-[0.3em] text-[color:var(--color-ink)]/70 sm:text-base">
            {translations.projects.subtitle}
          </p>
        </motion.div>
      </header>

      <ProjectsGrid projects={projects} />
    </section>
  );
}

