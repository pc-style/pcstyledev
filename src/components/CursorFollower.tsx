"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
};

const colors = ["#E6007E", "#00E5FF", "#FFD200", "#050505"];

// cool helper bo czemu nie
function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function CursorFollower() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // smooth cursor z spring physics — feels nice lol
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const particleIdRef = useRef(0);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // sprawdź czy kursor jest nad interaktywnym elementem
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a, button, [role='button']") !== null;
      
      setIsHovering(isInteractive);

      // tworz partykuly tylko jak szybko ruszasz myszką
      const now = Date.now();
      if (now - lastParticleTime.current > 50) {
        lastParticleTime.current = now;
        
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: randomFromArray(colors),
          life: 1,
        };
        
        setParticles(prev => [...prev.slice(-15), newParticle]); // max 15 particles
      }
    };

    // update particle life
    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({ ...p, life: p.life - 0.02 }))
          .filter(p => p.life > 0)
      );
      animationFrame = requestAnimationFrame(updateParticles);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrame = requestAnimationFrame(updateParticles);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* main cursor ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isHovering ? 1.5 : 1,
            rotate: isHovering ? 90 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* outer ring */}
          <div className="h-8 w-8 rounded-full border-2 border-white" />
          
          {/* inner dot */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            animate={{
              scale: isHovering ? 0 : 1,
            }}
          />
        </motion.div>
      </motion.div>

      {/* particle trail — jak nie dziala to whatever, to tylko ozdoba */}
      <div className="pointer-events-none fixed inset-0 z-[9998]">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full mix-blend-screen"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: particle.life,
              scale: 0,
              y: -20,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </div>
    </>
  );
}

