import { useState, useEffect } from 'react'
import type { CodingStatus } from '../lib/types'

interface UseLiveStatusResult {
  status: CodingStatus | null
  loading: boolean
  error: string | null
}

export function useLiveStatus(pollInterval = 30000): UseLiveStatusResult {
  const [status, setStatus] = useState<CodingStatus | null>(null)
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
            setStatus(null)
          } else {
            setStatus({
              isActive: data.isActive,
              project: data.project,
              language: data.language,
              lastActivity: data.lastHeartbeat
            })
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
