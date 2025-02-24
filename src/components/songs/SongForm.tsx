import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { supabase } from '../../lib/supabase'
import { TextField } from '../form/TextField'
import { Button } from '../ui/Button'
import { TapTempo } from '../form/TapTempo'
import { convertTimeToSeconds, formatTimeInput } from '../../utils/timeUtils'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const lengthInSeconds = convertTimeToSeconds(length);
    if (length && lengthInSeconds === null) {
      setError('Format de durée invalide. Utilisez MM:SS (ex: 3:45)');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('songs')
        .insert([{ 
          title, 
          artist, 
          album, 
          bpm: bpm || null, 
          length: lengthInSeconds, 
          time_signature, 
          key 
        }])

      if (error) throw error

      // Reset the form
      setTitle('')
      setArtist('')
      setAlbum('')
      setBpm(null)
      setLength('')
      setTimeSignature('')
      setKey('')
      onSongAdded()
      setIsModalOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
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
            
            {/* <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              ✕
            </button> */}

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
                  value={length}
                  onChange={(value) => {
                    const formatted = formatTimeInput(value as string);
                    if (formatted.length <= 5) {
                      setLength(formatted);
                    }
                  }}
                  type="text"
                  required={false}
                  placeholder="3:03"
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