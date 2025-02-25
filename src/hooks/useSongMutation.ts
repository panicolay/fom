import { useState } from 'react'
import { songService } from '../services/songService'
import { convertTimeToSeconds } from '../utils/timeUtils'

export function useSongMutation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSong = async (formData: {
    title: string
    artist: string
    album: string
    bpm: number | null
    length: string
    time_signature: string
    key: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const lengthInSeconds = formData.length ? convertTimeToSeconds(formData.length) : null
      if (formData.length && lengthInSeconds === null) {
        throw new Error('Format de durée invalide. Utilisez MM:SS (ex: 3:45)')
      }

      await songService.create({
        ...formData,
        length: lengthInSeconds
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { createSong, loading, error }
} 