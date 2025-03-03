import { useParams } from 'react-router-dom'
import { useSong } from '../hooks/useSongs'
import { useTracksBySong } from '../hooks/useTracks'
import { Button } from '../components/buttons/Button'
import { useState } from 'react'
import { formatSecondsToTime } from '../utils/timeUtils'
import { TrackList } from '../components/track/TrackList'
import { Panel } from '../components/overlays/Panel'
import { TrackForm } from '../components/track/TrackForm'
import { Track } from '../types/trackTypes'

export function SongStructurePage() {
  const { songId } = useParams()
  const { data: song, isLoading: songLoading, error: songError } = useSong(songId)
  const { data: tracks, isLoading: tracksLoading } = useTracksBySong(songId)
  const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false)
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null)

  const handleOpenTrackPanel = (track?: Track) => {
    setTrackToEdit(track || null)
    setIsTrackPanelOpen(true)
  }

  if (songLoading || tracksLoading) return <div>Loading...</div>
  if (songError) return <div>Error: {songError.message}</div>
  if (!song) return <div>Song not found</div>
  if (!songId) return <div>No song ID provided</div>

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
        <TrackList tracks={tracks} onEdit={handleOpenTrackPanel} />
      ) : (
        <p>No tracks yet</p>
      )}

      <Button 
        variant="inverted"
        className="w-fit"
        onClick={() => handleOpenTrackPanel()}>
        add track
      </Button>

      <Panel
        isOpen={isTrackPanelOpen}
        onClose={() => setIsTrackPanelOpen(false)}
        title={trackToEdit ? <>edit<br/>track</> : <>add<br/>track</>}
      >
        <TrackForm
          isOpen={isTrackPanelOpen}
          onClose={() => setIsTrackPanelOpen(false)}
          songId={songId}
          track={trackToEdit}
        />
      </Panel>
    </>
  )
}