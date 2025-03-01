import { useQuery } from '@tanstack/react-query'
import { songService } from '../services/songService'
import { Song, UseSongsReturn } from '../types/song'

// Options de base pour toutes les queries de songs
const queryOptions = {
  staleTime: 30000,  // Les données restent "fraîches" pendant 30s
  retry: 2,          // Réessaie 2 fois en cas d'échec
  refetchOnWindowFocus: false,  // Ne refetch pas quand la fenêtre reprend le focus
  cacheTime: 5 * 60 * 1000,    // Garde en cache pendant 5 minutes
}

export function useSongs(): UseSongsReturn {
  return useQuery<Song[], Error>({
    queryKey: ['songs'],
    queryFn: async () => {
      try {
        const songs = await songService.getAll()
        if (!songs) return []
        return songs
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch songs')
      }
    },
    ...queryOptions
  })
}

export function useSong(songId: string | undefined) {
  return useQuery<Song | undefined, Error>({
    queryKey: ['songs', songId],
    queryFn: async () => {
      if (!songId) return undefined
      
      try {
        const song = await songService.getById(songId)
        if (!song) throw new Error('Song not found')
        return song
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch song')
      }
    },
    ...queryOptions,
    enabled: !!songId
  })
}