import { readFile, writeFile } from 'fs/promises'
import { STACK_CANONICAL_PATH } from '../utils/config'

export interface StackGlossaryEntry {
  label: string
  desc: string
}

export interface StackConfig {
  canonical: string[]
  aliases: Record<string, string>
  glossary: StackGlossaryEntry[]
}

interface NormalizeResult {
  normalized: string[]
  unknown: string[]
  changed: boolean
}

const normalizeKey = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

export async function loadStackConfig(): Promise<StackConfig> {
  try {
    const content = await readFile(STACK_CANONICAL_PATH, 'utf-8')
    const data = JSON.parse(content)

    if (
      !Array.isArray(data.canonical) ||
      typeof data.aliases !== 'object' ||
      data.aliases === null ||
      !Array.isArray(data.glossary)
    ) {
      throw new Error('invalid stack config schema: missing or malformed fields')
    }

    return data as StackConfig
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`failed to load stack config: ${message}`)
  }
}

export async function saveStackConfig(config: StackConfig): Promise<void> {
  await writeFile(STACK_CANONICAL_PATH, JSON.stringify(config, null, 2) + '\n')
}

export function normalizeStackList(stack: string[], config: StackConfig): NormalizeResult {
  const lookup = new Map<string, string>()

  config.canonical.forEach((label) => {
    lookup.set(normalizeKey(label), label)
  })

  Object.entries(config.aliases).forEach(([alias, canonical]) => {
    if (!config.canonical.includes(canonical)) {
      console.warn(`alias "${alias}" points to unknown canonical label "${canonical}", skipping`)
      return
    }
    lookup.set(normalizeKey(alias), canonical)
  })

  const unknown = new Set<string>()
  const normalized: string[] = []
  const seen = new Set<string>()

  stack.forEach((label) => {
    const trimmed = label.trim()
    if (!trimmed) return
    const key = normalizeKey(trimmed)
    const canonical = lookup.get(key)
    if (!canonical) {
      unknown.add(trimmed)
      if (!seen.has(key)) {
        normalized.push(trimmed)
        seen.add(key)
      }
      return
    }

    const canonicalKey = normalizeKey(canonical)
    if (!seen.has(canonicalKey)) {
      normalized.push(canonical)
      seen.add(canonicalKey)
    }
  })

  const original = stack.map((label) => label.trim()).filter(Boolean)
  const changed =
    normalized.length !== original.length ||
    normalized.some((val, idx) => val !== original[idx])

  return {
    normalized,
    unknown: Array.from(unknown),
    changed
  }
}
