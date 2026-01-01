import { confirm, input } from '@inquirer/prompts'
import { saveStackConfig } from '../lib/stack'
import type { StackConfig } from '../lib/stack'

const normalizeKey = (value: string) => value.trim().toLowerCase()

const dedupeCanonical = (values: string[]) => {
  const seen = new Set<string>()
  const result: string[] = []
  values.forEach((value) => {
    const key = normalizeKey(value)
    if (seen.has(key)) return
    seen.add(key)
    result.push(value)
  })
  return result
}

const dedupeGlossary = (entries: StackConfig['glossary']) => {
  const seen = new Set<string>()
  const result: StackConfig['glossary'] = []
  entries.forEach((entry) => {
    const key = normalizeKey(entry.label)
    if (seen.has(key)) return
    seen.add(key)
    result.push(entry)
  })
  return result
}

export async function maybeExtendStackConfig(
  config: StackConfig,
  unknowns: string[]
): Promise<StackConfig> {
  if (unknowns.length === 0) return config

  const shouldAdd = await confirm({
    message: `add ${unknowns.length} unknown stack label${unknowns.length > 1 ? 's' : ''} to the canonical list?`,
    default: false
  })

  if (!shouldAdd) return config

  const updated: StackConfig = {
    canonical: [...config.canonical],
    aliases: { ...config.aliases },
    glossary: [...config.glossary]
  }
  let changed = false

  for (const unknown of unknowns) {
    const canonicalInput = await input({
      message: `canonical label for "${unknown}" (leave blank to skip):`,
      default: unknown
    })
    const canonical = canonicalInput.trim()
    if (!canonical) continue

    const existingCanonical = updated.canonical.find(
      (label) => normalizeKey(label) === normalizeKey(canonical)
    )

    if (existingCanonical) {
      if (normalizeKey(unknown) !== normalizeKey(existingCanonical)) {
        updated.aliases[unknown] = existingCanonical
        changed = true
      }
      continue
    }

    updated.canonical.push(canonical)
    const descInput = await input({
      message: `glossary description for "${canonical}" (optional):`,
      default: ''
    })
    const desc = descInput.trim() || 'custom stack'
    updated.glossary.push({ label: canonical, desc })
    changed = true
  }

  if (!changed) return config

  updated.canonical = dedupeCanonical(updated.canonical)
  updated.glossary = dedupeGlossary(updated.glossary)

  await saveStackConfig(updated)
  console.log('updated stack-canonical.json')

  return updated
}
