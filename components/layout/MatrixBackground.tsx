import React, { useEffect, useRef } from 'react';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isLowPerformance = usePerformanceMode();

  useEffect(() => {
    if (isLowPerformance) return; // Don't track mouse on low perf

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLowPerformance]);

  useEffect(() => {
    if (isLowPerformance) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);

    // Cyberpunk palette chars
    const chars = "01PCSTYLE_X#<>?[]";

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '12px "JetBrains Mono"';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Interaction: Calculate distance to mouse
        const xPos = i * 20;
        const yPos = drops[i] * 20;
        const dist = Math.hypot(xPos - mouseRef.current.x, yPos - mouseRef.current.y);

        // Add some randomness to opacity for "glitchy" look
        if (dist < 150) {
          ctx.fillStyle = '#ffffff'; // White hot near cursor
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = '#ff00ff'; // Neon Magenta
          ctx.globalAlpha = Math.random() > 0.9 ? 1 : 0.2;
        }

        ctx.fillText(text, xPos, yPos);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLowPerformance]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      {!isLowPerformance && <canvas ref={canvasRef} className="w-full h-full" />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,1))]" />
    </div>
  );
};