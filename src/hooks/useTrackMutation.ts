import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { TrackFormData } from '../types/trackTypes'

export function useTrackMutation() {
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: (data: TrackFormData) => 
            trackService.getMaxPosition(data.song_id)
                .then(maxPosition => trackService.create({
                    ...data,
                    position: maxPosition + 1
                })),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] })
        },
        onError: (error) => {
            console.error('Failed to create track:', error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TrackFormData }) => 
            trackService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] })
        },
        onError: (error) => {
            console.error('Failed to update track:', error)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => trackService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] })
        },
        onError: (error) => {
            console.error('Failed to delete track:', error)
        }
    })

    // Gestion de l'erreur pour avoir un message string
    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message
        return 'An unexpected error occurred'
    }

    return {
        createTrack: createMutation.mutateAsync,
        updateTrack: updateMutation.mutateAsync,
        deleteTrack: deleteMutation.mutateAsync,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        error: createMutation.error || updateMutation.error || deleteMutation.error 
            ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
            : null
    }
}