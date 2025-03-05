/**
 * Convertit une erreur inconnue en message d'erreur lisible
 * @param error L'erreur à convertir
 * @param defaultMessage Message par défaut si l'erreur n'est pas une instance d'Error
 * @returns Un message d'erreur lisible
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'Une erreur inattendue est survenue'): string => {
  if (error instanceof Error) return error.message
  return defaultMessage
}

/**
 * Crée une nouvelle erreur avec un message personnalisé à partir d'une erreur existante
 * @param error L'erreur d'origine
 * @param customMessage Message personnalisé à utiliser
 * @returns Une nouvelle instance d'Error
 */
export const createErrorWithMessage = (error: unknown, customMessage: string): Error => {
  const message = error instanceof Error ? `${customMessage}: ${error.message}` : customMessage
  return new Error(message)
} 