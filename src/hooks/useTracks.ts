import { useQuery } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track, UseTracksReturn } from '../types/trackTypes'

// Options de base pour toutes les queries de tracks
const queryOptions = {
  staleTime: 30000,  // Les données restent "fraîches" pendant 30s
  retry: 2,          // Réessaie 2 fois en cas d'échec
  refetchOnWindowFocus: false,  // Ne refetch pas quand la fenêtre reprend le focus
  cacheTime: 5 * 60 * 1000,    // Garde en cache pendant 5 minutes
}

export function useTracks(): UseTracksReturn {
  return useQuery<Track[], Error>({
    queryKey: ['tracks'],
    queryFn: async () => {
      try {
        const tracks = await trackService.getAll()
        if (!tracks) return []
        return tracks
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch tracks')
      }
    },
    ...queryOptions
  })
}

export function useTrack(trackId: string | undefined) {
  return useQuery<Track | undefined, Error>({
    queryKey: ['tracks', trackId],
    queryFn: async () => {
      if (!trackId) return undefined
      
      try {
        const track = await trackService.getById(trackId)
        if (!track) throw new Error('Track not found')
        return track
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch track')
      }
    },
    ...queryOptions,
    enabled: !!trackId
  })
}

// Hook spécifique pour récupérer les tracks d'une chanson
export function useTracksBySong(songId: string | undefined) {
  return useQuery<Track[], Error>({
    queryKey: ['tracks', 'by-song', songId],
    queryFn: async () => {
      if (!songId) return []
      
      try {
        const tracks = await trackService.getTracksBySongId(songId)
        if (!tracks) return []
        return tracks
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch tracks for song')
      }
    },
    ...queryOptions,
    enabled: !!songId
  })
}
