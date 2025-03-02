import { useParams } from 'react-router-dom'
import { useSong } from '../hooks/useSongs'
import { useTracksBySong } from '../hooks/useTracks'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { TextField } from '../components/form/TextField'
import { Button } from '../components/ui/Button'
import { TrackFormData } from '../types/trackTypes'
import { useEffect, useState } from 'react'
import { useTrackMutation } from '../hooks/useTrackMutation'
import { formatSecondsToTime } from '../utils/timeUtils'
import { TrackList } from '../components/track/TrackList'

type Props = {
  onSuccess?: () => void
}

export function SongStructurePage({ onSuccess }: Props) {
  const { songId } = useParams()
  const { data: song, isLoading: songLoading, error: songError } = useSong(songId)
  const { data: tracks, isLoading: tracksLoading } = useTracksBySong(songId)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const [formData, setFormData] = useState<TrackFormData>({
    name: '',
    comment: '',
    song_id: songId || '',
    position: 0
  })

  const { createTrack, isLoading: trackLoading, error: trackError } = useTrackMutation()

  useEffect(() => {
    if (isPopoverOpen) {
      const nameInput = document.getElementById('track_name')
      nameInput?.focus()
    }
  }, [isPopoverOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      comment: '',
      song_id: songId || '',
      position: 0
    })
    setIsPopoverOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!songId) return

    try {
      await createTrack(formData)
      resetForm()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create track:', error)
    }
  }

  if (songLoading || tracksLoading) return <div>Loading...</div>
  if (songError) return <div>Error: {songError.message}</div>
  if (!song) return <div>Song not found</div>

  return (
    <>
      <h1 className="font-display text-7xl font-semibold text-neutral-200">
        {song.title}
      </h1>

      {/* song general info */}
      <ul className="flex flex-col text-neutral-400">
        {song.artist && <li>{song.artist}</li>}
        {song.album && <li>{song.album}</li>}
        {song.length && <li>{formatSecondsToTime(Number(song.length))}</li>}
        {song.bpm && <li>{song.bpm} bpm</li>}
        {song.time_signature && <li>{song.time_signature}</li>}
        {song.key && <li>{song.key}</li>}
      </ul>

      {/* Tracks list */}
      {tracks && tracks.length > 0 ? (
        <TrackList tracks={tracks} />
      ) : (
        <p>No tracks yet</p>
      )}

      <Popover>
        {({ open }) => {
          useEffect(() => setIsPopoverOpen(open), [open])
          return (
            <>
              <PopoverButton className="text-neutral-200">Add track</PopoverButton>
              <PopoverPanel className="bg-neutral-900 border-1 border-neutral-500 w-80">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <TextField
                    variant="popover"
                    label="track name"
                    id="track_name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value as string })}
                    type="text"
                    required={true}
                  />
                  <TextField
                    variant="popover"
                    label="comment"
                    id="track_comment"
                    value={formData.comment || ''}
                    onChange={(value) => setFormData({ ...formData, comment: value as string })}
                    type="text"
                    required={false}
                  />
                  {trackError && (
                    <div className="text-red-600 text-sm">{trackError}</div>
                  )}
                  <Button 
                    type="submit"
                    variant="secondary"
                    disabled={trackLoading}
                    className="w-fill">
                    {trackLoading ? 'adding...' : 'confirm'}
                  </Button>
                </form>
              </PopoverPanel>
            </>
          )
        }}
      </Popover>
    </>
  )
}