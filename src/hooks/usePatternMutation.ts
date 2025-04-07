import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patternService } from '../services/patternService'
import { Pattern, PatternFormData } from '../types/patternTypes'
import { getErrorMessage } from '../utils/errorUtils'

export function usePatternMutation() {
  const queryClient = useQueryClient()

  const createMutation = useMutation<Pattern, Error, PatternFormData>({
    mutationFn: (data: PatternFormData) => patternService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] })
    },
    onError: (error) => {
      console.error('Failed to create pattern:', error)
    },
  })

  const updateMutation = useMutation<Pattern, Error, { id: string; data: PatternFormData }>({
    mutationFn: ({ id, data }: { id: string; data: PatternFormData }) =>
      patternService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] })
    },
    onError: (error) => {
      console.error('Failed to update pattern:', error)
    },
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => patternService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] })
    },
    onError: (error) => {
      console.error('Failed to delete pattern:', error)
    },
  })

  return {
    createPattern: createMutation.mutateAsync,
    updatePattern: updateMutation.mutateAsync,
    deletePattern: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error:
      createMutation.error || updateMutation.error || deleteMutation.error
        ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
        : null,
  }
}
