import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trackService } from '../services/trackService'
import { Track, TrackFormData } from '../types/trackTypes'

export function useTrackMutation() {
    const queryClient = useQueryClient()

    const createMutation = useMutation<Track, Error, TrackFormData>({
        mutationFn: async (data: TrackFormData) => {
            const maxPosition = await trackService.getMaxPosition(data.song_id)
            const dataWithPosition = {
                ...data,
                position: maxPosition + 1
            }
            return trackService.create(dataWithPosition)
        },
        onSuccess: (newTrack) => {
            queryClient.setQueryData(['tracks', 'by-song', newTrack.song_id], 
                (oldTracks: Track[] | undefined) => {
                    if (!oldTracks) return [newTrack];
                    return [...oldTracks, newTrack];
                }
            );
        },
        onError: (error) => {
            console.error('Failed to create track:', error)
        }
    })

    const updateMutation = useMutation<Track, Error, { id: string; data: TrackFormData }>({
        mutationFn: ({ id, data }) => trackService.update(id, data),
        onSuccess: (updatedTrack) => {
            // Mise à jour optimiste du cache
            queryClient.setQueryData(['tracks', updatedTrack.id], updatedTrack);
            queryClient.setQueryData(
                ['tracks', 'by-song', updatedTrack.song_id],
                (oldTracks: Track[] | undefined) => {
                    if (!oldTracks) return [updatedTrack];
                    return oldTracks.map(track => 
                        track.id === updatedTrack.id ? updatedTrack : track
                    );
                }
            );
        },
        onError: (error) => {
            console.error('Failed to update track:', error)
        }
    })

    const deleteMutation = useMutation<Track, Error, string>({
        mutationFn: (id: string) => trackService.delete(id),
        onSuccess: (deletedTrack) => {
            // Invalider le cache pour la liste des tracks de la chanson
            queryClient.invalidateQueries({ 
                queryKey: ['tracks', 'by-song', deletedTrack.song_id] 
            })
            // Supprimer la track du cache
            queryClient.removeQueries({ 
                queryKey: ['tracks', deletedTrack.id] 
            })
        },
        onError: (error) => {
            console.error('Failed to delete track:', error)
        }
    })

    const reorderMutation = useMutation<
        Track[],                                   // Type de retour
        Error,                                     // Type d'erreur
        Track[],                                   // Type des variables
        { previousTracks: Track[] | undefined }    // Type du contexte
    >({
        mutationFn: trackService.updatePositions,
        onMutate: async (newTracks) => {
            await queryClient.cancelQueries({ 
                queryKey: ['tracks', 'by-song', newTracks[0].song_id] 
            })

            const previousTracks = queryClient.getQueryData<Track[]>(
                ['tracks', 'by-song', newTracks[0].song_id]
            )

            queryClient.setQueryData(
                ['tracks', 'by-song', newTracks[0].song_id], 
                newTracks
            )

            return { previousTracks }
        },
        onError: (error, newTracks, context) => {
            if (context?.previousTracks) {
                queryClient.setQueryData(
                    ['tracks', 'by-song', newTracks[0].song_id], 
                    context.previousTracks
                )
            }
            console.error('Failed to reorder tracks:', error)
        },
        onSettled: (_, __, newTracks) => {
            queryClient.invalidateQueries({ 
                queryKey: ['tracks', 'by-song', newTracks[0].song_id] 
            })
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
        reorderTracks: reorderMutation.mutateAsync,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
        error: createMutation.error || updateMutation.error || deleteMutation.error || reorderMutation.error 
            ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error || reorderMutation.error)
            : null
    }
}