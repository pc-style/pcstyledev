import { BarChart3, Github, Star, Users, GitFork, Activity, Terminal as TerminalIcon } from 'lucide-react'
import { WakaTimeDashboard } from '../components/ui/WakaTimeDashboard'
import { ContributionHeatmap } from '../components/ui/ContributionHeatmap'
import { useGitHubStats } from '../hooks/useGitHub'

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

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 h-full">
      <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
          <GitFork size={12} className="text-blue-500" /> REPOS
        </div>
        <span className="text-xl md:text-3xl xl:text-4xl font-mono text-white tracking-tighter leading-none">
          {stats.publicRepos}
        </span>
      </div>
      <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
          <Star size={12} className="text-yellow-500" /> STARS
        </div>
        <span className="text-xl md:text-3xl xl:text-4xl font-mono text-white tracking-tighter leading-none">
          {stats.totalStars}
        </span>
      </div>
      <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
          <Users size={12} className="text-purple-500" /> FOLLOWS
        </div>
        <span className="text-xl md:text-3xl xl:text-4xl font-mono text-white tracking-tighter leading-none">
          {stats.followers}
        </span>
      </div>
      <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
          <Users size={12} className="text-purple-400" /> FOLLOWING
        </div>
        <span className="text-xl md:text-3xl xl:text-4xl font-mono text-white tracking-tighter leading-none">
          {stats.following}
        </span>
      </div>
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
        <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors md:flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
            <Activity size={12} className="text-[#ff00ff]" /> CONTRIBS
          </div>
          <span className="text-2xl md:text-4xl xl:text-5xl font-mono text-white tracking-tighter leading-none">
            {stats.totalCommits.toLocaleString()}
          </span>
        </div>
      )}

      {(stats.mostActiveRepo || stats.lastCommit) && (
        <div className="p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer md:flex-1 flex flex-col justify-center" onClick={() => window.open(stats.mostActiveRepo?.url || stats.lastCommit?.url, '_blank')}>
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 md:mb-3">
            <TerminalIcon size={12} className="text-green-500" /> ACTIVE_REPO
          </div>
          <div className="truncate text-sm md:text-lg xl:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-[#ff00ff] transition-colors uppercase tracking-tight">
            {(stats.mostActiveRepo?.name || stats.lastCommit?.repo || '').split('/').pop()}
          </div>
          <div className="text-[8px] md:text-[11px] text-gray-500 font-mono">
            {stats.mostActiveRepo?.commits || 'RECENT'} COMMITS
          </div>
        </div>
      )}
    </div>
  )
}

export function Stats() {
  return (
    <div className="space-y-8 md:space-y-12 pb-20 px-4 md:px-0">
      {/* header */}
      <div className="flex items-center gap-4">
        <BarChart3 size={24} className="text-[#ff00ff]" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
            SYSTEM_METRICS
          </h1>
          <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            REAL-TIME CODING ACTIVITY & CONTRIBUTION DATA
          </p>
        </div>
      </div>

      {/* github section */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-[#ff00ff] uppercase font-black tracking-widest">
          <Github size={14} /> GITHUB_PROFILE
        </div>
        <div className="flex flex-col xl:flex-row gap-4 items-stretch justify-center">
          {/* Column 1: Core Stats */}
          <div className="w-full xl:w-[400px] flex-shrink-0">
            <GitHubMainStats />
          </div>

          {/* Column 2: Activity Map */}
          <div className="w-full xl:w-fit flex-shrink-0 overflow-hidden">
            <ContributionHeatmap />
          </div>

          {/* Column 3: Impact Stats */}
          <div className="w-full xl:flex-1 xl:min-w-[300px]">
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
