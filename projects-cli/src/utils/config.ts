import { homedir } from 'os'
import { join, dirname } from 'path'
import { readFileSync, existsSync } from 'fs'

// path to the main website repo where projects.json lives
export const REPO_PATH = process.env.PCSTYLE_REPO_PATH || join(homedir(), 'projects/pcstyledev/pcstyledev')

export const PROJECTS_JSON_PATH = join(REPO_PATH, 'data/projects/projects.json')
export const STACK_CANONICAL_PATH = join(REPO_PATH, 'data/projects/stack-canonical.json')

// load .env.local from repo root or cli directory
function loadEnvLocal(): Record<string, string> {
  const locations = [
    join(REPO_PATH, '.env.local'),
    join(dirname(import.meta.dir), '..', '.env.local'),
    join(process.cwd(), '.env.local')
  ]

  for (const path of locations) {
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8')
      const vars: Record<string, string> = {}

      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        const [key, ...rest] = trimmed.split('=')
        if (key && rest.length) {
          vars[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
      return vars
    }
  }
  return {}
}

const envLocal = loadEnvLocal()

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || envLocal.GEMINI_API_KEY

export function ensureGeminiKey(): string {
  if (!GEMINI_API_KEY) {
    console.error('error: GEMINI_API_KEY not found')
    console.error('add it to .env.local: GEMINI_API_KEY=your_key')
    process.exit(1)
  }
  return GEMINI_API_KEY
}
