import { Clock, Code2, Monitor, FolderGit2, TrendingUp, Calendar } from 'lucide-react'
import { useWakaTimeSummary } from '../../hooks/useWakaTime'

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function ProgressBar({ percent, label, value }: { percent: number; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-400 font-mono">{label}</span>
        <span className="text-[#ff00ff] font-mono">{value}</span>
      </div>
      <div className="h-2 bg-white/5 overflow-hidden">
        <div
          className="h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff] transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">
        <Icon size={12} /> {label}
      </div>
      <span className="text-3xl font-mono text-white tracking-tighter">
        {value}
      </span>
    </div>
  )
}

export function WakaTimeDashboard() {
  const { summary, loading, error } = useWakaTimeSummary()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest flex items-center gap-2">
          <Clock size={12} className="animate-pulse" /> LOADING WAKATIME DATA...
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="p-6 bg-white/5 border border-white/10">
        <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
          WAKATIME DATA UNAVAILABLE
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {error || 'Could not load coding statistics'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-[#ff00ff] uppercase font-black tracking-widest">
          WAKATIME_STATS
        </span>
        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
          {summary.range.start} — {summary.range.end}
        </span>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="TOTAL TIME" value={formatTime(summary.totalSeconds)} />
        <StatCard icon={TrendingUp} label="DAILY AVG" value={formatTime(summary.dailyAverage)} />
        <StatCard icon={Calendar} label="BEST DAY" value={summary.bestDay ? formatTime(summary.bestDay.seconds) : 'N/A'} />
        <StatCard icon={Code2} label="LANGUAGES" value={String(summary.languages.length)} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* languages */}
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
            <Code2 size={12} /> LANGUAGES
          </div>
          <div className="space-y-3">
            {summary.languages.slice(0, 8).map(lang => (
              <div key={lang.name}>
                <ProgressBar
                  label={lang.name}
                  value={`${lang.percent}%`}
                  percent={lang.percent}
                />
              </div>
            ))}
          </div>
        </div>

        {/* editors */}
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
            <Monitor size={12} /> EDITORS
          </div>
          <div className="space-y-3">
            {summary.editors.slice(0, 5).map(editor => (
              <div key={editor.name}>
                <ProgressBar
                  label={editor.name}
                  value={`${editor.percent}%`}
                  percent={editor.percent}
                />
              </div>
            ))}
          </div>
        </div>

        {/* projects */}
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
            <FolderGit2 size={12} /> PROJECTS
          </div>
          <div className="space-y-3">
            {summary.projects.slice(0, 5).map(project => (
              <div key={project.name}>
                <ProgressBar
                  label={project.name}
                  value={formatTime(project.totalSeconds)}
                  percent={project.percent}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
