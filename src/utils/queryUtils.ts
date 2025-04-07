/**
 * Options de base pour toutes les queries
 */
export const defaultQueryOptions = {
  staleTime: 30000, // Les données restent "fraîches" pendant 30s
  retry: 2, // Réessaie 2 fois en cas d'échec
  refetchOnWindowFocus: false, // Ne refetch pas quand la fenêtre reprend le focus
  cacheTime: 5 * 60 * 1000, // Garde en cache pendant 5 minutes
}
