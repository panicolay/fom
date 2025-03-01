export type Song = {
  id: string
  title: string
  created_at: string
  artist?: string
  album?: string
  bpm?: number | null
  length?: number | null
  time_signature?: string
  key?: string
}

export type SongFormData = {
  title: string
  artist?: string
  album?: string
  bpm?: number | null
  length?: number | null
  time_signature?: string
  key?: string
}

export type UseSongsReturn = {
  data: Song[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
} 