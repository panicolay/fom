import { useQuery } from '@tanstack/react-query'
import { structureService } from '../services/structureService'
import { Structure } from '../types/structureTypes'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useStructures() {
  return useQuery<Structure[], Error>({
    queryKey: ['structures'],
    queryFn: async () => {
      try {
        const structures = await structureService.getAll()
        if (!structures) return []
        return structures
      } catch (error) {
        throw createErrorWithMessage(error, 'Failed to fetch structures')
      }
    },
    ...defaultQueryOptions
  })
}

export function useStructure(structureId: string | undefined) {
  return useQuery<Structure | undefined, Error>({
    queryKey: ['structures', structureId],
    queryFn: async () => {
      if (!structureId) return undefined
      
      try {
        const structure = await structureService.getById(structureId)
        if (!structure) throw new Error('Structure not found')
        return structure
      } catch (error) {
        throw createErrorWithMessage(error, 'Failed to fetch structure')
      }
    },
    ...defaultQueryOptions,
    enabled: !!structureId
  })
}