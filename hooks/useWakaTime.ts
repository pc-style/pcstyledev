import { useState, useEffect, useCallback } from 'react'
import type { WakaTimeSummary, WakaTimeStatus } from '../lib/types'

interface UseWakaTimeSummaryResult {
  summary: WakaTimeSummary | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWakaTimeSummary(): UseWakaTimeSummaryResult {
  const [summary, setSummary] = useState<WakaTimeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/wakatime/summary')
      if (!res.ok) throw new Error('failed to fetch wakatime summary')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSummary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, loading, error, refetch: fetchSummary }
}

interface UseWakaTimeStatusResult {
  status: WakaTimeStatus | null
  loading: boolean
  error: string | null
}

export function useWakaTimeStatus(pollInterval = 30000): UseWakaTimeStatusResult {
  const [status, setStatus] = useState<WakaTimeStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/wakatime/status')
        if (!res.ok) throw new Error('failed to fetch status')
        const data = await res.json()
        if (mounted) {
          if (data.error) {
            setError(data.error)
          } else {
            setStatus(data)
            setError(null)
          }
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'unknown error')
          setLoading(false)
        }
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, pollInterval)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [pollInterval])

  return { status, loading, error }
}
