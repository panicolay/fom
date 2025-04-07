export const convertTimeToSeconds = (timeString: string): number | null => {
  if (!timeString) return null

  const parts = timeString.split(':')
  if (parts.length !== 2) return null

  const minutes = parseInt(parts[0], 10)
  const seconds = parseInt(parts[1], 10)

  if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return null

  return minutes * 60 + seconds
}

export const formatTimeInput = (value: string): string => {
  return value.replace(/[^\d:]/g, '')
}

export const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
