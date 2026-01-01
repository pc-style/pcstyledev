import React, { useState, useRef, useCallback, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { GlitchText } from './GlitchText';
import { Synth } from '../../utils/audio';
import type { Project } from '../../lib/types';

// get icon component from string name
function getIcon(name: string): React.ElementType {
  const icons = LucideIcons as Record<string, React.ElementType>;
  return icons[name] || icons['Box'];
}

interface Props {
  project: Project;
  soundEnabled: boolean;
  synth: Synth | null;
  delay: number;
}

export const ProjectCard = memo(({ project, soundEnabled, synth, delay }: Props) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDisabled = project.status === 'disabled';

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if(!cardRef.current || isDisabled) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, [isDisabled]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if(cardRef.current) cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`relative group border p-6 sm:p-8 lg:p-10 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden shadow-2xl ${
        isDisabled ? 'border-red-900/20 opacity-40 grayscale pointer-events-none' : 'border-white/5'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => {
        if (isDisabled) return;
        setHovered(true);
        if (soundEnabled) synth?.playBlip(Math.random() * 200 + 500, 'sine', 0.05, 0.02);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!isDisabled && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-[#ff00ff] to-transparent" />
      )}

      <div className="flex justify-between items-start mb-6 sm:mb-10">
        <div className={`p-3 sm:p-4 shadow-[0_0_20px_rgba(255,0,255,0.2)] ${isDisabled ? 'bg-red-900/20 text-red-500' : 'bg-[#ff00ff] text-black'}`}>
          {isDisabled ? <Lock className="w-5 h-5" /> : React.createElement(getIcon(project.icon), { className: "w-5 h-5" })}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border ${
            isDisabled ? 'border-red-500/20 text-red-500 bg-red-500/5' :
            project.status === 'active' ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-[#ff00ff]/30 text-[#ff00ff] bg-[#ff00ff]/5'
          }`}>
            {project.status}
          </span>
          {project.pinned && !isDisabled && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-[#ff00ff]/60 text-[#ff00ff] bg-[#ff00ff]/15 shadow-[0_0_12px_rgba(255,0,255,0.6)]">
              priority_node
            </span>
          )}
        </div>
      </div>

      <h3 className={`text-2xl sm:text-3xl font-black mb-4 uppercase tracking-tighter transition-colors ${isDisabled ? 'text-gray-700' : 'text-white group-hover:text-[#ff00ff]'}`}>
        <GlitchText text={project.name} />
      </h3>
      
      <p className="text-gray-500 text-[13px] mb-6 sm:mb-10 leading-relaxed lowercase font-mono opacity-70">
        {isDisabled ? '[MODULE_RESTRICTED] this node has been manually disabled by the architect.' : project.desc}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 sm:mb-10">
        {project.stack.map((s: string) => (
          <span key={s} className="text-[10px] text-gray-600 font-black border border-gray-900 px-3 py-1 uppercase group-hover:border-[#ff00ff]/20">
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-auto pt-6 sm:pt-8 border-t border-white/5">
        {!isDisabled && project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#ff00ff] text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:brightness-125 transition-all cursor-none">
            <ExternalLink size={14} /> access
          </a>
        )}
        {!isDisabled && project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-white transition-all cursor-none">
            <Github size={14} /> source
          </a>
        )}
        {isDisabled && (
          <span className="text-red-900/40 text-[10px] font-black uppercase tracking-[0.2em]">connection_terminated</span>
        )}
      </div>
    </div>
  );
});
