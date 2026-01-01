export type ProjectStatus = 'active' | 'maintenance' | 'experimental' | 'prototype' | 'disabled'

export interface Project {
  id: string
  name: string
  desc: string
  stack: string[]
  link?: string
  github?: string
  status: ProjectStatus
  pinned?: boolean
  icon: string
  createdAt: string
  updatedAt: string
}

export interface ProjectsData {
  projects: Project[]
  lastUpdated: string
}

// wakatime types
export interface WakaTimeLanguage {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeEditor {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeProject {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeSummary {
  totalSeconds: number
  totalHours: number
  dailyAverage: number
  languages: WakaTimeLanguage[]
  editors: WakaTimeEditor[]
  projects: WakaTimeProject[]
  bestDay: { date: string; seconds: number } | null
  range: { start: string; end: string }
}

export interface WakaTimeStatus {
  isActive: boolean
  project: string | null
  language: string | null
  editor: string | null
  lastHeartbeat: string | null
}

// github types
export interface GitHubContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GitHubContributions {
  totalContributions: number
  weeks: GitHubContributionDay[][]
}

export interface GitHubStats {
  publicRepos: number
  followers: number
  following: number
  totalStars: number
}

// combined live status for navbar
export interface CodingStatus {
  isActive: boolean
  project: string | null
  language: string | null
  lastActivity: string | null
}
