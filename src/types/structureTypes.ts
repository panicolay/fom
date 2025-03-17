export type Structure = {
  id: string
  title: string
  created_at: string
  artist?: string
  album?: string
  bpm: number
  length: number
  time_signature: string
  key?: string
}

export type StructureFormInput = {
  title: string
  artist?: string
  album?: string
  bpm: number
  length: string
  time_signature: string
  key?: string
}

export type StructureFormData = {
  title: string
  artist?: string
  album?: string
  bpm: number
  length: number
  time_signature: string
  key?: string
}