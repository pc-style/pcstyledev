import { input, select, confirm } from '@inquirer/prompts'
import { access, readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { loadProjects, getProject, updateProject as updateProjectData } from '../lib/projects'
import { loadStackConfig, normalizeStackList } from '../lib/stack'
import { maybeExtendStackConfig } from './stack-utils'
import { gatherProjectFiles, buildContext, analyzeWithGemini } from '../lib/gemini'
import { ensureGeminiKey } from '../utils/config'
import { autoDeploy } from '../lib/deploy'
import type { ProjectStatus } from '../lib/types'
import type { ProjFile } from '../lib/types'

const STATUS_OPTIONS: ProjectStatus[] = ['active', 'maintenance', 'experimental', 'prototype', 'disabled']

interface UpdateOptions {
  field?: string
  auto?: boolean
  path?: string
}

async function resolveProjectPath(name: string, options: UpdateOptions): Promise<string | null> {
  if (options.path) {
    return resolve(options.path)
  }

  const candidate = resolve(name)
  try {
    await access(candidate)
    return candidate
  } catch {
    return null
  }
}

async function readProjId(projectPath: string): Promise<string | null> {
  try {
    const content = await readFile(join(projectPath, '.proj'), 'utf-8')
    const parsed = JSON.parse(content) as ProjFile
    return parsed.id || null
  } catch {
    return null
  }
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value === null || value === undefined) return '(empty)'
  return String(value)
}

export async function update(name: string, options: UpdateOptions) {
  const data = await loadProjects()
  let stackConfig = await loadStackConfig()

  if (options.auto) {
    if (options.field) {
      console.error('error: --auto cannot be used with --field')
      process.exit(1)
    }

    const projectPath = await resolveProjectPath(name, options)
    const nameIsPath = projectPath !== null && !options.path
    if (!projectPath) {
      console.error('error: project path not found. pass --path <dir> or use a directory argument.')
      process.exit(1)
    }

    let project = nameIsPath
      ? undefined
      : data.projects.find(p => p.id === name || p.name.toLowerCase() === name.toLowerCase())

    if (!project) {
      const projId = await readProjId(projectPath)
      if (projId) {
        project = data.projects.find(p => p.id === projId)
      }
    }

    if (!project) {
      const projectId = await select({
        message: 'select project to update:',
        choices: data.projects.map(p => ({
          value: p.id,
          name: `${p.name} [${p.status}]`
        }))
      })
      project = await getProject(projectId)
    }

    if (!project) {
      console.error('error: no project selected')
      process.exit(1)
    }

    const apiKey = ensureGeminiKey()
    const files = await gatherProjectFiles(projectPath)
    if (files.length === 0) {
      console.error('error: no recognizable project files found for auto update')
      process.exit(1)
    }

    const context = await buildContext(projectPath, files)
    console.log('\nsending to gemini...')

    let analysis: ProjFile
    try {
      analysis = await analyzeWithGemini(apiKey, context)
    } catch (e) {
      console.error(`error: ${e}`)
      process.exit(1)
    }

    let normalized = normalizeStackList(analysis.stack, stackConfig)
    if (normalized.unknown.length > 0) {
      stackConfig = await maybeExtendStackConfig(stackConfig, normalized.unknown)
      normalized = normalizeStackList(analysis.stack, stackConfig)
    }

    if (normalized.unknown.length > 0) {
      console.warn(`warning: unknown stack labels: ${normalized.unknown.join(', ')}`)
    }

    const updates = {
      name: analysis.name || project.name,
      desc: analysis.desc || project.desc,
      stack: normalized.normalized,
      link: analysis.link ? analysis.link : project.link,
      github: analysis.github ? analysis.github : project.github,
      status: analysis.status || project.status,
      icon: analysis.icon || project.icon
    }

    const changes = Object.entries(updates).filter(([key, value]) => {
      const current = (project as any)[key]
      if (Array.isArray(current) && Array.isArray(value)) {
        return current.join(', ') !== value.join(', ')
      }
      return current !== value
    })

    if (changes.length === 0) {
      console.log('no changes detected from gemini analysis')
      return
    }

    console.log('\nproposed updates:')
    changes.forEach(([key, value]) => {
      const current = (project as any)[key]
      console.log(`- ${key}: ${formatValue(current)} -> ${formatValue(value)}`)
    })

    const shouldSave = await confirm({ message: 'apply auto updates?', default: true })
    if (!shouldSave) {
      console.log('cancelled')
      return
    }

    const updated = await updateProjectData(project.id, updates)
    console.log(`\nupdated ${updated.name}!`)
    await autoDeploy(`auto update project: ${updated.name}`)
    return
  }

  // find project by id or name
  let project = data.projects.find(p => p.id === name || p.name.toLowerCase() === name.toLowerCase())

  if (!project) {
    // show selector if not found
    const projectId = await select({
      message: 'project not found. select one:',
      choices: data.projects.map(p => ({
        value: p.id,
        name: `${p.name} [${p.status}]`
      }))
    })
    project = await getProject(projectId)
  }

  if (!project) {
    console.error('error: no project selected')
    process.exit(1)
  }

  console.log(`\nupdating: ${project.name}\n`)

  // if specific field requested
  if (options.field) {
    const field = options.field as keyof typeof project

    if (!(field in project)) {
      console.error(`error: unknown field "${field}"`)
      process.exit(1)
    }

    let newValue: string | string[] | undefined

    if (field === 'stack') {
      const stackStr = await input({
        message: `${field}:`,
        default: (project[field] as string[]).join(', ')
      })
      const rawStack = stackStr.split(',').map(s => s.trim()).filter(Boolean)
      let normalized = normalizeStackList(rawStack, stackConfig)
      if (normalized.unknown.length > 0) {
        stackConfig = await maybeExtendStackConfig(stackConfig, normalized.unknown)
        normalized = normalizeStackList(rawStack, stackConfig)
      }
      if (normalized.unknown.length > 0) {
        console.warn(`warning: unknown stack labels: ${normalized.unknown.join(', ')}`)
      }
      newValue = normalized.normalized
    } else if (field === 'status') {
      newValue = await select({
        message: `${field}:`,
        choices: STATUS_OPTIONS.map(s => ({ value: s, name: s })),
        default: project[field] as ProjectStatus
      })
    } else {
      newValue = await input({
        message: `${field}:`,
        default: String(project[field] || '')
      }) || undefined
    }

    const updated = await updateProjectData(project.id, { [field]: newValue })
    console.log(`\nupdated ${field} for ${updated.name}`)
    await autoDeploy(`update ${updated.name}: ${field}`)
    return
  }

  // interactive update for all editable fields
  const updates: Record<string, any> = {}

  updates.name = await input({ message: 'name:', default: project.name })
  updates.desc = await input({ message: 'desc:', default: project.desc })

  const stackStr = await input({
    message: 'stack (comma-separated):',
    default: project.stack.join(', ')
  })
  const rawStack = stackStr.split(',').map(s => s.trim()).filter(Boolean)
  let normalized = normalizeStackList(rawStack, stackConfig)
  if (normalized.unknown.length > 0) {
    stackConfig = await maybeExtendStackConfig(stackConfig, normalized.unknown)
    normalized = normalizeStackList(rawStack, stackConfig)
  }
  if (normalized.unknown.length > 0) {
    console.warn(`warning: unknown stack labels: ${normalized.unknown.join(', ')}`)
  }
  updates.stack = normalized.normalized

  updates.link = await input({ message: 'link:', default: project.link || '' }) || undefined
  updates.github = await input({ message: 'github:', default: project.github || '' }) || undefined

  updates.status = await select({
    message: 'status:',
    choices: STATUS_OPTIONS.map(s => ({ value: s, name: s })),
    default: project.status
  })

  updates.icon = await input({ message: 'icon:', default: project.icon })

  // confirm
  const shouldSave = await confirm({ message: 'save changes?', default: true })

  if (shouldSave) {
    const updated = await updateProjectData(project.id, updates)
    console.log(`\nupdated ${updated.name}!`)
    await autoDeploy(`update project: ${updated.name}`)
  } else {
    console.log('cancelled')
  }
}
