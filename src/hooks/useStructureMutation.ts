import { useMutation, useQueryClient } from '@tanstack/react-query'
import { structureService } from '../services/structureService'
import { convertTimeToSeconds } from '../utils/timeUtils'
import { StructureFormInput, StructureFormData } from '../types/structureTypes'
import { Structure } from '../types/structureTypes'
import { getErrorMessage } from '../utils/errorUtils'

export function useStructureMutation() {
  const queryClient = useQueryClient()

  const processStructureData = (formData: StructureFormInput): StructureFormData => {
    const lengthInSeconds = convertTimeToSeconds(formData.length)
    if (lengthInSeconds === null) {
      throw new Error('Invalid duration format. Use MM:SS (ex: 3:03)')
    }

    const { length, ...rest } = formData
    return {
      ...rest,
      length: lengthInSeconds,
    }
  }

  const createMutation = useMutation<Structure, Error, StructureFormInput>({
    mutationFn: (data: StructureFormInput) => structureService.create(processStructureData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] })
    },
    onError: (error) => {
      console.error('Failed to create structure:', error)
    },
  })

  const updateMutation = useMutation<Structure, Error, { id: string; data: StructureFormInput }>({
    mutationFn: ({ id, data }: { id: string; data: StructureFormInput }) =>
      structureService.update(id, processStructureData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] })
    },
    onError: (error) => {
      console.error('Failed to update structure:', error)
    },
  })

  // Note: Structure deletion is followed by a redirection.
  // This can generate an error in the console related to query invalidation after navigation.
  // This error does not affect the application's functionality.
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => structureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] })
    },
    onError: (error) => {
      console.error('Failed to delete structure:', error)
    },
  })

  return {
    createStructure: createMutation.mutateAsync,
    updateStructure: updateMutation.mutateAsync,
    deleteStructure: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error:
      createMutation.error || updateMutation.error || deleteMutation.error
        ? getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
        : null,
  }
}
