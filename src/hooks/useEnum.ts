import { useQuery } from '@tanstack/react-query'
import { enumService } from '../services/enumService'
import { createErrorWithMessage } from '../utils/errorUtils'
import { defaultQueryOptions } from '../utils/queryUtils'

export function useEnum(enumName: string) {
  return useQuery<string[], Error>({
    queryKey: ['enums', enumName],
    queryFn: async () => {
      try {
        const values = await enumService.getEnumValues(enumName)
        return values
      } catch (error) {
        throw createErrorWithMessage(error, `Failed to fetch enum values for ${enumName}`)
      }
    },
    ...defaultQueryOptions,
  })
} 