import { BarChart3, Github, Star, Users, GitFork } from 'lucide-react'
import { WakaTimeDashboard } from '../components/ui/WakaTimeDashboard'
import { ContributionHeatmap } from '../components/ui/ContributionHeatmap'
import { useGitHubStats } from '../hooks/useGitHub'

function GitHubStatsCard() {
  const { stats, loading, error } = useGitHubStats()

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-4 bg-white/5 border border-white/10 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">
          <GitFork size={12} /> REPOS
        </div>
        <span className="text-3xl font-mono text-white tracking-tighter">
          {stats.publicRepos}
        </span>
      </div>
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">
          <Star size={12} /> STARS
        </div>
        <span className="text-3xl font-mono text-white tracking-tighter">
          {stats.totalStars}
        </span>
      </div>
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">
          <Users size={12} /> FOLLOWERS
        </div>
        <span className="text-3xl font-mono text-white tracking-tighter">
          {stats.followers}
        </span>
      </div>
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">
          <Users size={12} /> FOLLOWING
        </div>
        <span className="text-3xl font-mono text-white tracking-tighter">
          {stats.following}
        </span>
      </div>
    </div>
  )
}

export function Stats() {
  return (
    <div className="space-y-12">
      {/* header */}
      <div className="flex items-center gap-4">
        <BarChart3 size={24} className="text-[#ff00ff]" />
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            SYSTEM_METRICS
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            REAL-TIME CODING ACTIVITY & CONTRIBUTION DATA
          </p>
        </div>
      </div>

      {/* github section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] text-[#ff00ff] uppercase font-black tracking-widest">
          <Github size={14} /> GITHUB_PROFILE
        </div>
        <GitHubStatsCard />
        <ContributionHeatmap />
      </section>

      {/* wakatime section */}
      <section className="space-y-6">
        <WakaTimeDashboard />
      </section>
    </div>
  )
}
