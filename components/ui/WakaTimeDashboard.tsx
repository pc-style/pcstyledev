import { Clock, Code2, Monitor, FolderGit2, TrendingUp, Calendar, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWakaTimeSummary } from '../../hooks/useWakaTime'
import { NeuralLanguageMap } from './NeuralLanguageMap'
import { ProjectMatrix } from './ProjectMatrix'

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
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full bg-[#ff00ff] shadow-[0_0:10px_#ff00ff]"
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color = "text-white" }: { icon: typeof Clock; label: string; value: string; color?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 bg-white/5 border border-white/10 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Zap size={8} className="text-[#ff00ff] animate-pulse" />
      </div>
      <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 transition-colors group-hover:text-gray-400">
        <Icon size={12} className="group-hover:text-[#ff00ff] transition-colors" /> {label}
      </div>
      <span className={`text-2xl md:text-3xl font-mono ${color} tracking-tighter transition-all group-hover:scale-105 inline-block origin-left`}>
        {value}
      </span>
    </motion.div>
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
        <p className="text-gray-600 text-sm mt-2 font-mono">
          {error || 'Could not load coding statistics'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-[#ff00ff] uppercase font-black tracking-widest">
          <Clock size={14} /> WAKATIME_METRICS
        </div>
        <span className="text-[8px] md:text-[9px] text-gray-500 uppercase font-mono tracking-widest">
          [{summary.range.start}] // [{summary.range.end}]
        </span>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="TOTAL TIME" value={formatTime(summary.totalSeconds)} color="text-white" />
        <StatCard icon={TrendingUp} label="DAILY AVG" value={formatTime(summary.dailyAverage)} color="text-[#ff00ff]" />
        <StatCard icon={Calendar} label="BEST DAY" value={summary.bestDay ? formatTime(summary.bestDay.seconds) : 'N/A'} color="text-white" />
        <StatCard icon={Code2} label="LANGUAGES" value={String(summary.languages.length)} color="text-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Column 1: Advanced Languages */}
        <div className="xl:col-span-1">
          <NeuralLanguageMap />
        </div>

        {/* Column 2: Advanced Projects */}
        <div className="xl:col-span-1">
          <ProjectMatrix />
        </div>

        {/* Column 3: Summary Details */}
        <div className="space-y-6 xl:col-span-1">
          {/* Editors Card */}
          <div className="p-6 bg-white/5 border border-white/10 space-y-4 h-full">
            <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">
              <Monitor size={12} /> SYSTEM_EDITORS
            </div>
            <div className="space-y-4">
              {summary.editors.slice(0, 3).map(editor => (
                <div key={editor.name}>
                  <ProgressBar
                    label={editor.name}
                    value={`${editor.percent}%`}
                    percent={editor.percent}
                  />
                </div>
              ))}
            </div>

            <div className="pt-8 opacity-50">
              <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">
                <Monitor size={12} /> TOP_PROJECT_CONTRIB
              </div>
              {summary.projects.slice(0, 1).map(project => (
                <div key={project.name} className="flex flex-col">
                  <span className="text-xl font-mono text-white tracking-widest uppercase">{project.name}</span>
                  <span className="text-[10px] font-mono text-[#ff00ff]">{formatTime(project.totalSeconds)} RECORDED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
