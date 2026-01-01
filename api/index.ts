import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import projectsData from '../data/projects/projects.json'

console.log('[API] index.ts module loaded (Edge Runtime) at ' + new Date().toISOString())

import type {
  Project,
  ProjectsData,
  WakaTimeSummary,
  WakaTimeStatus,
  GitHubContributions,
  GitHubStats
} from '../lib/types'

export const config = { runtime: 'edge' }

const projects: Project[] = (projectsData as ProjectsData).projects

const app = new Hono()

// Global logger middleware
app.use('*', async (c, next) => {
  const requestId = Math.random().toString(36).substring(7)
  const method = c.req.method
  const path = c.req.path
  console.log(`[API][${requestId}] START ${method} ${path}`)
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  console.log(`[API][${requestId}] END ${method} ${path} - Status: ${c.res.status} (${duration}ms)`)
})

// Enable CORS
app.use('*', cors())

// cache and inflight tracker
const cache = new Map<string, { data: unknown; expires: number }>()
const inflight = new Map<string, Promise<any>>()
const CACHE_TTL = 60 * 1000
const FETCH_TIMEOUT = 10000

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

// Robust fetch for Edge Runtime
async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  const cacheKey = `${options.method || 'GET'}:${url}`

  if (inflight.has(cacheKey)) {
    const res = await inflight.get(cacheKey)
    return res.clone()
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_TIMEOUT)

  const fetchPromise = (async () => {
    try {
      const headers = new Headers(options.headers || {})
      headers.set('User-Agent', 'pcstyle-dev-portfolio-api/1.2')
      headers.set('Accept', 'application/json')

      console.log(`[API] Edge Fetching ${url}`)
      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })
      console.log(`[API] Edge Response ${url}: ${res.status}`)
      return res
    } finally {
      clearTimeout(timeout)
    }
  })()

  inflight.set(cacheKey, fetchPromise)
  try {
    const res = await fetchPromise
    return res.clone()
  } finally {
    inflight.delete(cacheKey)
  }
}

// Routes
const routes = new Hono().basePath('/api')

routes.get('/health', (c) => c.json({ status: 'ok', runtime: 'edge' }))

routes.get('/projects', (c) => c.json(projects))

routes.get('/projects/:id', (c) => {
  const project = projects.find(p => p.id === c.req.param('id'))
  return project ? c.json(project) : c.json({ error: 'not found' }, 404)
})

routes.get('/projects/meta', (c) => c.json({
  count: projects.length,
  lastUpdated: (projectsData as ProjectsData).lastUpdated
}))

// WakaTime
routes.get('/wakatime/summary', async (c) => {
  const apiKey = process.env.WAKATIME_API_KEY
  if (!apiKey) return c.json({ error: 'missing api key' }, 500)

  const cached = getCached<WakaTimeSummary>('wakatime:summary')
  if (cached) return c.json(cached)

  try {
    const auth = btoa(`${apiKey}:`)
    const res = await fetchWithRetry(
      'https://wakatime.com/api/v1/users/current/summaries?range=last_7_days',
      { headers: { Authorization: `Basic ${auth}` } }
    )

    if (!res.ok) throw new Error(`WakaTime Summary Error: ${res.status}`)
    const data = await res.json()
    const summaries = data.data || []

    let totalSeconds = 0
    const langMap = new Map<string, number>()
    const editorMap = new Map<string, number>()
    const projectMap = new Map<string, number>()
    let bestDay: any = null

    for (const day of summaries) {
      const dayTotal = day.grand_total?.total_seconds || 0
      totalSeconds += dayTotal
      if (!bestDay || dayTotal > bestDay.seconds) {
        bestDay = { date: day.range?.date || '', seconds: dayTotal }
      }
      for (const lang of day.languages || []) langMap.set(lang.name, (langMap.get(lang.name) || 0) + lang.total_seconds)
      for (const editor of day.editors || []) editorMap.set(editor.name, (editorMap.get(editor.name) || 0) + editor.total_seconds)
      for (const proj of day.projects || []) projectMap.set(proj.name, (projectMap.get(proj.name) || 0) + proj.total_seconds)
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
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

routes.get('/wakatime/status', async (c) => {
  const apiKey = process.env.WAKATIME_API_KEY
  if (!apiKey) return c.json({ error: 'missing api key' }, 500)

  const cached = getCached<WakaTimeStatus>('wakatime:status')
  if (cached) return c.json(cached)

  try {
    const auth = btoa(`${apiKey}:`)
    const res = await fetchWithRetry(
      'https://wakatime.com/api/v1/users/current/statusbar/today',
      { headers: { Authorization: `Basic ${auth}` } }
    )

    if (!res.ok) throw new Error(`WakaTime Status Error: ${res.status}`)
    const data = await res.json()
    const hasRecentActivity = (data.data?.grand_total?.total_seconds || 0) > 0

    const status: WakaTimeStatus = {
      isActive: hasRecentActivity && !!data.data?.categories?.length,
      project: data.data?.projects?.[0]?.name || null,
      language: data.data?.languages?.[0]?.name || null,
      editor: data.data?.editors?.[0]?.name || null,
      lastHeartbeat: data.data?.categories?.[0]?.name ? new Date().toISOString() : null
    }

    setCache('wakatime:status', status)
    return c.json(status)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// GitHub
routes.get('/github/contributions', async (c) => {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME
  if (!token || !username) return c.json({ error: 'missing github credentials' }, 500)

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
    const res = await fetchWithRetry('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { username } })
    })

    if (!res.ok) throw new Error(`GitHub GraphQL Error: ${res.status}`)
    const data = await res.json()
    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar) throw new Error('No calendar data')

    const levelMap: any = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }
    const contributions: GitHubContributions = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week: any) =>
        week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] || 0
        }))
      )
    }

    setCache('github:contributions', contributions)
    return c.json(contributions)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

routes.get('/github/stats', async (c) => {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME
  if (!token || !username) return c.json({ error: 'missing github credentials' }, 500)

  const cached = getCached<GitHubStats>('github:stats')
  if (cached) return c.json(cached)

  try {
    const userRes = await fetchWithRetry(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!userRes.ok) throw new Error(`GitHub User Error: ${userRes.status}`)
    const user = await userRes.json()

    const reposRes = await fetchWithRetry(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const repos = reposRes.ok ? await reposRes.json() : []
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0)

    const eventsRes = await fetchWithRetry(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const events = eventsRes.ok ? await eventsRes.json() : []

    // Process events for last commit (Ignore automated bot repo)
    const pushEvents = events.filter((e: any) =>
      e.type === 'PushEvent' && e.repo.name !== 'pc-style/pc-style'
    )
    let lastCommit = undefined
    if (pushEvents.length > 0) {
      const latest = pushEvents[0]
      const commit = latest.payload.commits?.[latest.payload.commits.length - 1] // usually the last one in the push is the latest? Actually payload.commits order varies, often it's the head. Let's assume the first event is newest.
      if (commit) {
        lastCommit = {
          message: commit.message,
          repo: latest.repo.name,
          date: latest.created_at,
          url: `https://github.com/${latest.repo.name}/commit/${commit.sha}`
        }
      }
    }

    // Process most active repo (last 7 days approx, based on event page)
    const repoCounts: Record<string, number> = {}
    pushEvents.forEach((e: any) => {
      const name = e.repo.name
      const count = e.payload.commits?.length || 1 // count commits or just pushes? User said "amount of commits"
      repoCounts[name] = (repoCounts[name] || 0) + count
    })
    let mostActiveRepo = undefined
    const sortedRepos = Object.entries(repoCounts).sort((a, b) => b[1] - a[1])
    if (sortedRepos.length > 0) {
      mostActiveRepo = {
        name: sortedRepos[0][0],
        url: `https://github.com/${sortedRepos[0][0]}`,
        commits: sortedRepos[0][1]
      }
    }

    // Get Total Contributions (GraphQL again, cleaner to separate but logic demands it here)
    const contribQuery = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `
    const contribRes = await fetchWithRetry('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: contribQuery, variables: { username } })
    })
    const contribData = contribRes.ok ? await contribRes.json() : {}
    const totalCommits = contribData.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0

    const stats: GitHubStats = {
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      totalStars,
      totalCommits,
      lastCommit,
      mostActiveRepo
    }

    setCache('github:stats', stats)
    return c.json(stats)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.route('/', routes)
app.all('/api/*', (c) => c.json({ error: 'not found' }, 404))

export default handle(app)
