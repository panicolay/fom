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
import { User, Disc3, Timer, Activity } from 'lucide-react'
import { useSongMutation } from '../hooks/useSongMutation'
import { useNavigate } from 'react-router-dom'

export function SongStructurePage() {
  const { songId } = useParams()
  const { data: song, isLoading: songLoading, error: songError } = useSong(songId)
  const { data: tracks, isLoading: tracksLoading } = useTracksBySong(songId)
  const { deleteSong } = useSongMutation()
  const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false)
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null)
  const navigate = useNavigate()

  const handleOpenTrackPanel = (track?: Track) => {
    setTrackToEdit(track || null)
    setIsTrackPanelOpen(true)
  }

  if (songLoading || tracksLoading) return <div>Loading...</div>
  if (songError) return <div>Error: {songError.message}</div>
  if (!song) return <div>Song not found</div>
  if (!songId) return <div>No song ID provided</div>

  const handleDeleteSong = async () => {
    try {
      await deleteSong(
        song.id, 
        {
          onSuccess: () => navigate('/')
        }
      )
    } catch (error) {
      console.error('Failed to delete song:', error)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="font-display uppercase text-6xl font-semibold text-neutral-200">
          {song.title}
        </h1>

        {/* song general info */}
        <ul className="flex text-neutral-400 gap-6">
          {song.artist && <li className="flex items-center gap-2"><User size={16} strokeWidth={1.75} className="text-neutral-500" /> {song.artist}</li>}
          {song.album && <li className="flex items-center gap-2"><Disc3 size={16} strokeWidth={1.75} className="text-neutral-500" /> {song.album}</li>}
          {song.length && <li className="flex items-center gap-2"><Timer size={16} strokeWidth={1.75} className="text-neutral-500" /> {formatSecondsToTime(Number(song.length))}</li>}
          {song.bpm && <li className="flex items-center gap-2"><Activity size={16} strokeWidth={1.75} className="text-neutral-500" /> {song.bpm} bpm</li>}
          {song.time_signature && <li>{song.time_signature}</li>}
          {song.key && <li>{song.key}</li>}
        </ul>

        <Button variant="inverted" className="w-fit" onClick={handleDeleteSong}>
          delete song
        </Button>
      </div>

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