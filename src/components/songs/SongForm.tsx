import { useState } from 'react'
import { supabase } from '../../lib/supabase'

type Props = {
  onSongAdded?: () => void
}

export function SongForm({ onSongAdded }: Props) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [release, setRelease] = useState('')
  const [bpm, setBpm] = useState(0)
  const [time_signature, setTimeSignature] = useState('')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('songs')
        .insert([{ title, artist, release, bpm, time_signature, key }])

      if (error) throw error

      // Reset the form
      setTitle('')
      setArtist('')
      setRelease('')
      setBpm(0)
      setTimeSignature('')
      setKey('')
      onSongAdded?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="title" className="">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=""
          required
        />
      </div>

      <div>
        <label htmlFor="artist" className="">
          Artist
        </label>
        <input
          type="text"
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className=""
          required
        />
      </div>

      <div>
        <label htmlFor="release" className="">
          Release
        </label>
        <input
          type="text"
          id="release"
          value={release}
          onChange={(e) => setRelease(e.target.value)}
          className=""
        />
      </div>

      <div>
        <label htmlFor="bpm" className="">
          BPM
        </label>
        <input
          type="number"
          id="bpm"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className=""
        />
      </div>

      <div>
        <label htmlFor="time_signature" className="">
          Time signature
        </label>
        <input
          type="text"
          id="time_signature"
          value={time_signature}
          onChange={(e) => setTimeSignature(e.target.value)}
          className=""
        />
      </div>

      <div>
        <label htmlFor="key" className="">
          Key
        </label>
        <input
          type="text"
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className=""
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className=""
      >
        {loading ? 'Adding...' : 'Add song'}
      </button>
    </form>
  )
} 