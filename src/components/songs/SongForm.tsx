import { useState, useEffect } from 'react'
import { TextField } from '../form/TextField'
import { TapTempo } from '../form/TapTempo'
import { useSongMutation } from '../../hooks/useSongMutation'
import { Song, SongFormInput } from '../../types/songTypes'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { cn } from '../../utils/cn'
import { ButtonV2 } from '../buttons/ButtonV2'
import { useNavigate } from 'react-router-dom'

type Props = {
  song?: Song | null
  isOpen: boolean
  onClose: () => void
}

// Définir les valeurs par défaut une seule fois
const DEFAULT_FORM_DATA: SongFormInput = {
  title: '',
  artist: undefined,
  album: undefined,
  bpm: 120,
  length: '',
  time_signature: '4/4',
  key: undefined
}

export function SongForm({ song, isOpen, onClose }: Props) {
  const { createSong, updateSong, isLoading, error } = useSongMutation()
  const navigate = useNavigate()
  
  // Utiliser la constante dans le useState
  const [formData, setFormData] = useState<SongFormInput>(DEFAULT_FORM_DATA)

  // Dans le useEffect, ne gérer que les valeurs du song existant
  useEffect(() => {
    if (isOpen && song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        album: song.album,
        bpm: song.bpm,
        length: formatSecondsToTime(song.length),
        time_signature: song.time_signature,
        key: song.key
      })
    } else {
      // Si pas de song, on revient aux valeurs par défaut
      setFormData(DEFAULT_FORM_DATA)
      
      // focus if !song
      const titleInput = document.getElementById('title')
      titleInput?.focus()
    }
  }, [isOpen, song])

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
          onSuccess: (newSong) => {
            navigate(`/songs/${newSong.id}`)
          }
        }
      )
    }
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
        required={true}
      />
        
      <div className="flex divide-x divide-base-700">
        <TextField
          variant="panel"
          label="BPM"
          id="bpm"
          value={formData.bpm ?? ''}
          onChange={(value) => setFormData({ ...formData, bpm: value as number })}
          type="number"
          required={true}
          className="flex-1"
        />
        <TapTempo 
          onBpmChange={(value) => setFormData({ ...formData, bpm: value })} 
          className={"w-30 border-b border-base-700"} 
        />
      </div>
        
      {/* TODO: add a dropdown for the time signature with possible values coming from supabase */}
      <TextField
        variant="panel"
        label="Time signature"
        id="time_signature"
        value={formData.time_signature}
        onChange={(value) => setFormData({ ...formData, time_signature: value as string })}
        type="text"
        required={true}
      />

      {/* <TextField
        variant="panel"
        label="Key"
        id="key"
        value={formData.key}
        onChange={(value) => setFormData({ ...formData, key: value as string })}
        type="text"
        required={false}
      /> */}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

        <ButtonV2 
          className="h-21 w-full
            border-b border-base-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (song ? 'updating...' : 'adding...') : (song ? 'update' : 'confirm')}
        </ButtonV2>
    </form>
  )
}