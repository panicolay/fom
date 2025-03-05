import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track, TrackFormData } from '../types/trackTypes'
import { getErrorMessage } from '../utils/errorUtils'

// Type pour le contexte de la mutation de réordonnancement
type ReorderContext = {
    previousTracks: Track[]
}

export function useTrackMutation() {
    const queryClient = useQueryClient()

    const createMutation = useMutation<Track, Error, TrackFormData>({
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

    const updateMutation = useMutation<Track, Error, { id: string; data: TrackFormData }>({
        mutationFn: ({ id, data }: { id: string; data: TrackFormData }) => 
            trackService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] })
        },
        onError: (error) => {
            console.error('Failed to update track:', error)
        }
    })

    const deleteMutation = useMutation<void, Error, string>({
        mutationFn: (id: string) => trackService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] })
        },
        onError: (error) => {
            console.error('Failed to delete track:', error)
        }
    })

    const reorderMutation = useMutation<void, Error, Track[], ReorderContext>({
        mutationFn: (tracks: Track[]) => trackService.updatePositions(tracks),
        onMutate: async (newTracks) => {
            if (newTracks.length === 0) {
                return { previousTracks: [] }
            }
            
            await queryClient.cancelQueries({ 
                queryKey: ['tracks', 'by-song', newTracks[0].song_id] 
            })

            const previousTracks = queryClient.getQueryData<Track[]>(
                ['tracks', 'by-song', newTracks[0].song_id]
            ) || []

            queryClient.setQueryData(
                ['tracks', 'by-song', newTracks[0].song_id], 
                newTracks
            )

            return { previousTracks }
        },
        onError: (error, newTracks, context) => {
            if (newTracks.length === 0) return
            
            queryClient.setQueryData(
                ['tracks', 'by-song', newTracks[0].song_id], 
                context?.previousTracks
            )
            console.error('Failed to reorder tracks:', error)
        },
        onSettled: (_, __, newTracks) => {
            if (newTracks.length === 0) return
            
            queryClient.invalidateQueries({ 
                queryKey: ['tracks', 'by-song', newTracks[0].song_id] 
            })
        }
    })

    return {
        createTrack: createMutation.mutateAsync,
        updateTrack: updateMutation.mutateAsync,
        deleteTrack: deleteMutation.mutateAsync,
        reorderTracks: reorderMutation.mutateAsync,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
        error: createMutation.error || updateMutation.error || deleteMutation.error || reorderMutation.error 
            ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error || reorderMutation.error)
            : null
    }
}