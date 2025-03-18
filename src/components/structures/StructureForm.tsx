import { useState, useEffect } from 'react'
import { TextField } from '../form/TextField'
import { TapTempo } from '../form/TapTempo'
import { useStructureMutation } from '../../hooks/useStructureMutation'
import { Structure, StructureFormInput } from '../../types/structureTypes'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { Button } from '../buttons/Button'
import { useNavigate } from 'react-router-dom'

type Props = {
  structure?: Structure | null
  isOpen: boolean
  onClose: () => void
}

// Définir les valeurs par défaut une seule fois
const DEFAULT_FORM_DATA: StructureFormInput = {
  title: '',
  artist: undefined,
  album: undefined,
  bpm: 120,
  length: '',
  time_signature: '4/4',
  key: undefined
}

export function StructureForm({ structure, isOpen, onClose }: Props) {
  const { createStructure, updateStructure, isLoading, error } = useStructureMutation()
  const navigate = useNavigate()
  
  // Utiliser la constante dans le useState
  const [formData, setFormData] = useState<StructureFormInput>(DEFAULT_FORM_DATA)

  // Dans le useEffect, ne gérer que les valeurs du song existant
  useEffect(() => {
    if (isOpen && structure) {
      setFormData({
        title: structure.title,
        artist: structure.artist,
        album: structure.album,
        bpm: structure.bpm,
        length: formatSecondsToTime(structure.length),
        time_signature: structure.time_signature,
        key: structure.key
      })
    } else if (isOpen && !structure) {
      setFormData(DEFAULT_FORM_DATA)
      const titleInput = document.getElementById('title')
      titleInput?.focus()
    }
  }, [isOpen, structure])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (structure) {
      updateStructure(
        { id: structure.id, data: formData },
        {
          onSuccess: () => {
            onClose()
          }
        }
      )
    } else {
      createStructure(
        formData,
        {
          onSuccess: (newStructure) => {
            onClose()
            navigate(`/structures/${newStructure.id}`)
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

        <Button 
          variant="panelDefault"
          className="h-21 w-full
            border-b border-base-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (structure ? 'updating...' : 'adding...') : (structure ? 'update' : 'confirm')}
        </Button>
    </form>
  )
}