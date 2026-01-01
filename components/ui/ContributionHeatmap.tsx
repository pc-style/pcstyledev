import { useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import { motion, useMotionValue } from 'framer-motion'
import { useGitHubContributions } from '../../hooks/useGitHub'

const LEVEL_COLORS = [
  'bg-gray-900',
  'bg-[#ff00ff]/20',
  'bg-[#ff00ff]/40',
  'bg-[#ff00ff]/70',
  'bg-[#ff00ff] shadow-[0_0_4px_#ff00ff]'
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function ContributionHeatmap() {
  const { contributions, loading, error } = useGitHubContributions()
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const displayWeeks = useMemo(() => {
    if (!contributions?.weeks?.length) return []
    return contributions.weeks.slice(-17) // Last 120 days (approx 17 weeks)
  }, [contributions])

  const monthLabels = useMemo(() => {
    if (!displayWeeks.length) return []

    const labels: { month: string; col: number }[] = []
    let lastMonth = -1

    displayWeeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const date = new Date(week[0].date)
        const month = date.getMonth()
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], col: weekIndex })
          lastMonth = month
        }
      }
    })

    return labels
  }, [displayWeeks])

  if (loading) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest animate-pulse">
            DOWNLOAD_ACTIVITY_DATA...
          </div>
        </div>
        <div className="flex gap-[2px] opacity-20 h-[82px] overflow-hidden">
          {Array.from({ length: 13 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="w-[10px] h-[10px] bg-gray-600 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !contributions) {
    return (
      <div className="p-6 bg-white/5 border border-white/10">
        <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
          CONTRIBUTION DATA UNAVAILABLE
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-4 bg-white/5 border border-white/10 h-full relative"
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
    >
      {/* Floating Tooltip */}
      {hoveredDay && (
        <motion.div
          className="fixed z-[100] pointer-events-none px-2 py-1 bg-black/95 border border-[#ff00ff] shadow-[0_0_15px_#ff00ff44] backdrop-blur-sm"
          style={{
            left: mouseX,
            top: mouseY,
            x: '-50%',
            y: '-120%',
          }}
        >
          <div className="text-[10px] font-mono whitespace-nowrap leading-tight">
            <div className="text-white mb-0.5">{hoveredDay.date}:</div>
            <div className="text-[#ff00ff] font-bold text-xs">{hoveredDay.count} CONTRIBUTS</div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between gap-10 mb-4">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
          <Calendar size={12} className="text-[#ff00ff]" /> ACTIVITY_MAP (120D)
        </div>
        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest opacity-40">
          {contributions.totalContributions} TOTAL
        </span>
      </div>

      <div className="relative group">
        <div className="flex gap-2">
          {/* Days of week labels */}
          <div className="flex flex-col gap-[2px] pt-[20px]">
            {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
              <span key={i} className="text-[7px] h-[10px] flex items-center text-gray-700 uppercase font-mono leading-none">
                {day}
              </span>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto scrollbar-custom pb-1">
              <div className="w-fit">
                {/* month labels */}
                <div className="h-4 relative mb-1 w-full">
                  {monthLabels.map(({ month, col }) => (
                    <span
                      key={`${month}-${col}`}
                      className="text-[8px] text-gray-600 uppercase font-mono absolute transition-colors group-hover:text-gray-400"
                      style={{
                        left: `${col * 12}px`, // 10px width + 2px gap
                      }}
                    >
                      {month}
                    </span>
                  ))}
                </div>

                {/* grid */}
                <div className="flex gap-[2px]">
                  {displayWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (weekIndex * 7 + dayIndex) * 0.002,
                            duration: 0.3
                          }}
                          role="img"
                          tabIndex={0}
                          aria-label={`${day.date}: ${day.count} contributions`}
                          className={`w-[10px] h-[10px] ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]} transition-all hover:scale-150 focus:scale-150 focus:outline-none hover:z-20 focus:z-20 hover:ring-1 focus:ring-1 hover:ring-white/50 focus:ring-[#ff00ff] relative outline-none`}
                          onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      ))}
                      {/* Fill in missing days if week is short */}
                      {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-[10px] h-[10px] bg-transparent" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="flex items-center gap-1 mt-3 ml-5">
          <span className="text-[7px] text-gray-700 uppercase font-mono">less</span>
          <div className="flex gap-[1px]">
            {LEVEL_COLORS.map((color, i) => (
              <div key={i} className={`w-[8px] h-[8px] ${color}`} />
            ))}
          </div>
          <span className="text-[7px] text-gray-700 uppercase font-mono">more</span>
        </div>
      </div>
    </div>
  )
}
