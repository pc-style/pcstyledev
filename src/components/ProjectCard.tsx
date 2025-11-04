"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ProjectInfo } from "@/types/project";

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
  const accent = accentColor(project);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect based on mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  // spotlight effect coordinates
  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      className={`group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-8 brutal-shadow ${className ?? ""}`.trim()}
      style={{
        color: "var(--color-ink)",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 60, rotate: index % 2 ? -3 : 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? -1.5 : 1.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: 0.08 * index, type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{
        scale: 1.04,
        translateY: -6,
        boxShadow: `16px 16px 0 ${accent}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* spotlight effect that follows mouse */}
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

      <div className="relative flex flex-col gap-4">
        <span
          className="inline-block w-fit border-4 border-[var(--color-ink)] bg-[var(--color-muted)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          {project.id}
        </span>

        <motion.h2
          className="text-pretty text-[clamp(2.2rem,4vw,3.4rem)] font-black uppercase leading-none"
          transition={hoverTransition}
        >
          {project.title}
        </motion.h2>

        <p className="max-w-[34ch] text-pretty text-sm leading-relaxed text-[color:var(--color-ink)]/80 sm:text-base">
          {project.description}
        </p>
      </div>

      <motion.div
        className="mt-10 flex items-center justify-between text-sm font-semibold uppercase"
      >
        <div className="flex items-center gap-3">
          <span className="text-[color:var(--color-ink)]/60">subdomain</span>
          <span style={{ color: accent }}>{project.url.replace(/^https:\/\//, "")}</span>
        </div>
        <motion.div
          className="relative flex items-center gap-2"
          whileHover={{ x: 6 }}
          transition={hoverTransition}
        >
          <span className="hidden text-xs uppercase tracking-[0.3em] sm:inline">wejdź</span>
          <div
            className="grid size-10 place-items-center border-4 border-[var(--color-ink)] bg-[var(--color-paper)]"
            style={{ color: accent }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 15L15 5" />
              <path d="M6 5H15V14" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      <Link
        href={project.url}
        className="absolute inset-0"
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open ${project.title}`}
      />

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

      {drawCorner()}
    </motion.article>
  );
}

