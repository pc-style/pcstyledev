import { input, select, confirm } from '@inquirer/prompts'
import { loadProjects, getProject, updateProject as updateProjectData } from '../lib/projects'
import { autoDeploy } from '../lib/deploy'
import type { ProjectStatus } from '../lib/types'

const STATUS_OPTIONS: ProjectStatus[] = ['active', 'maintenance', 'experimental', 'prototype', 'disabled']

interface UpdateOptions {
  field?: string
}

export async function update(name: string, options: UpdateOptions) {
  const data = await loadProjects()

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
      newValue = stackStr.split(',').map(s => s.trim()).filter(Boolean)
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
  updates.stack = stackStr.split(',').map(s => s.trim()).filter(Boolean)

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
