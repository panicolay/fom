import { useQuery } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track, UseTracksReturn } from '../types/trackTypes'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useTracks(): UseTracksReturn {
  return useQuery<Track[], Error>({
    queryKey: ['tracks'],
    queryFn: async () => {
      try {
        const tracks = await trackService.getAll()
        if (!tracks) return []
        return tracks
      } catch (error) {
        throw createErrorWithMessage(error, 'Failed to fetch tracks')
      }
    },
    ...defaultQueryOptions
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
        throw createErrorWithMessage(error, 'Failed to fetch track')
      }
    },
    ...defaultQueryOptions,
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
        throw createErrorWithMessage(error, 'Failed to fetch tracks for song')
      }
    },
    ...defaultQueryOptions,
    enabled: !!songId
  })
}
