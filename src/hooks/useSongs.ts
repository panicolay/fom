import { useState, useEffect } from 'react'
import { songService } from '../services/songService'
import type { Song } from '../types/song'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSongs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await songService.getAll()
      setSongs(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  return { songs, loading, error, refresh: fetchSongs }
} 