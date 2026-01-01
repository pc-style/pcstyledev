import React, { useEffect, useMemo, useState } from 'react';
import { ProjectCard } from '../components/ui/ProjectCard';
import projectsData from '../data/projects/projects.json';
import stackConfig from '../data/projects/stack-canonical.json';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Synth } from '../utils/audio';
import { Github } from 'lucide-react';
import type { Project, ProjectStatus } from '../lib/types';

interface ContextType {
  soundEnabled: boolean;
  synth: Synth | null;
}

const PROJECTS: Project[] = projectsData.projects as Project[];
const STATUS_ORDER: ProjectStatus[] = ['active', 'experimental', 'maintenance', 'prototype', 'disabled'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'featured_first' },
  { value: 'updated_desc', label: 'recent_updates' },
  { value: 'updated_asc', label: 'oldest_updates' },
  { value: 'name_asc', label: 'name_asc' },
  { value: 'name_desc', label: 'name_desc' },
  { value: 'status', label: 'status' }
] as const;
type SortOption = typeof SORT_OPTIONS[number]['value'];
const STATUS_SET = new Set<ProjectStatus>(STATUS_ORDER);
type StackConfig = {
  canonical: string[];
  aliases: Record<string, string>;
  glossary: { label: string; desc: string }[];
};
const STACK_CONFIG = stackConfig as StackConfig;
const STACKS = STACK_CONFIG.canonical;

const parseList = (value: string | null) =>
  value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];

const parseSort = (value: string | null): SortOption => {
  if (!value) return 'featured';
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : 'featured';
};

export const Projects = () => {
  const { soundEnabled, synth } = useOutletContext<ContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [selectedStacks, setSelectedStacks] = useState<string[]>(() => parseList(searchParams.get('stack')));
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(() =>
    parseList(searchParams.get('status')).filter((status) => STATUS_SET.has(status as ProjectStatus)) as ProjectStatus[]
  );
  const [sortBy, setSortBy] = useState<SortOption>(() => parseSort(searchParams.get('sort')));
  const totalNodes = PROJECTS.length;
  const activeNodes = PROJECTS.filter((project) => project.status === 'active').length;
  const experimentalNodes = PROJECTS.filter((project) => project.status === 'experimental').length;

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (project: Project) => {
    if (!normalizedQuery) return true;
    const haystack = `${project.name} ${project.desc} ${project.stack.join(' ')}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  };
  const matchesStackFilter = (project: Project) =>
    selectedStacks.length === 0 || project.stack.some((stack) => selectedStacks.includes(stack));
  const matchesStatusFilter = (project: Project) =>
    selectedStatuses.length === 0 || selectedStatuses.includes(project.status);

  const filteredProjects = useMemo(() => {
    const matchesQuery = (project: Project) => {
      if (!normalizedQuery) return true;
      const haystack = `${project.name} ${project.desc} ${project.stack.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    };
    const matchesStackFilter = (project: Project) =>
      selectedStacks.length === 0 || project.stack.some((stack) => selectedStacks.includes(stack));
    const matchesStatusFilter = (project: Project) =>
      selectedStatuses.length === 0 || selectedStatuses.includes(project.status);
    
    return PROJECTS.filter(
      (project) => matchesQuery(project) && matchesStackFilter(project) && matchesStatusFilter(project)
    );
  }, [normalizedQuery, selectedStacks, selectedStatuses]);

  const stackCounts = useMemo(() => {
    const counts = new Map<string, number>();
    PROJECTS.forEach((project) => {
      if (!matchesQuery(project)) return;
      if (!matchesStatusFilter(project)) return;
      project.stack.forEach((stack) => {
        counts.set(stack, (counts.get(stack) ?? 0) + 1);
      });
    });
    return counts;
  }, [normalizedQuery, selectedStatuses]);

  const statusCounts = useMemo(() => {
    const counts = new Map<ProjectStatus, number>();
    PROJECTS.forEach((project) => {
      if (!matchesQuery(project)) return;
      if (!matchesStackFilter(project)) return;
      counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
    });
    return counts;
  }, [normalizedQuery, selectedStacks]);

  const totalStackCounts = useMemo(() => {
    const counts = new Map<string, number>();
    PROJECTS.forEach((project) => {
      project.stack.forEach((stack) => {
        counts.set(stack, (counts.get(stack) ?? 0) + 1);
      });
    });
    return counts;
  }, []);

  const topStackSet = useMemo(() => {
    const top = [...totalStackCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label]) => label);
    return new Set(top);
  }, [totalStackCounts]);

  const availableStacks = useMemo(
    () => STACKS.filter((stack) => (stackCounts.get(stack) ?? 0) > 0 || selectedStacks.includes(stack)),
    [selectedStacks, stackCounts]
  );

  const availableStatuses = useMemo(
    () =>
      STATUS_ORDER.filter(
        (status) => (statusCounts.get(status) ?? 0) > 0 || selectedStatuses.includes(status)
      ),
    [selectedStatuses, statusCounts]
  );

  const showStackFilter = availableStacks.length >= 2;
  const showStatusFilter = availableStatuses.length >= 2;

  const displayProjects = useMemo(() => {
    const projects = [...filteredProjects];
    const getUpdatedTime = (project: Project) => {
      const time = new Date(project.updatedAt).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    if (sortBy === 'featured') {
      projects.sort((a, b) => {
        const pinnedDiff = Number(!!b.pinned) - Number(!!a.pinned);
        if (pinnedDiff !== 0) return pinnedDiff;
        return getUpdatedTime(b) - getUpdatedTime(a);
      });
      return projects;
    }

    if (sortBy === 'updated_desc') {
      projects.sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));
    } else if (sortBy === 'updated_asc') {
      projects.sort((a, b) => getUpdatedTime(a) - getUpdatedTime(b));
    } else if (sortBy === 'name_asc') {
      projects.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      projects.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'status') {
      projects.sort((a, b) => {
        const orderA = STATUS_ORDER.indexOf(a.status);
        const orderB = STATUS_ORDER.indexOf(b.status);
        const safeA = orderA === -1 ? STATUS_ORDER.length : orderA;
        const safeB = orderB === -1 ? STATUS_ORDER.length : orderB;
        if (safeA !== safeB) return safeA - safeB;
        return a.name.localeCompare(b.name);
      });
    }

    return projects;
  }, [filteredProjects, sortBy]);

  const lastUpdatedDate = new Date(projectsData.lastUpdated);
  const lastUpdated = Number.isNaN(lastUpdatedDate.getTime())
    ? 'unknown'
    : lastUpdatedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  const toggleSelection = <T,>(value: T, selections: T[], setSelections: (next: T[]) => void) => {
    if (selections.includes(value)) {
      setSelections(selections.filter((item) => item !== value));
    } else {
      setSelections([...selections, value]);
    }
  };

  const clearFilters = () => {
    setSelectedStacks([]);
    setSelectedStatuses([]);
    setSearchInput('');
    setSearchQuery('');
  };

  const handleFiltersToggle = () => {
    setFiltersOpen((prev) => !prev);
  };

  useEffect(() => {
    const nextParams = new URLSearchParams();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) nextParams.set('q', trimmedQuery);
    if (selectedStacks.length > 0) nextParams.set('stack', [...selectedStacks].sort().join(','));
    if (selectedStatuses.length > 0) nextParams.set('status', [...selectedStatuses].sort().join(','));
    if (sortBy !== 'featured') nextParams.set('sort', sortBy);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, searchQuery, selectedStacks, selectedStatuses, sortBy, setSearchParams]);

  const activeFilters = [
    ...(searchQuery.trim()
      ? [
          {
            key: 'search',
            label: `search:${searchQuery.trim()}`,
            onRemove: () => {
              setSearchInput('');
              setSearchQuery('');
            }
          }
        ]
      : []),
    ...selectedStacks.map((stack) => ({
      key: `stack-${stack}`,
      label: stack,
      onRemove: () => toggleSelection(stack, selectedStacks, setSelectedStacks)
    })),
    ...selectedStatuses.map((status) => ({
      key: `status-${status}`,
      label: status,
      onRemove: () => toggleSelection(status, selectedStatuses, setSelectedStatuses)
    }))
  ];
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-20 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 sm:gap-8 md:gap-10 border-l-[6px] border-[#ff00ff] pl-4 sm:pl-6 md:pl-10 py-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
            artifact_nodes
          </h2>
          <p className="text-gray-500 max-w-xl text-xs lowercase font-mono opacity-80 leading-relaxed">
            exploring the junction of human interaction and autonomous code.
            decrypted from public repository archives.
          </p>
          <div className="pt-6">
            <a
              href="https://github.com/pc-style/pcstyledev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-all font-black uppercase text-[10px] tracking-[0.35em] cursor-none"
            >
              <Github size={16} /> show_source
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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

      <div className="space-y-4 sm:space-y-6 border border-white/10 bg-black/40 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] text-[#ff00ff] block uppercase font-black tracking-[0.4em]">filter_matrix</span>
            <p className="text-xs text-gray-500 font-mono lowercase">
              showing {displayProjects.length} / {PROJECTS.length} nodes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFiltersToggle}
              aria-expanded={filtersOpen}
              aria-controls="project-filter-panel"
              className="text-[10px] uppercase font-black tracking-[0.3em] px-4 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all"
            >
              {filtersOpen ? 'hide_filters' : 'show_filters'}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] uppercase font-black tracking-[0.3em] px-4 py-3 border border-white/10 text-gray-500 hover:text-white hover:border-white transition-all"
              >
                clear_filters
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] border border-[#ff00ff]/40 text-[#ff00ff] bg-[#ff00ff]/10 hover:bg-transparent transition-all"
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {filtersOpen && (
          <div id="project-filter-panel" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
              <div className="flex-1">
                <label
                  htmlFor="project-search"
                  className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3"
                >
                  search_nodes
                </label>
                <input
                  id="project-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="name, description, stack"
                  className="w-full bg-black/60 border border-white/10 text-[11px] uppercase tracking-[0.25em] px-4 py-3 text-gray-300 font-black focus:outline-none focus-visible:border-white/40"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  sort_by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-black/60 border border-white/10 text-[10px] uppercase tracking-[0.3em] px-4 py-3 text-gray-300 font-black focus:outline-none focus-visible:border-white/40"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="text-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showStackFilter && (
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  stack_filter
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableStacks.map((stack) => {
                    const active = selectedStacks.includes(stack);
                    const count = stackCounts.get(stack) ?? 0;
                    const disabled = count === 0 && !active;
                    const isTopStack = topStackSet.has(stack);
                    return (
                      <button
                        key={stack}
                        onClick={() => toggleSelection(stack, selectedStacks, setSelectedStacks)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-all ${
                          active
                            ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_18px_rgba(255,0,255,0.2)]'
                            : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                        } ${isTopStack ? 'shadow-[0_0_22px_rgba(255,0,255,0.35)]' : ''} ${
                          disabled ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        aria-pressed={active}
                        aria-disabled={disabled}
                        disabled={disabled}
                        type="button"
                      >
                        {stack} <span className="ml-2 text-[9px] text-gray-600">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showStatusFilter && (
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  status_filter
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableStatuses.map((status) => {
                    const active = selectedStatuses.includes(status);
                    const count = statusCounts.get(status) ?? 0;
                    const disabled = count === 0 && !active;
                    return (
                      <button
                        key={status}
                        onClick={() => toggleSelection(status, selectedStatuses, setSelectedStatuses)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-all ${
                          active
                            ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_18px_rgba(255,0,255,0.2)]'
                            : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        aria-pressed={active}
                        aria-disabled={disabled}
                        disabled={disabled}
                        type="button"
                      >
                        {status} <span className="ml-2 text-[9px] text-gray-600">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {displayProjects.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-black/40 p-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gray-600 font-black">no_nodes_match_filters</p>
          </div>
        ) : (
          displayProjects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} soundEnabled={soundEnabled} synth={synth} delay={idx * 50} />
          ))
        )}
      </div>
    </div>
  );
};
