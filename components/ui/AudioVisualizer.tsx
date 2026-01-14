import React, { useEffect, useRef } from 'react';
import { Synth } from '../../utils/audio';

import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export const AudioVisualizer = ({ synth, isActive }: { synth: Synth | null, isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLowPerformance = usePerformanceMode();

  useEffect(() => {
    if (!synth || !canvasRef.current || !isActive || isLowPerformance) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = synth.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 4;
        // Gradient color based on height
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 255; // Keep it cyan/blue-ish or match magenta?

        // Let's stick to theme
        ctx.fillStyle = `rgba(255, 0, 255, ${dataArray[i] / 255})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [synth, isActive, isLowPerformance]);

  if (!isActive) return <div className="h-8 w-20 bg-gray-900/50 rounded border border-gray-800 flex items-center justify-center opacity-50"><div className="w-full h-[1px] bg-red-500/50"></div></div>;

  return <canvas ref={canvasRef} width={80} height={32} className="opacity-80 mix-blend-screen w-20 h-8" />;
};