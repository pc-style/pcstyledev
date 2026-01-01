import { useMemo } from 'react'
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

  const monthLabels = useMemo(() => {
    if (!contributions?.weeks?.length) return []

    const labels: { month: string; col: number }[] = []
    let lastMonth = -1

    contributions.weeks.forEach((week, weekIndex) => {
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
  }, [contributions])

  if (loading) {
    return (
      <div className="p-6 bg-white/5 border border-white/10">
        <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">
          LOADING CONTRIBUTION DATA...
        </div>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-[2px]">
          {Array.from({ length: 371 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-900 animate-pulse" />
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
    <div className="p-6 bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest">
          GITHUB_ACTIVITY_MAP
        </span>
        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
          {contributions.totalContributions} COMMITS (1Y)
        </span>
      </div>

      <div className="relative">
        {/* month labels */}
        <div className="flex mb-1 ml-4">
          {monthLabels.map(({ month, col }) => (
            <span
              key={`${month}-${col}`}
              className="text-[8px] text-gray-600 uppercase font-mono absolute"
              style={{ left: `${(col / 53) * 100}%` }}
            >
              {month}
            </span>
          ))}
        </div>

        {/* grid */}
        <div className="flex gap-[2px] mt-4 overflow-x-auto scrollbar-custom">
          {contributions.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-[10px] h-[10px] ${LEVEL_COLORS[day.level]} transition-all hover:scale-150 hover:z-10`}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-[8px] text-gray-600 uppercase font-mono">less</span>
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} className={`w-[10px] h-[10px] ${color}`} />
          ))}
          <span className="text-[8px] text-gray-600 uppercase font-mono">more</span>
        </div>
      </div>
    </div>
  )
}
