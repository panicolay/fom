import { useQuery } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track } from '../types/trackTypes'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useTracksBySongId(songId: string | undefined) {
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