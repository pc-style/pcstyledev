"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { ProjectInfo } from "@/types/project";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink } from "lucide-react";

const hoverTransition = { type: "spring" as const, stiffness: 220, damping: 14 };

function accentColor(project: ProjectInfo) {
  // jak nie podasz accentu, dostajesz magentę by default
  return project.accent ?? "#E6007E";
}

function drawCorner() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      aria-hidden
      className="absolute -right-[18px] -top-[18px]"
    >
      <path
        d="M0 0 H36 V36 H30 V6 H0 Z"
        fill="currentColor"
        stroke="black"
        strokeWidth="4"
      />
    </svg>
  );
}

export function ProjectCard({
  project,
  index,
  className,
}: {
  project: ProjectInfo;
  index: number;
  className?: string;
}) {
  const { translations } = useLanguage();
  const accent = accentColor(project);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disableFancyMotion = prefersReducedMotion || isMobile;

  // get tagline from translations
  const projectTagline = translations.projectsData[project.id as keyof typeof translations.projectsData]?.tagline || "";
  const projectDescription = translations.projectsData[project.id as keyof typeof translations.projectsData]?.description || project.description;

  // 3D tilt effect based on mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  // spotlight effect coordinates
  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disableFancyMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (disableFancyMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      className={`group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 sm:min-h-[380px] sm:p-7 lg:min-h-[420px] lg:p-8 brutal-shadow ${className ?? ""}`.trim()}
      style={{
        color: "var(--color-ink)",
        ...(disableFancyMotion ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" as const }),
      }}
      initial={disableFancyMotion ? false : { opacity: 0, y: 60, rotate: index % 2 ? -3 : 3 }}
      whileInView={disableFancyMotion ? undefined : { opacity: 1, y: 0, rotate: index % 2 ? -1.5 : 1.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={
        disableFancyMotion
          ? undefined
          : { delay: 0.08 * index, type: "spring", stiffness: 160, damping: 18 }
      }
      whileHover={
        disableFancyMotion
          ? undefined
          : {
              scale: 1.04,
              translateY: -6,
              boxShadow: `16px 16px 0 ${accent}`,
            }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* spotlight effect that follows mouse */}
      {!disableFancyMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle 300px at ${spotlightX.get()} ${spotlightY.get()}, ${accent}22, transparent)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div
              className="absolute inset-x-0 top-0 h-2"
              style={{ background: accent }}
            />
            <div
              className="absolute inset-y-0 left-0 w-2"
              style={{ background: accent }}
            />
          </div>
        </>
      )}

      <div className="relative flex flex-col gap-4">
        <span
          className="inline-block w-fit border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          {project.id}
        </span>

          <motion.h2
            className="text-pretty text-[clamp(1.9rem,4vw,3.3rem)] font-black uppercase leading-none"
            transition={hoverTransition}
          >
            {project.title}
          </motion.h2>

          {projectTagline && (
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink)]/70">
              {projectTagline}
            </p>
          )}

          <p className="max-w-[40ch] text-pretty text-sm leading-relaxed text-[color:var(--color-ink)]/90 sm:text-base">
            {projectDescription}
          </p>
        </div>

        <motion.div className="relative z-20 mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase">
          <span className="text-[color:var(--color-ink)]/70">{translations.projects.subdomain}</span>
          <span style={{ color: accent }}>{project.url.replace(/^https:\/\//, "")}</span>
        </div>
        <motion.a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
            className="group/btn relative z-30 flex w-fit items-center gap-3 rounded-full border-4 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-all bg-[var(--color-paper)] hover:bg-[var(--color-magenta)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)] sm:px-6 sm:text-sm"
          style={{ 
            borderColor: accent,
            backgroundColor: 'var(--color-paper)',
            color: 'var(--color-ink)'
          }}
          whileHover={disableFancyMotion ? undefined : { scale: 1.05, rotate: -1 }}
          whileTap={disableFancyMotion ? undefined : { scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open(project.url, '_blank', 'noopener,noreferrer');
          }}
          aria-label={`${translations.projects.visitProject} ${project.title}`}
        >
          <span className="whitespace-nowrap">{translations.projects.visitProject}</span>
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
        </motion.a>
      </motion.div>

      <Link
        href={project.url}
        className="absolute inset-0 z-0"
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open ${project.title}`}
        style={{ pointerEvents: 'none' }}
      />

      {!disableFancyMotion && (
        <>
          <div
            className="pointer-events-none absolute -right-6 bottom-6 -z-10 h-16 w-16 rotate-3 border-4 border-[var(--color-ink)] opacity-40"
            style={{ background: accent }}
          />

          <div
            className="pointer-events-none absolute -left-5 top-10 -z-10 h-20 w-2 opacity-50 flux-line"
            style={{
              backgroundImage: `linear-gradient(90deg, ${accent}, #000, ${accent})`,
            }}
          />
        </>
      )}

      {drawCorner()}
    </motion.article>
  );
}
