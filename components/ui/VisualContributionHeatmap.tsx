import { useMemo, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Box, Zap } from 'lucide-react'
import { useGitHubContributions } from '../../hooks/useGitHub'

const LEVEL_COLORS = [
    '#0f172a', // base (slate-900)
    '#ff00ff22',
    '#ff00ff44',
    '#ff00ff99',
    '#ff00ff'
]

const LEVEL_SHADOWS = [
    'none',
    '0 0 10px #ff00ff22',
    '0 0 15px #ff00ff44',
    '0 0 20px #ff00ff99',
    '0 0 25px #ff00ff'
]

export function VisualContributionHeatmap() {
    const { contributions, loading, error } = useGitHubContributions()
    const [hovered, setHovered] = useState<{ date: string; count: number } | null>(null)

    // Mouse Parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 20, stiffness: 100 }
    const rotateX = useSpring(useTransform(mouseY, [0, 500], [60, 50]), springConfig)
    const rotateZ = useSpring(useTransform(mouseX, [0, 1000], [-40, -50]), springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize to screen size
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    const displayWeeks = useMemo(() => {
        if (!contributions?.weeks?.length) return []
        // Show last 14 weeks for a nice balance
        return contributions.weeks.slice(-14)
    }, [contributions])

    if (loading || error || !contributions) {
        return (
            <div className="p-4 bg-white/5 border border-white/10 h-full min-h-[220px] flex items-center justify-center">
                <div className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest animate-pulse flex items-center gap-2">
                    <Zap size={10} className="animate-bounce" /> INITIALIZING_NEURAL_MAP...
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-white/5 border border-white/10 h-full relative overflow-hidden flex flex-col group min-h-[220px]">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="flex items-center justify-between gap-10 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-[9px] text-gray-400 uppercase font-black tracking-widest group-hover:text-[#ff00ff] transition-colors">
                    <Box size={12} className="text-[#ff00ff]" /> DATA_VOXEL_GRID (3D)
                </div>
            </div>

            {/* Floating Tooltip */}
            {hovered && (
                <motion.div
                    className="fixed z-[100] pointer-events-none px-2 py-1 bg-black/90 border border-[#ff00ff] shadow-[0_0_15px_#ff00ff66] backdrop-blur-sm"
                    style={{
                        left: mouseX,
                        top: mouseY,
                        x: '-50%',
                        y: '-120%',
                    }}
                >
                    <div className="text-[10px] font-mono whitespace-nowrap leading-tight">
                        <div className="text-white mb-0.5">{hovered.date}:</div>
                        <div className="text-[#ff00ff] font-bold text-xs">{hovered.count}</div>
                    </div>
                </motion.div>
            )}

            <div className="flex-1 flex items-center justify-center p-4 relative">
                <motion.div
                    className="relative"
                    style={{
                        perspective: '1200px',
                        rotateX,
                        rotateZ,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <div className="grid grid-flow-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
                        {displayWeeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
                                {week.map((day, dayIndex) => {
                                    const height = Math.max(4, day.level * 18)
                                    return (
                                        <motion.div
                                            key={`${weekIndex}-${dayIndex}`}
                                            initial={{ height: 4, translateZ: 0 }}
                                            animate={{
                                                height: height,
                                                translateZ: 0,
                                                backgroundColor: LEVEL_COLORS[day.level],
                                                boxShadow: LEVEL_SHADOWS[day.level]
                                            }}
                                            onMouseEnter={() => setHovered({ date: day.date, count: day.count })}
                                            onMouseLeave={() => setHovered(null)}
                                            transition={{
                                                delay: (weekIndex * 7 + dayIndex) * 0.005,
                                                duration: 0.8,
                                                type: 'spring',
                                                stiffness: 50,
                                                damping: 15
                                            }}
                                            className="w-[10px] relative transition-filters group/voxel cursor-crosshair"
                                            style={{
                                                transformStyle: 'preserve-3d',
                                                transformOrigin: 'bottom'
                                            }}
                                        >
                                            {/* Top Face */}
                                            <div
                                                className="absolute top-0 left-0 w-full h-[10px]"
                                                style={{
                                                    backgroundColor: LEVEL_COLORS[day.level],
                                                    transform: `translateY(-5px) rotateX(90deg)`,
                                                    boxShadow: LEVEL_SHADOWS[day.level],
                                                    filter: 'brightness(1.8)'
                                                }}
                                            >
                                                {/* Subtle Glint */}
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/voxel:opacity-40 transition-opacity" />
                                            </div>

                                            {/* Side Faces with shading */}
                                            <div
                                                className="absolute top-0 left-0 h-full w-[10px]"
                                                style={{
                                                    backgroundColor: LEVEL_COLORS[day.level],
                                                    transform: `translateX(-5px) rotateY(90deg)`,
                                                    filter: 'brightness(0.6)'
                                                }}
                                            />
                                            <div
                                                className="absolute top-0 right-0 h-full w-[10px]"
                                                style={{
                                                    backgroundColor: LEVEL_COLORS[day.level],
                                                    transform: `translateX(5px) rotateY(90deg)`,
                                                    filter: 'brightness(0.8)'
                                                }}
                                            />
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="mt-4 flex justify-between items-center relative z-10">
                <div className="text-[7px] text-gray-700 font-mono uppercase tracking-widest">
                    ENGINE_STABLE // PERSPECTIVE_ACTV
                </div>
                <div className="flex gap-[2px]">
                    {LEVEL_COLORS.map((c, i) => (
                        <div key={i} className="w-[4px] h-[4px]" style={{ backgroundColor: c }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
