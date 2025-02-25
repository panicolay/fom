import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { TextField } from '../form/TextField'
import { Button } from '../ui/Button'
import { TapTempo } from '../form/TapTempo'
import { useKeyboardShortcuts } from '../../contexts/KeyboardShortcutsContext'
import { useSongMutation } from '../../hooks/useSongMutation'

type Props = {
  onSongAdded: () => void
}

export function SongForm({ onSongAdded }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [bpm, setBpm] = useState<number | null>(null)
  const [length, setLength] = useState<string>('')
  const [time_signature, setTimeSignature] = useState('')
  const [key, setKey] = useState('')
  
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
  const { createSong, loading, error } = useSongMutation()

  useEffect(() => {
    registerShortcut('openSongForm', { key: 'n' }, () => setIsModalOpen(true))
    return () => unregisterShortcut('openSongForm')
  }, [registerShortcut, unregisterShortcut])

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        const titleInput = document.getElementById('title')
        titleInput?.focus()
      }, 0)
    }
  }, [isModalOpen])

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
    
    try {
      await createSong({
        title,
        artist,
        album,
        bpm,
        length,
        time_signature,
        key
      })
      
      resetForm()
      onSongAdded()
      setIsModalOpen(false)
    } catch {
      // L'erreur est déjà gérée dans le hook
    }
  }

  return (
    <>
      <Button 
        className="w-fit"
        onClick={() => setIsModalOpen(true)}
      >
        Add new song
      </Button>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">

          <Dialog.Panel className="flex flex-col bg-neutral-950 w-full max-w-md relative">
            
            <div className="p-6 border-b border-neutral-800">
              <Dialog.Title className="text-lg font-bold text-neutral-200">Add new song</Dialog.Title>
            </div>

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
                {loading ? 'Adding...' : 'Confirm'}
              </Button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 