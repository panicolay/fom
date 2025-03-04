import { useMutation, useQueryClient } from '@tanstack/react-query'
import { songService } from '../services/songService'
import { convertTimeToSeconds } from '../utils/timeUtils'
import { SongFormInput, SongFormData } from '../types/songTypes'
import { Song } from '../types/songTypes'

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
    onSuccess: (newSong) => {
      queryClient.setQueryData(['songs'], (oldSongs: Song[] | undefined) => {
        if (!oldSongs) return [newSong];
        return [newSong, ...oldSongs];
      });
    },
    onError: (error) => {
      console.error('Failed to create song:', error)
    }
  })

  const updateMutation = useMutation<Song, Error, { id: string; data: SongFormInput }>({
    mutationFn: ({ id, data }) => songService.update(id, processSongData(data)),
    onSuccess: (updatedSong) => {
      queryClient.setQueryData(['songs', updatedSong.id], updatedSong);
      queryClient.setQueryData(['songs'], (oldSongs: Song[] | undefined) => {
        if (!oldSongs) return [updatedSong];
        return oldSongs.map(song => 
          song.id === updatedSong.id ? updatedSong : song
        );
      });
    },
    onError: (error) => {
      console.error('Failed to update song:', error)
    }
  })

  const deleteMutation = useMutation<Song, Error, { id: string, onSuccess?: () => void }>({
    mutationFn: ({ id }) => songService.delete(id),
    onSuccess: async (deletedSong, { onSuccess }) => {
      // Exécuter d'abord le callback (navigation) si présent
      if (onSuccess) {
        onSuccess()
      }
      
      // Nettoyer le cache après la navigation
      queryClient.removeQueries({ queryKey: ['songs', deletedSong.id] })
      await queryClient.invalidateQueries({ queryKey: ['songs'] })
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
    deleteSong: (id: string, onSuccess?: () => void) => deleteMutation.mutateAsync({ id, onSuccess }),
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error 
      ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
      : null
  }
} 