import { resolve } from 'path'
import { writeFile, access } from 'fs/promises'
import { input, confirm, select } from '@inquirer/prompts'
import { gatherProjectFiles, buildContext, analyzeWithGemini } from '../lib/gemini'
import { addProject } from '../lib/projects'
import { loadStackConfig, normalizeStackList } from '../lib/stack'
import { maybeExtendStackConfig } from './stack-utils'
import { autoDeploy } from '../lib/deploy'
import { ensureGeminiKey } from '../utils/config'
import type { Project, ProjectStatus, ProjFile } from '../lib/types'

const STATUS_OPTIONS: ProjectStatus[] = ['active', 'maintenance', 'experimental', 'prototype', 'disabled']

export async function add(dirname: string) {
  const apiKey = ensureGeminiKey()
  const projectPath = resolve(dirname)
  let stackConfig = await loadStackConfig()

  // verify directory exists
  try {
    await access(projectPath)
  } catch {
    console.error(`error: directory not found: ${projectPath}`)
    process.exit(1)
  }

  console.log(`\nanalyzing ${projectPath}...`)

  // gather files
  const files = await gatherProjectFiles(projectPath)
  if (files.length === 0) {
    console.error('error: no recognizable project files found')
    process.exit(1)
  }

  console.log(`found ${files.length} files to analyze`)

  // build context and analyze
  const context = await buildContext(projectPath, files)

  console.log('sending to gemini...')
  let analysis: ProjFile

  try {
    analysis = await analyzeWithGemini(apiKey, context)
  } catch (e) {
    console.error(`error: ${e}`)
    process.exit(1)
  }

  let initialNormalization = normalizeStackList(analysis.stack, stackConfig)
  if (initialNormalization.unknown.length > 0) {
    stackConfig = await maybeExtendStackConfig(stackConfig, initialNormalization.unknown)
    initialNormalization = normalizeStackList(analysis.stack, stackConfig)
  }
  if (initialNormalization.changed) {
    analysis.stack = initialNormalization.normalized
  }
  if (initialNormalization.unknown.length > 0) {
    console.warn(`warning: unknown stack labels: ${initialNormalization.unknown.join(', ')}`)
  }

  console.log('\ngemini analysis:')
  console.log('─'.repeat(40))
  console.log(`  id:     ${analysis.id}`)
  console.log(`  name:   ${analysis.name}`)
  console.log(`  desc:   ${analysis.desc}`)
  console.log(`  stack:  ${analysis.stack.join(', ')}`)
  console.log(`  link:   ${analysis.link || '(not detected)'}`)
  console.log(`  github: ${analysis.github || '(not detected)'}`)
  console.log(`  status: ${analysis.status}`)
  console.log(`  icon:   ${analysis.icon}`)
  console.log('─'.repeat(40))

  // confirm or edit fields
  const wantToEdit = await confirm({ message: 'do you want to edit any fields?', default: false })

  if (wantToEdit) {
    analysis.id = await input({ message: 'id:', default: analysis.id })
    analysis.name = await input({ message: 'name:', default: analysis.name })
    analysis.desc = await input({ message: 'desc:', default: analysis.desc })

    const stackStr = await input({ message: 'stack (comma-separated):', default: analysis.stack.join(', ') })
    analysis.stack = stackStr.split(',').map(s => s.trim()).filter(Boolean)

    let normalized = normalizeStackList(analysis.stack, stackConfig)
    if (normalized.unknown.length > 0) {
      stackConfig = await maybeExtendStackConfig(stackConfig, normalized.unknown)
      normalized = normalizeStackList(analysis.stack, stackConfig)
    }
    if (normalized.changed) {
      analysis.stack = normalized.normalized
    }
    if (normalized.unknown.length > 0) {
      console.warn(`warning: unknown stack labels: ${normalized.unknown.join(', ')}`)
    }

    analysis.link = await input({ message: 'link (or empty):', default: analysis.link || '' }) || undefined
    analysis.github = await input({ message: 'github (or empty):', default: analysis.github || '' }) || undefined

    analysis.status = await select({
      message: 'status:',
      choices: STATUS_OPTIONS.map(s => ({ value: s, name: s })),
      default: analysis.status
    })

    analysis.icon = await input({ message: 'icon:', default: analysis.icon })
  }

  // write .proj file
  const projPath = resolve(projectPath, '.proj')
  await writeFile(projPath, JSON.stringify(analysis, null, 2) + '\n')
  console.log(`\nwrote ${projPath}`)

  // sync to projects.json
  const shouldSync = await confirm({ message: 'sync to pcstyle.dev?', default: true })

  if (shouldSync) {
    const now = new Date().toISOString()
    const project: Project = {
      ...analysis,
      createdAt: now,
      updatedAt: now
    }

    try {
      await addProject(project)
      console.log('synced to projects.json!')
      await autoDeploy(`add project: ${analysis.name}`)
    } catch (e) {
      console.error(`error: ${e}`)
    }
  }
}
