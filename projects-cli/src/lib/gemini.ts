import { GoogleGenAI, Type } from '@google/genai'
import { readFile } from 'fs/promises'
import { join, basename, extname } from 'path'
import { glob } from 'glob'
import type { ProjFile } from './types'

const ANALYSIS_PROMPT = `Analyze this project and extract metadata for a portfolio site.

Guidelines:
- id: slug derived from project name (lowercase, hyphens, no special chars)
- name: display name
- desc: one sentence description, lowercase, no period at the end
- stack: array of 2-6 main technologies/frameworks used (prefer canonical names if obvious)
- link: detected website url or null if not found
- github: detected github repo url or null if not found
- status: one of "active", "maintenance", "experimental", "prototype" (guess based on activity/completeness)
- icon: suggested lucide icon name (e.g. "Cpu", "Monitor", "Sparkles", "Globe", "Gamepad2", "Zap", "Clock", "Layers", "Calculator", "Box", "FileText", "Code", "Database", "Server", "Terminal")

Use the signals summary and file tree to infer languages, frameworks, and runtime targets before reading the full files.

Project files:
`

const PROJECT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'slug derived from project name, lowercase with hyphens' },
    name: { type: Type.STRING, description: 'display name of the project' },
    desc: { type: Type.STRING, description: 'one sentence description, lowercase, no period' },
    stack: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-5 main technologies' },
    link: { type: Type.STRING, description: 'website url if detected', nullable: true },
    github: { type: Type.STRING, description: 'github repo url if detected', nullable: true },
    status: { type: Type.STRING, description: 'one of: active, maintenance, experimental, prototype' },
    icon: { type: Type.STRING, description: 'lucide icon name like Cpu, Monitor, Globe, etc' }
  },
  required: ['id', 'name', 'desc', 'stack', 'status', 'icon']
}

export async function gatherProjectFiles(dirname: string): Promise<string[]> {
  // find relevant files to analyze
  const priorityPatterns = [
    'README.md',
    'readme.md',
    'README',
    'LICENSE',
    'package.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'package-lock.json',
    'bun.lockb',
    'bun.lock',
    'tsconfig.json',
    'jsconfig.json',
    'vite.config.{ts,tsx,js,cjs,mjs}',
    'next.config.{ts,js,mjs,cjs}',
    'tailwind.config.{ts,js,cjs}',
    'astro.config.{ts,js,mjs}',
    'svelte.config.{js,cjs,mjs}',
    'nuxt.config.{ts,js,mjs,cjs}',
    'Cargo.toml',
    'Cargo.lock',
    'pyproject.toml',
    'setup.py',
    'requirements.txt',
    'requirements-dev.txt',
    'Pipfile',
    'Pipfile.lock',
    'go.mod',
    'go.sum',
    'composer.json',
    'Gemfile',
    'pubspec.yaml',
    'pom.xml',
    'build.gradle',
    'build.gradle.kts',
    'vercel.json',
    'netlify.toml',
    'src/index.{ts,tsx,js,jsx}',
    'src/main.{ts,tsx,js,jsx,py,rs,go}',
    'src/app.{ts,tsx,js,jsx}',
    'lib/index.{ts,tsx,js,jsx}',
    'app/page.{ts,tsx,js,jsx}',
    'index.{ts,tsx,js,jsx,html}'
  ]

  const secondaryPatterns = [
    'src/**/*.{ts,tsx,js,jsx,py,rs,go,java,kt,swift,cs,cpp,c,h,rb,php}',
    'app/**/*.{ts,tsx,js,jsx,py,rs,go,java,kt,swift,cs,cpp,c,h,rb,php}'
  ]

  const files: string[] = []
  const seen = new Set<string>()
  const maxFiles = 25

  for (const pattern of priorityPatterns) {
    if (files.length >= maxFiles) break
    const matches = await glob(join(dirname, pattern), { nodir: true })
    for (const match of matches.sort()) {
      if (files.length >= maxFiles) break
      if (seen.has(match)) continue
      seen.add(match)
      files.push(match)
    }
  }

  for (const pattern of secondaryPatterns) {
    if (files.length >= maxFiles) break
    const matches = await glob(join(dirname, pattern), { nodir: true })
    for (const match of matches.sort()) {
      if (files.length >= maxFiles) break
      if (seen.has(match)) continue
      seen.add(match)
      files.push(match)
    }
  }

  // also check for .git/config to find github url
  const gitConfig = join(dirname, '.git/config')
  try {
    await readFile(gitConfig)
    files.push(gitConfig)
  } catch {}

  return files.slice(0, maxFiles)
}

export async function buildContext(dirname: string, files: string[]): Promise<string> {
  const parts: string[] = []

  parts.push(`Project directory: ${basename(dirname)}`)
  parts.push('')

  const signals = await buildSignals(dirname)
  if (signals) {
    parts.push('--- signals ---')
    parts.push(signals)
    parts.push('')
  }

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8')
      const relativePath = file.replace(dirname, '').replace(/^\//, '')

      // truncate large files
      const truncated = content.length > 4000
        ? content.slice(0, 4000) + '\n... (truncated)'
        : content

      parts.push(`--- ${relativePath} ---`)
      parts.push(truncated)
      parts.push('')
    } catch {}
  }

  return parts.join('\n')
}

const IGNORE_GLOBS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/.cache/**'
]

const DEP_HINTS: Record<string, string> = {
  react: 'React',
  'react-dom': 'React',
  next: 'Next.js',
  vite: 'Vite',
  electron: 'Electron',
  hono: 'Hono',
  'socket.io': 'Socket.IO',
  three: 'Three.js',
  p5: 'p5.js',
  tailwindcss: 'Tailwind CSS',
  convex: 'Convex',
  bun: 'Bun'
}

async function buildSignals(dirname: string): Promise<string> {
  const parts: string[] = []
  const allFiles = await glob('**/*', {
    cwd: dirname,
    nodir: true,
    dot: false,
    ignore: IGNORE_GLOBS
  })

  const sortedFiles = allFiles.sort()
  parts.push(`file_count: ${sortedFiles.length}`)

  const extCounts = new Map<string, number>()
  const topDirs = new Map<string, number>()
  for (const file of sortedFiles) {
    const ext = extname(file).toLowerCase()
    if (ext) {
      extCounts.set(ext, (extCounts.get(ext) ?? 0) + 1)
    }
    const firstSegment = file.split('/')[0]
    if (firstSegment && firstSegment.includes('.') === false && file.includes('/')) {
      topDirs.set(firstSegment, (topDirs.get(firstSegment) ?? 0) + 1)
    }
  }

  const topExts = [...extCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([ext, count]) => `${ext}(${count})`)
    .join(', ')
  if (topExts) parts.push(`top_extensions: ${topExts}`)

  const topDirList = [...topDirs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([dir]) => dir)
    .join(', ')
  if (topDirList) parts.push(`top_dirs: ${topDirList}`)

  const treeSample = sortedFiles.slice(0, 40)
  if (treeSample.length > 0) {
    parts.push('file_tree_sample:')
    parts.push(treeSample.map((file) => `- ${file}`).join('\n'))
  }

  const packageJson = await readJsonSafe(join(dirname, 'package.json'))
  if (packageJson) {
    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
      ...(packageJson.peerDependencies || {})
    }
    const depNames = Object.keys(deps)
    const scripts = packageJson.scripts ? Object.keys(packageJson.scripts) : []
    const hints = new Set<string>()
    depNames.forEach((dep) => {
      const hint = DEP_HINTS[dep]
      if (hint) hints.add(hint)
    })

    if (depNames.length > 0) {
      parts.push(`js_deps: ${depNames.slice(0, 14).join(', ')}`)
    }
    if (scripts.length > 0) {
      parts.push(`scripts: ${scripts.slice(0, 10).join(', ')}`)
    }
    if (hints.size > 0) {
      parts.push(`framework_hints: ${Array.from(hints).join(', ')}`)
    }
  }

  const requirements = await readTextSafe(join(dirname, 'requirements.txt'))
  if (requirements) {
    const libs = requirements
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split(/[=<>~!]/)[0])
      .filter(Boolean)
    if (libs.length > 0) {
      parts.push(`py_deps: ${libs.slice(0, 12).join(', ')}`)
    }
  }

  const cargo = await readTextSafe(join(dirname, 'Cargo.toml'))
  if (cargo) {
    const deps = extractTomlSection(cargo, 'dependencies')
    if (deps.length > 0) {
      parts.push(`rust_deps: ${deps.slice(0, 10).join(', ')}`)
    }
  }

  const goMod = await readTextSafe(join(dirname, 'go.mod'))
  if (goMod) {
    const moduleMatch = goMod.match(/^module\s+(.+)$/m)
    if (moduleMatch) parts.push(`go_module: ${moduleMatch[1].trim()}`)
  }

  const gitConfig = await readTextSafe(join(dirname, '.git/config'))
  if (gitConfig) {
    const remote = extractGitRemote(gitConfig)
    if (remote) parts.push(`git_remote: ${remote}`)
  }

  return parts.join('\n')
}

async function readTextSafe(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf-8')
  } catch {
    return null
  }
}

async function readJsonSafe(path: string): Promise<Record<string, any> | null> {
  const text = await readTextSafe(path)
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractTomlSection(content: string, section: string): string[] {
  const lines = content.split('\n')
  const deps: string[] = []
  let inSection = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('[')) {
      inSection = trimmed === `[${section}]`
      continue
    }
    if (!inSection) continue
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([A-Za-z0-9_-]+)\s*=/)
    if (match) deps.push(match[1])
  }

  return deps
}

function extractGitRemote(content: string): string | null {
  const remoteSection = content.match(/\[remote "origin"\][\s\S]*?(?=\n\[|$)/)
  if (!remoteSection) return null
  const urlMatch = remoteSection[0].match(/url\s*=\s*(.+)/)
  return urlMatch ? urlMatch[1].trim() : null
}

export async function analyzeWithGemini(apiKey: string, context: string): Promise<ProjFile> {
  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: ANALYSIS_PROMPT + context,
    config: {
      temperature: 0.3,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
      responseSchema: PROJECT_SCHEMA
    }
  })

  const text = response.text || ''

  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error(`failed to parse gemini response: ${text}`)
  }
}
