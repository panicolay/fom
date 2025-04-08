export type Track = {
  id: string
  name: string
  comment?: string
  created_at: string
  structure_id: string
  position: number
}

export type TrackFormData = {
  name: string
  comment?: string
  structure_id: string
  position: number
}
