import { useState } from 'react'
import { songService } from '../services/songService'
import { convertTimeToSeconds } from '../utils/timeUtils'

type SongFormData = {
  title: string
  artist: string
  album: string
  bpm: number | null
  length: string
  time_signature: string
  key: string
}

export function useSongMutation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processSongData = (formData: SongFormData) => {
    const lengthInSeconds = formData.length ? convertTimeToSeconds(formData.length) : null
    if (formData.length && lengthInSeconds === null) {
      throw new Error('Invalid duration format. Use MM:SS (ex: 3:03)')
    }

    return {
      ...formData,
      length: lengthInSeconds
    }
  }

  const handleMutation = async <T>(mutation: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      await mutation()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const createSong = async (formData: SongFormData) => {
    await handleMutation(async () => {
      const processedData = processSongData(formData)
      await songService.create(processedData)
    })
  }

  const updateSong = async (id: string, formData: SongFormData) => {
    await handleMutation(async () => {
      const processedData = processSongData(formData)
      await songService.update(id, processedData)
    })
  }

  const deleteSong = async (id: string) => {
    await handleMutation(async () => {
      await songService.delete(id)
    })
  }

  return { createSong, updateSong, deleteSong, loading, error }
} 