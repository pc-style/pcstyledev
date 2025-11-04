"use client";

import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

// lightweight shapes dla dekoracji
const shapes = [
  {
    id: "stripe",
    className:
      "absolute left-1/2 top-12 h-[3px] w-[420px] -translate-x-1/2 bg-[var(--color-magenta)] flux-line opacity-60",
    animate: { x: [0, 12, -12, 0] },
  },
  {
    id: "disk",
    className:
      "absolute -right-20 top-[18%] h-40 w-40 rotate-[12deg] border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] brutal-shadow opacity-30",
    animate: { rotate: [8, 12, 6, 8] },
  },
  {
    id: "block",
    className:
      "absolute -left-16 bottom-[14%] h-48 w-32 -rotate-[6deg] border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] brutal-shadow opacity-30",
    animate: { y: [0, -18, 0, 14, 0] },
  },
];

// smooth floating orb z cursor follow — super lekki
function FloatingOrb({ index }: { index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const strength = 0.015 + index * 0.008;
  const orbX = useSpring(useMotionValue(0), { damping: 30, stiffness: 50 });
  const orbY = useSpring(useMotionValue(0), { damping: 30, stiffness: 50 });

  useEffect(() => {
    const unsubscribe = mouseX.on("change", (x) => {
      orbX.set(x * strength);
    });
    return unsubscribe;
  }, [mouseX, orbX, strength]);

  useEffect(() => {
    const unsubscribe = mouseY.on("change", (y) => {
      orbY.set(y * strength);
    });
    return unsubscribe;
  }, [mouseY, orbY, strength]);

  const colors = ["var(--color-magenta)", "var(--color-cyan)", "var(--color-yellow)"];
  const sizes = [140, 180, 120];

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full blur-3xl opacity-20"
      style={{
        x: orbX,
        y: orbY,
        width: sizes[index],
        height: sizes[index],
        backgroundColor: colors[index],
        left: `${20 + index * 30}%`,
        top: `${30 + index * 20}%`,
      }}
      animate={{
        scale: [1, 1.15, 0.95, 1],
      }}
      transition={{
        duration: 5 + index,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// CSS-only particle grid — zero JavaScript overhead
function CSSParticleGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <div className="grid-particles" />
      <style jsx>{`
        .grid-particles {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle, rgba(230, 0, 126, 0.4) 1px, transparent 1px),
            radial-gradient(circle, rgba(0, 229, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(255, 210, 0, 0.3) 1px, transparent 1px);
          background-size: 80px 80px, 120px 120px, 100px 100px;
          background-position: 0 0, 40px 40px, 20px 60px;
          animation: floatParticles 20s linear infinite;
        }
        
        @keyframes floatParticles {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}

// cursor glow effect — GPU accelerated, super smooth
function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* gradient glow that follows cursor */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(600px circle at 50% 50%, rgba(230, 0, 126, 0.15), transparent 40%)",
        }}
      />
      
      {/* moving orb that follows cursor smoothly */}
      <motion.div
        className="pointer-events-none fixed rounded-full blur-3xl"
        style={{
          x: smoothX,
          y: smoothY,
          width: 400,
          height: 400,
          marginLeft: -200,
          marginTop: -200,
          background: "radial-gradient(circle, rgba(230, 0, 126, 0.25), rgba(0, 229, 255, 0.15), transparent)",
        }}
      />
    </>
  );
}

// main component — super lightweight
export function SmoothBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* cursor glow — smooth as butter */}
      {!prefersReducedMotion && <CursorGlow />}

      {/* CSS-only particles — zero performance hit */}
      <CSSParticleGrid />

      {/* floating orbs z parallax */}
      {!prefersReducedMotion && [0, 1, 2].map((i) => <FloatingOrb key={i} index={i} />)}

      {/* animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          aria-hidden
          className={shape.className}
          animate={prefersReducedMotion ? undefined : shape.animate}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* subtle gradient overlays */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(230,0,126,0.08),_transparent_60%)]"
        animate={prefersReducedMotion ? undefined : { opacity: [0.5, 0.7, 0.4, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* animated grid lines dla cyberpunk vibe */}
      <div className="absolute inset-0 opacity-[0.03]">
        <motion.div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, var(--color-magenta) 1px, transparent 1px),
              linear-gradient(0deg, var(--color-cyan) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
          animate={prefersReducedMotion ? undefined : {
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

