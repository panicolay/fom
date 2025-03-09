import { useQuery } from "@tanstack/react-query";
import { patternService } from "../services/patternService";
import { Pattern } from "../types/patternTypes";
import { createErrorWithMessage } from "../utils/errorUtils";
import { defaultQueryOptions } from "../utils/queryUtils";

export function usePatternsByTrackId(trackId: string | undefined) {
    return useQuery<Pattern[], Error>({
        queryKey: ['patterns', 'by-track', trackId],
        queryFn: async () => {
            if (!trackId) return []

            try {
                const patterns = await patternService.getPatternsByTrackId(trackId)
                if (!patterns) return []
                return patterns
            } catch (error) {
                throw createErrorWithMessage(error, 'Failed to fetch patterns for track')
            }
        },
        ...defaultQueryOptions,
        enabled: !!trackId
    })
}

export function usePattern(patternId: string | undefined) {
    return useQuery<Pattern | undefined, Error>({
        queryKey: ['patterns', patternId],
        queryFn: async () => {
            if (!patternId) return undefined

            try {
                const pattern = await patternService.getById(patternId)
                if (!pattern) throw new Error('Pattern not found')
                return pattern
            } catch (error) {
                throw createErrorWithMessage(error, 'Failed to fetch pattern')
            }
        },
        ...defaultQueryOptions,
        enabled: !!patternId
    })
}