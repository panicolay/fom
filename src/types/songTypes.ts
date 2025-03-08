export type Song = {
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

export type SongFormInput = {
  title: string
  artist?: string
  album?: string
  bpm: number
  length: string
  time_signature: string
  key?: string
}

export type SongFormData = {
  title: string
  artist?: string
  album?: string
  bpm: number
  length: number
  time_signature: string
  key?: string
}

export type UseSongsReturn = {
  data: Song[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}