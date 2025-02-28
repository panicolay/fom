import { useState, useEffect } from 'react'
import { TextField } from '../form/TextField'
import { Button } from '../ui/Button'
import { TapTempo } from '../form/TapTempo'
import { useSongMutation } from '../../hooks/useSongMutation'
import { Song } from '../../types/song'
import { formatSecondsToTime } from '../../utils/timeUtils'

type Props = {
  song?: Song | null
  onSuccess: () => void
}

export function SongForm({ song, onSuccess }: Props) {
  const [title, setTitle] = useState(song?.title || '')
  const [artist, setArtist] = useState(song?.artist || '')
  const [album, setAlbum] = useState(song?.album || '')
  const [bpm, setBpm] = useState<number | null>(song?.bpm || null)
  const [length, setLength] = useState(song?.length ? formatSecondsToTime(Number(song.length)) : '')
  const [time_signature, setTimeSignature] = useState(song?.time_signature || '')
  const [key, setKey] = useState(song?.key || '')
  const { createSong, updateSong, loading, error } = useSongMutation()

  useEffect(() => {
    const titleInput = document.getElementById('title')
    titleInput?.focus()
  }, [])

  const resetForm = () => {
    setTitle('')
    setArtist('')
    setAlbum('')
    setBpm(null)
    setLength('')
    setTimeSignature('')
    setKey('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = {
      title,
      artist,
      album,
      bpm,
      length,
      time_signature,
      key
    }

    try {
      if (song) {
        await updateSong(song.id, formData)
      } else {
        await createSong(formData)
      }
      
      if (!song) resetForm()
      onSuccess()
    } catch {
      // L'erreur est déjà gérée dans le hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-6">
      <TextField
          label="Title"
          id="title"
          value={title}
          onChange={(value) => setTitle(value as string)}
          type="text"
          required={true}
      />

      <div className="flex flex-col gap-3">
        <TextField
          label="Artist"
          id="artist"
          value={artist}
          onChange={(value) => setArtist(value as string)}
          type="text"
          required={true}
        />
        
        <TextField
          label="Album"
          id="album"
          value={album}
          onChange={(value) => setAlbum(value as string)}
          type="text"
          required={false}
        />
      </div>

      <div className="flex flex-col gap-3">
        <TextField
          label="Length"
          id="length"
          placeholder="3:03"
          value={length}
          onChange={(value) => setLength(value as string)}
          type="text"
          required={false}
        />
        
        <div className="flex items-center gap-2">
          <TextField
            label="BPM"
            id="bpm"
            value={bpm === null ? '' : bpm}
            onChange={(value) => setBpm(value === '' ? null : Number(value))}
            type="number"
            required={false}
          />
          <TapTempo onBpmChange={setBpm} />
        </div>
        
        <TextField
          label="Time signature"
          id="time_signature"
          value={time_signature}
          onChange={(value) => setTimeSignature(value as string)}
          type="text"
          required={false}
        />

        <TextField
          label="Key"
          id="key"
          value={key}
          onChange={(value) => setKey(value as string)}
          type="text"
          required={false}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? (song ? 'Updating...' : 'Adding...') : (song ? 'Update' : 'Confirm')}
      </Button>
    </form>
  )
} 