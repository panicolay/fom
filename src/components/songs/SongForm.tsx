import { useState, useEffect } from 'react'
import { TextField } from '../form/TextField'
import { Button } from '../ui/Button'
import { TapTempo } from '../form/TapTempo'
import { useSongMutation } from '../../hooks/useSongMutation'
import { Song } from '../../types/song'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { cn } from '../../utils/cn'

type Props = {
  song?: Song | null
  onSuccess: () => void
}

export function SongForm({ song, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    album: song?.album || '',
    bpm: song?.bpm || null,
    length: song?.length ? formatSecondsToTime(Number(song.length)) : '',
    time_signature: song?.time_signature || '',
    key: song?.key || ''
  })
  
  const { createSong, updateSong, isLoading, error } = useSongMutation()

  useEffect(() => {
    const titleInput = document.getElementById('title')
    titleInput?.focus()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      bpm: null,
      length: '',
      time_signature: '',
      key: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (song) {
      updateSong(
        { id: song.id, data: formData },
        {
          onSuccess: () => {
            onSuccess()
          }
        }
      )
    } else {
      createSong(
        formData,
        {
          onSuccess: () => {
            resetForm()
            onSuccess()
          }
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="">
      <TextField
          label="Title"
          id="title"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value as string })}
          type="text"
          required={true}
      />

        <TextField
          label="Artist"
          id="artist"
          value={formData.artist}
          onChange={(value) => setFormData({ ...formData, artist: value as string })}
          type="text"
          required={true}
        />
        
        <TextField
          label="Album"
          id="album"
          value={formData.album}
          onChange={(value) => setFormData({ ...formData, album: value as string })}
          type="text"
          required={false}
        />

        <TextField
          label="Length"
          id="length"
          placeholder="3:03"
          value={formData.length}
          onChange={(value) => setFormData({ ...formData, length: value as string })}
          type="text"
          required={false}
        />
        
        <div className="flex">
          <TextField
            label="BPM"
            id="bpm"
            value={formData.bpm === null ? '' : formData.bpm}
            onChange={(value) => setFormData({ ...formData, bpm: value === '' ? null : Number(value) })}
            type="number"
            required={false}
            className="flex-1"
          />
          <TapTempo onBpmChange={(value) => setFormData({ ...formData, bpm: value })} className={cn("h-22 w-30 border-l border-b border-neutral-500 focus:z-10")} />
        </div>
        
        <TextField
          label="Time signature"
          id="time_signature"
          value={formData.time_signature}
          onChange={(value) => setFormData({ ...formData, time_signature: value as string })}
          type="text"
          required={false}
        />

        <TextField
          label="Key"
          id="key"
          value={formData.key}
          onChange={(value) => setFormData({ ...formData, key: value as string })}
          type="text"
          required={false}
        />

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-22"
      >
        {isLoading ? (song ? 'Updating...' : 'Adding...') : (song ? 'Update' : 'Confirm')}
      </Button>
    </form>
  )
} 