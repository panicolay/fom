export type Track = {
    id: string
    name: string
    comment?: string
    created_at: string
    song_id: string
    position: number
}

export type TrackFormData = {
    name: string
    comment?: string
    song_id: string
    position: number
}

export type UseTracksReturn = {
    data: Track[] | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
}