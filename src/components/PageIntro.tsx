"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// glitch text effect — kradzione z 90s ale kto sprawdza lol
function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <span className="relative z-10 font-black uppercase tracking-wider">{text}</span>
      <span
        className="absolute left-0 top-0 z-0 font-black uppercase tracking-wider opacity-70"
        style={{
          color: "var(--color-cyan)",
          transform: "translate(-2px, -2px)",
          animation: "glitch1 0.3s infinite",
        }}
      >
        {text}
      </span>
      <span
        className="absolute left-0 top-0 z-0 font-black uppercase tracking-wider opacity-70"
        style={{
          color: "var(--color-magenta)",
          transform: "translate(2px, 2px)",
          animation: "glitch2 0.3s infinite",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function PageIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // sprawdz czy user już widział intro
    const hasSeenIntro = sessionStorage.getItem("pcstyle-intro-seen");
    
    if (hasSeenIntro) {
      setShowIntro(false);
      return;
    }

    // sequence timing — experimental numbers
    const timings = [800, 1200, 1800, 2400];
    
    const timeouts = timings.map((delay, index) =>
      setTimeout(() => setStep(index + 1), delay)
    );

    const finalTimeout = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("pcstyle-intro-seen", "true");
    }, 3200);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finalTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--color-ink)]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* scanlines vibe */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper) 2px, var(--color-paper) 4px)",
            }}
          />

          {/* center content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* step 1: logo reveal */}
            {step >= 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-[clamp(3rem,10vw,8rem)] text-[var(--color-paper)]"
              >
                <GlitchText text="pcstyle" />
              </motion.div>
            )}

            {/* step 2: loading bars */}
            {step >= 1 && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "300px", opacity: 1 }}
                className="flex flex-col gap-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1 border-2 border-[var(--color-paper)] bg-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: i * 0.15,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    style={{ originX: 0 }}
                  >
                    <motion.div
                      className="h-full bg-[var(--color-magenta)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: i * 0.15 + 0.1,
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      style={{ originX: 0 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* step 3: status text */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-sm uppercase tracking-widest text-[var(--color-cyan)]"
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  initializing_
                </motion.span>
              </motion.div>
            )}

            {/* step 4: geometric shapes explosion */}
            {step >= 3 && (
              <>
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12;
                  const radius = 200;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute border-2 border-[var(--color-paper)]"
                      style={{
                        width: 20 + (i % 3) * 10,
                        height: 20 + (i % 3) * 10,
                        backgroundColor:
                          i % 3 === 0
                            ? "var(--color-magenta)"
                            : i % 3 === 1
                            ? "var(--color-cyan)"
                            : "var(--color-yellow)",
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                      animate={{
                        x,
                        y,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>

          {/* pulsing border frame */}
          <motion.div
            className="pointer-events-none absolute inset-4 border-4 border-[var(--color-paper)]"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

