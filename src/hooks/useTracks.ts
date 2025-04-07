import { useQuery } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track } from '../types/trackTypes'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useTracksByStructureId(structureId: string | undefined) {
  return useQuery<Track[], Error>({
    queryKey: ['tracks', 'by-structure', structureId],
    queryFn: async () => {
      if (!structureId) return []

      try {
        const tracks = await trackService.getTracksByStructureId(structureId)
        if (!tracks) return []
        return tracks
      } catch (error) {
        throw createErrorWithMessage(error, 'Failed to fetch tracks for structure')
      }
    },
    ...defaultQueryOptions,
    enabled: !!structureId,
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
    enabled: !!trackId,
  })
}
