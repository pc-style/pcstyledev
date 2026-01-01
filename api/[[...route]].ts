import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { readFileSync } from 'fs'
import { join } from 'path'
import type {
  Project,
  ProjectsData,
  WakaTimeSummary,
  WakaTimeStatus,
  GitHubContributions,
  GitHubStats
} from '../lib/types'

export const config = { runtime: 'nodejs' }

const app = new Hono().basePath('/api')

// lazy load projects data
let projects: Project[] = []
let projectsData: ProjectsData | null = null

function getProjectsData(): ProjectsData {
  if (!projectsData) {
    const projectsPath = join(process.cwd(), 'data/projects/projects.json')
    projectsData = JSON.parse(readFileSync(projectsPath, 'utf-8')) as ProjectsData
    projects = projectsData.projects
  }
  return projectsData
}

function getProjects(): Project[] {
  getProjectsData()
  return projects
}

// simple in-memory cache to avoid hammering external APIs
const cache = new Map<string, { data: unknown; expires: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute
const FETCH_TIMEOUT = 5000 // 5 seconds

// fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    console.log(`[API] Timeout for ${url}`)
    controller.abort()
  }, FETCH_TIMEOUT)

  try {
    console.log(`[API] Fetching ${url}`)
    const res = await fetch(url, { ...options, signal: controller.signal })
    console.log(`[API] Got response from ${url}: ${res.status}`)
    return res
  } catch (err) {
    console.log(`[API] Error fetching ${url}:`, err)
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && entry.expires > Date.now()) {
    return entry.data as T
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL })
}

app.use('*', cors())

// health check
app.get('/health', (c) => {
  console.log('[API] Health check hit')
  return c.json({ status: 'ok', time: new Date().toISOString() })
})

// list all projects
app.get('/projects', (c) => {
  return c.json(getProjects())
})

// get single project by id
app.get('/projects/:id', (c) => {
  const id = c.req.param('id')
  const project = getProjects().find((p) => p.id === id)

  if (!project) {
    return c.json({ error: 'project not found' }, 404)
  }

  return c.json(project)
})

// get projects metadata
app.get('/projects/meta', (c) => {
  const data = getProjectsData()
  return c.json({
    count: data.projects.length,
    lastUpdated: data.lastUpdated
  })
})

// wakatime: get 7-day summary
app.get('/wakatime/summary', async (c) => {
  console.log('[API] wakatime/summary called')
  const apiKey = process.env.WAKATIME_API_KEY
  if (!apiKey) {
    console.log('[API] No WAKATIME_API_KEY')
    return c.json({ error: 'wakatime api key not configured' }, 500)
  }

  const cached = getCached<WakaTimeSummary>('wakatime:summary')
  if (cached) {
    console.log('[API] Returning cached wakatime summary')
    return c.json(cached)
  }

  try {
    // wakatime uses api key as username with empty password
    const auth = Buffer.from(`${apiKey}:`).toString('base64')
    const res = await fetchWithTimeout(
      'https://wakatime.com/api/v1/users/current/summaries?range=last_7_days',
      { headers: { Authorization: `Basic ${auth}` } }
    )

    if (!res.ok) {
      return c.json({ error: 'wakatime api error' }, 500)
    }

    const data = await res.json()
    const summaries = data.data || []

    // aggregate stats across all days
    let totalSeconds = 0
    const langMap = new Map<string, number>()
    const editorMap = new Map<string, number>()
    const projectMap = new Map<string, number>()
    let bestDay: { date: string; seconds: number } | null = null

    for (const day of summaries) {
      const dayTotal = day.grand_total?.total_seconds || 0
      totalSeconds += dayTotal

      if (!bestDay || dayTotal > bestDay.seconds) {
        bestDay = { date: day.range?.date || '', seconds: dayTotal }
      }

      for (const lang of day.languages || []) {
        langMap.set(lang.name, (langMap.get(lang.name) || 0) + lang.total_seconds)
      }
      for (const editor of day.editors || []) {
        editorMap.set(editor.name, (editorMap.get(editor.name) || 0) + editor.total_seconds)
      }
      for (const proj of day.projects || []) {
        projectMap.set(proj.name, (projectMap.get(proj.name) || 0) + proj.total_seconds)
      }
    }

    const mapToArray = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([name, secs]) => ({
          name,
          totalSeconds: secs,
          percent: totalSeconds > 0 ? Math.round((secs / totalSeconds) * 100) : 0
        }))
        .sort((a, b) => b.totalSeconds - a.totalSeconds)
        .slice(0, 10)

    const summary: WakaTimeSummary = {
      totalSeconds,
      totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
      dailyAverage: Math.round(totalSeconds / 7),
      languages: mapToArray(langMap),
      editors: mapToArray(editorMap),
      projects: mapToArray(projectMap),
      bestDay,
      range: {
        start: summaries[0]?.range?.date || '',
        end: summaries[summaries.length - 1]?.range?.date || ''
      }
    }

    setCache('wakatime:summary', summary)
    return c.json(summary)
  } catch (err) {
    console.error('wakatime summary error:', err)
    return c.json({ error: 'failed to fetch wakatime data' }, 500)
  }
})

// wakatime: get current status/heartbeat
app.get('/wakatime/status', async (c) => {
  console.log('[API] wakatime/status called')
  const apiKey = process.env.WAKATIME_API_KEY
  if (!apiKey) {
    return c.json({ error: 'wakatime api key not configured' }, 500)
  }

  const cached = getCached<WakaTimeStatus>('wakatime:status')
  if (cached) return c.json(cached)

  try {
    const auth = Buffer.from(`${apiKey}:`).toString('base64')
    const res = await fetchWithTimeout(
      'https://wakatime.com/api/v1/users/current/statusbar/today',
      { headers: { Authorization: `Basic ${auth}` } }
    )

    if (!res.ok) {
      return c.json({ error: 'wakatime api error' }, 500)
    }

    const data = await res.json()

    // check if user is active (had activity in last 5 minutes)
    const lastHeartbeat = data.data?.categories?.[0]?.name
      ? new Date().toISOString()
      : null

    // determine if currently active by checking if there's recent activity
    const hasRecentActivity = data.data?.grand_total?.total_seconds > 0

    const status: WakaTimeStatus = {
      isActive: hasRecentActivity && !!data.data?.categories?.length,
      project: data.data?.projects?.[0]?.name || null,
      language: data.data?.languages?.[0]?.name || null,
      editor: data.data?.editors?.[0]?.name || null,
      lastHeartbeat
    }

    setCache('wakatime:status', status)
    return c.json(status)
  } catch (err) {
    console.error('wakatime status error:', err)
    return c.json({ error: 'failed to fetch wakatime status' }, 500)
  }
})

// github: get contribution calendar
app.get('/github/contributions', async (c) => {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME
  if (!token || !username) {
    return c.json({ error: 'github credentials not configured' }, 500)
  }

  const cached = getCached<GitHubContributions>('github:contributions')
  if (cached) return c.json(cached)

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `

    const res = await fetchWithTimeout('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { username } })
    })

    if (!res.ok) {
      return c.json({ error: 'github api error' }, 500)
    }

    const data = await res.json()
    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar

    if (!calendar) {
      return c.json({ error: 'no contribution data found' }, 404)
    }

    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4
    }

    const contributions: GitHubContributions = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] || 0
        }))
      )
    }

    setCache('github:contributions', contributions)
    return c.json(contributions)
  } catch (err) {
    console.error('github contributions error:', err)
    return c.json({ error: 'failed to fetch github data' }, 500)
  }
})

// github: get profile stats
app.get('/github/stats', async (c) => {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME
  if (!token || !username) {
    return c.json({ error: 'github credentials not configured' }, 500)
  }

  const cached = getCached<GitHubStats>('github:stats')
  if (cached) return c.json(cached)

  try {
    // fetch user profile
    const userRes = await fetchWithTimeout(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!userRes.ok) {
      return c.json({ error: 'github api error' }, 500)
    }

    const user = await userRes.json()

    // fetch repos to calculate total stars
    const reposRes = await fetchWithTimeout(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const repos = reposRes.ok ? await reposRes.json() : []
    const totalStars = repos.reduce((sum: number, repo: { stargazers_count: number }) =>
      sum + (repo.stargazers_count || 0), 0)

    const stats: GitHubStats = {
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      totalStars
    }

    setCache('github:stats', stats)
    return c.json(stats)
  } catch (err) {
    console.error('github stats error:', err)
    return c.json({ error: 'failed to fetch github stats' }, 500)
  }
})

export default handle(app)
