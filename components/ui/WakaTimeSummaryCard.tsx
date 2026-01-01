import { Clock, Code2, TrendingUp, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWakaTimeSummary } from '../../hooks/useWakaTime'

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function WakaTimeSummaryCard() {
  const { summary, loading, error } = useWakaTimeSummary()

  if (loading) {
    return (
      <div className="p-6 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">
          <Clock size={12} className="animate-pulse" /> LOADING STATS...
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="p-6 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
          <Clock size={12} /> STATS UNAVAILABLE
        </div>
      </div>
    )
  }

  const topLanguages = summary.languages.slice(0, 3)

  return (
    <div className="p-6 bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest">
          CODING_STATS (7D)
        </span>
        <Link
          to="/stats"
          className="text-[9px] text-gray-500 hover:text-[#ff00ff] uppercase font-black tracking-widest flex items-center gap-1 transition-colors"
        >
          VIEW ALL <ExternalLink size={10} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">
            <Clock size={10} /> TOTAL
          </div>
          <span className="text-2xl font-mono text-white tracking-tighter">
            {formatTime(summary.totalSeconds)}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">
            <TrendingUp size={10} /> DAILY AVG
          </div>
          <span className="text-2xl font-mono text-white tracking-tighter">
            {formatTime(summary.dailyAverage)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
          <Code2 size={10} /> TOP LANGUAGES
        </div>
        {topLanguages.map(lang => (
          <div key={lang.name} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400 font-mono">{lang.name}</span>
              <span className="text-[#ff00ff] font-mono">{lang.percent}%</span>
            </div>
            <div className="h-1.5 bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]"
                style={{ width: `${lang.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {summary.bestDay && (
        <div className="pt-4 border-t border-white/10">
          <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
            BEST DAY: <span className="text-[#ff00ff]">{summary.bestDay.date}</span>
            <span className="text-gray-400 ml-2">({formatTime(summary.bestDay.seconds)})</span>
          </div>
        </div>
      )}
    </div>
  )
}
