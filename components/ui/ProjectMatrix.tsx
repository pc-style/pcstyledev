import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FolderGit2, Cpu } from 'lucide-react'
import { useWakaTimeSummary } from '../../hooks/useWakaTime'

export function ProjectMatrix() {
    const { summary, loading, error } = useWakaTimeSummary()

    const projects = useMemo(() => {
        if (!summary?.projects) return []
        return summary.projects.slice(0, 8)
    }, [summary])

    if (loading || error || !summary) {
        return (
            <div className="p-4 bg-white/5 border border-white/10 h-[250px] flex items-center justify-center">
                <div className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest animate-pulse flex items-center gap-2">
                    <Cpu size={10} className="animate-spin" /> MAPPING_PROJECT_SPACE...
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white/5 border border-white/10 h-full relative overflow-hidden flex flex-col group min-h-[300px]">
            {/* Moving Scanline */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-[#ff00ff]/20 z-0 pointer-events-none"
            />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest group-hover:text-[#ff00ff] transition-colors">
                    <FolderGit2 size={12} className="text-[#ff00ff]" /> PROJECT_BIT_MATRIX
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-white/5 border border-white/5 hover:border-[#ff00ff]/50 transition-all group/item"
                    >
                        <div className="text-[10px] font-mono text-white/50 group-hover/item:text-[#ff00ff] transition-colors truncate mb-2 uppercase">
                            {project.name}
                        </div>

                        <div className="flex gap-[2px]">
                            {Array.from({ length: 12 }).map((_, bIdx) => (
                                <motion.div
                                    key={bIdx}
                                    animate={{
                                        backgroundColor: (bIdx / 12 * 100) < project.percent ? '#ff00ff' : '#ffffff05',
                                        opacity: (bIdx / 12 * 100) < project.percent ? [1, 0.5, 1] : 1
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: idx * 0.1 + bIdx * 0.05
                                    }}
                                    className="w-[4px] h-[8px]"
                                />
                            ))}
                        </div>

                        <div className="mt-2 text-[8px] font-mono text-gray-600 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            LOAD_VALUE: {project.percent}%
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto pt-6 flex justify-between items-center text-[7px] text-gray-700 font-mono uppercase tracking-widest">
                <span>PARALLEL_CORE_ALLOC</span>
                <span>S_0{projects.length}</span>
            </div>
        </div>
    )
}
