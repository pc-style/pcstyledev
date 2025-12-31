import { select } from '@inquirer/prompts'
import { loadProjects, getProject, updateProject } from '../lib/projects'
import { autoDeploy } from '../lib/deploy'
import type { ProjectStatus } from '../lib/types'

const STATUS_OPTIONS: ProjectStatus[] = ['active', 'maintenance', 'experimental', 'prototype', 'disabled']

export async function changestatus(name: string) {
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

  console.log(`\ncurrent status: ${project.status}`)

  const newStatus = await select({
    message: 'new status:',
    choices: STATUS_OPTIONS.map(s => ({
      value: s,
      name: s + (s === project!.status ? ' (current)' : '')
    })),
    default: project.status
  })

  if (newStatus === project.status) {
    console.log('status unchanged')
    return
  }

  await updateProject(project.id, { status: newStatus })
  console.log(`\nchanged ${project.name} status: ${project.status} → ${newStatus}`)
  await autoDeploy(`${project.name}: ${project.status} → ${newStatus}`)
}
