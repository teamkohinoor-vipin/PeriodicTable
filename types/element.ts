export interface Element {
  name: string
  symbol: string
  number: number
  atomic_mass: number
  category: string
  phase: string
  electron_configuration?: string
  electron_configuration_semantic?: string
  discovered_by?: string
  summary?: string
  applications?: string[]
  image?: {
    url: string
    attribution?: string
  }
}

export interface Hazard {
  type: string
  label: string
  emoji: string
}

