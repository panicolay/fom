import { useMutation, useQueryClient } from '@tanstack/react-query'
import { songService } from '../services/songService'
import { convertTimeToSeconds } from '../utils/timeUtils'

type SongFormData = {
  title: string
  artist: string
  album: string
  bpm: number | null
  length: string
  time_signature: string
  key: string
}

export function useSongMutation() {
  const queryClient = useQueryClient()

  const processSongData = (formData: SongFormData) => {
    const lengthInSeconds = formData.length ? convertTimeToSeconds(formData.length) : null
    if (formData.length && lengthInSeconds === null) {
      throw new Error('Invalid duration format. Use MM:SS (ex: 3:03)')
    }

    return {
      ...formData,
      length: lengthInSeconds
    }
  }

  const createMutation = useMutation({
    mutationFn: (data: SongFormData) => songService.create(processSongData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to create song:', error)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SongFormData }) => 
      songService.update(id, processSongData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to update song:', error)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => songService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to delete song:', error)
    }
  })

  // Gestion de l'erreur pour avoir un message string
  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    return 'An unexpected error occurred'
  }

  return {
    createSong: createMutation.mutateAsync,
    updateSong: updateMutation.mutateAsync,
    deleteSong: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error 
      ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
      : null
  }
} 