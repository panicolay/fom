import { useQuery } from '@tanstack/react-query'
import { songService } from '../services/songService'
import { Song, UseSongsReturn } from '../types/songTypes'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useSongs(): UseSongsReturn {
  return useQuery<Song[], Error>({
    queryKey: ['songs'],
    queryFn: async () => {
      try {
        const songs = await songService.getAll()
        if (!songs) return []
        return songs
      } catch (error) {
        throw createErrorWithMessage(error, 'Failed to fetch songs')
      }
    },
    ...defaultQueryOptions
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
        throw createErrorWithMessage(error, 'Failed to fetch song')
      }
    },
    ...defaultQueryOptions,
    enabled: !!songId
  })
}