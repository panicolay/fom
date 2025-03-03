import { useState, useEffect } from 'react'
import { TextField } from '../form/TextField'
import { TapTempo } from '../form/TapTempo'
import { useSongMutation } from '../../hooks/useSongMutation'
import { Song, SongFormInput } from '../../types/songTypes'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { cn } from '../../utils/cn'
import { PanelButton } from '../buttons/PanelButton'

type Props = {
  song?: Song | null
  isOpen: boolean
  onClose: () => void
}

export function SongForm({ song, isOpen, onClose }: Props) {
  
  const [formData, setFormData] = useState<SongFormInput>({
    title: '',
    artist: undefined,
    album: undefined,
    bpm: undefined,
    length: '',
    time_signature: undefined,
    key: undefined
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: song?.title || '',
        artist: song?.artist || undefined,
        album: song?.album || undefined,
        bpm: song?.bpm || undefined,
        length: song?.length ? formatSecondsToTime(song.length) : '',
        time_signature: song?.time_signature || undefined,
        key: song?.key || undefined
      })
    }
  }, [isOpen, song])
  const { createSong, updateSong, deleteSong, isLoading, error } = useSongMutation()

  useEffect(() => {
    const titleInput = document.getElementById('title')
    titleInput?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (song) {
      updateSong(
        { id: song.id, data: formData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    } else {
      createSong(
        formData,
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    }
  }

  const handleDelete = () => {
    if (!song?.id) return;
    
    deleteSong(song.id, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        variant="panel"
        label="Title"
        id="title"
        value={formData.title}
        onChange={(value) => setFormData({ ...formData, title: value as string })}
        type="text"
        required={true}
      />

      <TextField
        variant="panel"
        label="Artist"
        id="artist"
        value={formData.artist}
        onChange={(value) => setFormData({ ...formData, artist: value as string })}
        type="text"
        required={false}
      />
        
      <TextField
        variant="panel"
        label="Album"
        id="album"
        value={formData.album}
        onChange={(value) => setFormData({ ...formData, album: value as string })}
        type="text"
        required={false}
      />

      <TextField
        variant="panel"
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
          variant="panel"
          label="BPM"
          id="bpm"
          value={formData.bpm ?? ''}
          onChange={(value) => setFormData({ ...formData, bpm: value === '' ? undefined : Number(value) })}
          type="number"
          required={false}
          className="flex-1"
        />
        <TapTempo onBpmChange={(value) => setFormData({ ...formData, bpm: value })} className={cn("h-22 w-30 border-l border-b border-neutral-500 focus:z-10")} />
      </div>
        
      <TextField
        variant="panel"
        label="Time signature"
        id="time_signature"
        value={formData.time_signature}
        onChange={(value) => setFormData({ ...formData, time_signature: value as string })}
        type="text"
        required={false}
      />

      <TextField
        variant="panel"
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

      <div className="flex divide-x divide-neutral-500 border-b border-neutral-500">
        <PanelButton 
          label={isLoading ? (song ? 'updating...' : 'adding...') : (song ? 'update' : 'confirm')}
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        />
        {song && (
          <PanelButton 
            label="delete"
            variant="secondary"
            className="flex-1"
            onClick={handleDelete}
          />
        )}
      </div>
    </form>
  )
} 