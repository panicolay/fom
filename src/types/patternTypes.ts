export type Pattern = {
  id: string
  created_at: string
  track_id: string
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
}

export type PatternFormData = {
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
}