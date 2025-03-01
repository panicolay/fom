import { useParams } from 'react-router-dom'
import { useSong } from '../hooks/useSongs'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { TextField } from '../components/form/TextField'
import { Button } from '../components/ui/Button'

export function SongStructurePage() {
  const { songId } = useParams()
  const { data: song, isLoading, error } = useSong(songId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <h1 className="font-display text-7xl font-semibold text-neutral-200">
        {song?.title}
      </h1>

      {/* song general info */}
      <ul className="flex gap-4 text-neutral-400">
        {song?.artist && (
          <li>
            {song.artist}
          </li>
        )}
        {song?.album && (
          <li>
            {song.album}
          </li>
        )}
        {song?.length && (
          <li>
            {song.length}
          </li>
        )}
        {song?.bpm && (
          <li>
            {song.bpm} bpm
          </li>
        )}
        {song?.time_signature && (
          <li>
            {song.time_signature}
          </li>
        )}
        {song?.key && (
          <li>
            {song.key}
          </li>
        )}
      </ul>

      <Popover>
        <PopoverButton className ="text-neutral-200">Add track</PopoverButton>
        <PopoverPanel className="bg-neutral-900 border-1 border-neutral-500 w-80">
          <div className="flex flex-col">
            <TextField
              variant="popover"
              label="name"
              id="track_name"
              // value={formData.name}
              // onChange={(value) => setFormData({ ...formData, name: value as string })}
              type="text"
              required={true}
            />
            <TextField
              variant="popover"
              label="comment"
              id="track_comment"
              // value={formData.comment}
              // onChange={(value) => setFormData({ ...formData, comment: value as string })}
              type="text"
              required={true}
            />
            <Button variant="secondary" className="w-fill">
              confirm
            </Button>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  )
}