import { BarChart3, Github, Star, Users, GitFork, Activity, Terminal as TerminalIcon } from 'lucide-react'
import { WakaTimeDashboard } from '../components/ui/WakaTimeDashboard'
import { ContributionHeatmap } from '../components/ui/ContributionHeatmap'
import { VisualContributionHeatmap } from '../components/ui/VisualContributionHeatmap'
import { useGitHubStats } from '../hooks/useGitHub'

import { motion } from 'framer-motion'

function GitHubMainStats() {
  const { stats, loading, error } = useGitHubStats()

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-4 h-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-4 md:p-6 bg-white/5 border border-white/10 h-24 md:h-[120px] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !stats) return null

  const mainStats = [
    { label: 'REPOS', value: stats.publicRepos, icon: GitFork, color: 'text-blue-500' },
    { label: 'STARS', value: stats.totalStars, icon: Star, color: 'text-yellow-500' },
    { label: 'FOLLOWS', value: stats.followers, icon: Users, color: 'text-purple-500' },
    { label: 'FOLLOWING', value: stats.following, icon: Users, color: 'text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 h-full">
      {mainStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          className="p-4 md:p-6 bg-white/5 border border-white/10 transition-colors flex flex-col justify-center relative overflow-hidden group"
        >
          {/* Background Scanner */}
          <motion.div
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 pointer-events-none"
          />

          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3 relative z-10">
            <stat.icon size={12} className={stat.color} /> {stat.label}
          </div>
          <span className="text-xl md:text-3xl xl:text-4xl font-mono text-white tracking-tighter leading-none relative z-10">
            {stat.value}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function GitHubExtraStats() {
  const { stats, loading } = useGitHubStats()

  if (loading) {
    return (
      <div className="flex flex-col gap-2 md:gap-4 h-full">
        <div className="p-4 md:p-6 bg-white/5 border border-white/10 h-24 md:flex-1 animate-pulse" />
        <div className="p-4 md:p-6 bg-white/5 border border-white/10 h-24 md:flex-1 animate-pulse" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="flex flex-col gap-2 md:gap-4 h-full">
      {stats.totalCommits !== undefined && (
        <motion.div
          whileHover={{ x: 4 }}
          className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors md:flex-1 flex flex-col justify-center relative overflow-hidden group"
        >
          {/* Subtle Pulse */}
          <div className="absolute inset-0 bg-[#ff00ff]/[0.02] animate-pulse" />

          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3 relative z-10">
            <Activity size={12} className="text-[#ff00ff]" /> CONTRIBS_TOTAL
          </div>
          <span className="text-2xl md:text-4xl xl:text-5xl font-mono text-white tracking-tighter leading-none relative z-10">
            {stats.totalCommits.toLocaleString()}
          </span>
        </motion.div>
      )}

      {(stats.mostActiveRepo || stats.lastCommit) && (
        <motion.div
          whileHover={{ x: 4 }}
          className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer md:flex-1 flex flex-col justify-center relative"
          onClick={() => window.open(stats.mostActiveRepo?.url || stats.lastCommit?.url, '_blank')}
        >
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
            <TerminalIcon size={12} className="text-green-500" /> ACTIVE_REPO
          </div>
          <div className="truncate text-sm md:text-lg xl:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-[#ff00ff] transition-colors uppercase tracking-tight">
            {(stats.mostActiveRepo?.name || stats.lastCommit?.repo || '').split('/').pop()}
          </div>
          <div className="text-[8px] md:text-[11px] text-gray-500 font-mono">
            {stats.mostActiveRepo?.commits || 'RECENT'} COMMITS // <span className="text-green-900 group-hover:text-green-500">LIVE_LINK</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function Stats() {
  return (
    <div className="space-y-8 md:space-y-12 pb-20 px-4 md:px-0 font-sans">
      {/* header */}
      <div className="flex items-center gap-4">
        <BarChart3 size={24} className="text-[#ff00ff]" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight font-black">
            SYSTEM_METRICS
          </h1>
          <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
            REAL-TIME CODING ACTIVITY & CONTRIBUTION DATA
          </p>
        </div>
      </div>

      {/* github section */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-[#ff00ff] uppercase font-black tracking-widest">
          <Github size={14} /> GITHUB_PROFILE
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <GitHubMainStats />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <ContributionHeatmap />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <VisualContributionHeatmap />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <GitHubExtraStats />
          </div>
        </div>
      </section>

      {/* wakatime section */}
      <section className="space-y-6">
        <WakaTimeDashboard />
      </section>
    </div>
  )
}
