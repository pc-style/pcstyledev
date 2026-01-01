import { loadProjects, saveProjects } from '../lib/projects'
import { loadStackConfig, normalizeStackList } from '../lib/stack'

interface NormalizeOptions {
  fix?: boolean
}

export async function normalize(options: NormalizeOptions) {
  const data = await loadProjects()
  const config = await loadStackConfig()

  const changes: string[] = []
  const unknowns: string[] = []

  data.projects.forEach((project) => {
    const result = normalizeStackList(project.stack, config)

    if (result.unknown.length > 0) {
      unknowns.push(`${project.id}: ${result.unknown.join(', ')}`)
    }

    if (result.changed) {
      changes.push(`${project.id}: ${project.stack.join(', ')} -> ${result.normalized.join(', ')}`)
      if (options.fix) {
        project.stack = result.normalized
      }
    }
  })

  if (changes.length === 0 && unknowns.length === 0) {
    console.log('stack labels already normalized')
    return
  }

  if (changes.length > 0) {
    console.log('\nstack normalization suggestions:')
    changes.forEach((line) => console.log(`- ${line}`))
  }

  if (unknowns.length > 0) {
    console.log('\nunknown stack labels:')
    unknowns.forEach((line) => console.log(`- ${line}`))
  }

  if (options.fix) {
    await saveProjects(data)
    console.log('\nnormalized stack labels written to projects.json')
    return
  }

  process.exit(1)
}
