export interface Pattern {
  id: string
  created_at: string
  track_id: string
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
  total_length: number
}

export interface PatternFormData {
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
  track_id: string
}

