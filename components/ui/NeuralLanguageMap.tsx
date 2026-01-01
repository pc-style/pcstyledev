import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Code2, Zap } from 'lucide-react'
import { useWakaTimeSummary } from '../../hooks/useWakaTime'

export function NeuralLanguageMap() {
    const { summary, loading, error } = useWakaTimeSummary()

    const languages = useMemo(() => {
        if (!summary?.languages) return []
        return summary.languages.slice(0, 10)
    }, [summary])

    if (loading || error || !summary) {
        return (
            <div className="p-4 bg-white/5 border border-white/10 h-[250px] flex items-center justify-center">
                <div className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest animate-pulse flex items-center gap-2">
                    <Zap size={10} className="animate-bounce" /> ANALYZING_LANG_FREQ...
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white/5 border border-white/10 h-full relative overflow-hidden flex flex-col group min-h-[300px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#ff00ff22_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest group-hover:text-[#ff00ff] transition-colors">
                    <Code2 size={12} className="text-[#ff00ff]" /> LANGUAGE_NEURAL_FLOW
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-around gap-4 relative z-10">
                {languages.map((lang, idx) => (
                    <div key={lang.name} className="relative">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-mono text-white/50 group-hover:text-white transition-colors uppercase">
                                {lang.name}
                            </span>
                            <span className="text-[9px] font-mono text-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity">
                                {lang.percent}%
                            </span>
                        </div>

                        <div className="h-[4px] w-full bg-white/5 relative overflow-hidden">
                            {/* Dynamic Signal */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lang.percent}%` }}
                                transition={{ duration: 1.5, delay: idx * 0.1, ease: "circOut" }}
                                className="h-full bg-[#ff00ff] relative"
                            >
                                {/* Pulse Glow */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        left: ['-20%', '120%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: idx * 0.2,
                                        ease: "linear"
                                    }}
                                    className="absolute top-0 w-[20%] h-full bg-white/50 blur-[2px]"
                                />
                            </motion.div>

                            {/* Digital Fragments */}
                            {lang.percent > 20 && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
                                    className="absolute top-0 h-full w-[1px] bg-[#ff00ff]"
                                    style={{ left: `${Math.random() * lang.percent}%` }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-[7px] text-gray-700 font-mono uppercase tracking-[0.2em]">
                <span>FREQ_SYNC_ENABLED</span>
                <span className="text-[#ff00ff]">SIGNAL_HI_RES</span>
            </div>
        </div>
    )
}
