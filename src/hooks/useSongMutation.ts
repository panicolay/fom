import { useMutation, useQueryClient } from '@tanstack/react-query'
import { songService } from '../services/songService'
import { convertTimeToSeconds } from '../utils/timeUtils'
import { SongFormInput, SongFormData } from '../types/songTypes'
import { Song } from '../types/songTypes'
import { getErrorMessage } from '../utils/errorUtils'

export function useSongMutation() {
  const queryClient = useQueryClient()

  const processSongData = (formData: SongFormInput): Omit<SongFormData, 'id'> => {
    const lengthInSeconds = formData.length ? convertTimeToSeconds(formData.length) : undefined
    if (formData.length && lengthInSeconds === null) {
      throw new Error('Invalid duration format. Use MM:SS (ex: 3:03)')
    }

    const { length, ...rest } = formData
    return {
      ...rest,
      length: lengthInSeconds ?? undefined
    }
  }

  const createMutation = useMutation<Song, Error, SongFormInput>({
    mutationFn: (data: SongFormInput) => songService.create(processSongData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to create song:', error)
    }
  })

  const updateMutation = useMutation<Song, Error, { id: string; data: SongFormInput }>({
    mutationFn: ({ id, data }: { id: string; data: SongFormInput }) => 
      songService.update(id, processSongData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to update song:', error)
    }
  })

  // Note: La suppression d'une chanson suivie d'une redirection peut générer une erreur
  // dans la console liée à l'invalidation des requêtes après navigation.
  // Cette erreur n'affecte pas le fonctionnement de l'application.
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => songService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
    onError: (error) => {
      console.error('Failed to delete song:', error)
    }
  })

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