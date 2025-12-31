import React from 'react';
import { ProjectCard } from '../components/ui/ProjectCard';
import projectsData from '../data/projects/projects.json';
import { useOutletContext } from 'react-router-dom';
import { Synth } from '../utils/audio';
import type { Project } from '../lib/types';

interface ContextType {
  soundEnabled: boolean;
  synth: Synth | null;
}

const PROJECTS: Project[] = projectsData.projects as Project[];

export const Projects = () => {
  const { soundEnabled, synth } = useOutletContext<ContextType>();
  const totalNodes = PROJECTS.length;
  const activeNodes = PROJECTS.filter((project) => project.status === 'active').length;
  const experimentalNodes = PROJECTS.filter((project) => project.status === 'experimental').length;
  const pinnedProjects = PROJECTS.filter((project) => project.pinned);
  const unpinnedProjects = PROJECTS.filter((project) => !project.pinned);
  const displayProjects = [...pinnedProjects, ...unpinnedProjects];
  const lastUpdatedDate = new Date(projectsData.lastUpdated);
  const lastUpdated = Number.isNaN(lastUpdatedDate.getTime())
    ? 'unknown'
    : lastUpdatedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-20 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-l-[6px] border-[#ff00ff] pl-10 py-4">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
            artifact_nodes
          </h2>
          <p className="text-gray-500 max-w-xl text-xs lowercase font-mono opacity-80 leading-relaxed">
            exploring the junction of human interaction and autonomous code. 
            decrypted from public repository archives.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">total_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{totalNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">active_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{activeNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">exp_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{experimentalNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">last_updated</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((p, idx) => (
          <ProjectCard key={p.id} project={p} soundEnabled={soundEnabled} synth={synth} delay={idx * 50} />
        ))}
      </div>
    </div>
  );
};
