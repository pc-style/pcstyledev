import { useState, useEffect, useCallback } from 'react'
import type { GitHubContributions, GitHubStats } from '../lib/types'

interface UseGitHubContributionsResult {
  contributions: GitHubContributions | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGitHubContributions(): UseGitHubContributionsResult {
  const [contributions, setContributions] = useState<GitHubContributions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContributions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/github/contributions')
      if (!res.ok) throw new Error('failed to fetch contributions')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContributions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContributions()
  }, [fetchContributions])

  return { contributions, loading, error, refetch: fetchContributions }
}

interface UseGitHubStatsResult {
  stats: GitHubStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGitHubStats(): UseGitHubStatsResult {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/github/stats')
      if (!res.ok) throw new Error('failed to fetch github stats')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}
