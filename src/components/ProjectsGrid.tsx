"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectInfo } from "@/types/project";

const containerVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: "spring" as const,
      stiffness: 120,
      damping: 16,
    },
  },
};

type ProjectsGridProps = {
  projects: ProjectInfo[];
};

const layoutPool = [
  "md:col-span-1 lg:col-span-1 lg:translate-y-8",
  "md:col-span-1 lg:col-span-1 lg:-translate-y-8",
  "md:col-span-1 lg:col-span-1 lg:translate-y-4",
  "md:col-span-1 lg:col-span-1 lg:-translate-y-4",
];

function pickLayout(index: number) {
  // lekki asymetryczny chaos, ale karty tej samej wielkości
  return layoutPool[index % layoutPool.length];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <motion.section
      className="relative mt-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3, once: true }}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          className={pickLayout(index)}
        />
      ))}

      <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 hidden h-[120%] w-24 -translate-y-1/2 rotate-2 border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] opacity-20 brutal-shadow lg:block" />
      <div className="pointer-events-none absolute -right-12 top-12 -z-10 hidden h-24 w-32 rotate-[8deg] border-4 border-[var(--color-ink)] bg-[var(--color-magenta)] opacity-20 brutal-shadow md:block" />
    </motion.section>
  );
}

