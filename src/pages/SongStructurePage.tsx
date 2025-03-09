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
import { Song } from '../types/songTypes'
import { SongForm } from '../components/songs/SongForm'
import { Pencil, Trash } from 'lucide-react'
import { useSongBars } from '../hooks/useSongBars'
import { Panel2 } from '../components/overlays/Panel2'
import { PatternForm } from '../components/pattern/PatternForm'

export function SongStructurePage() {
  const { songId } = useParams()
  const { data: song, isLoading: songLoading, error: songError } = useSong(songId)
  const { data: tracks, isLoading: tracksLoading } = useTracksBySong(songId)
  const { deleteSong } = useSongMutation()
  const [isSongPanelOpen, setIsSongPanelOpen] = useState(false)
  const [songToEdit, setSongToEdit] = useState<Song | null>(null)
  const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false)
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null)
  const [isPatternPanelOpen, setIsPatternPanelOpen] = useState(false)
  // const [selectedPattern, setSelectedPattern] = useState<{ trackId: string, barIndex: number } | null>(null)
  const navigate = useNavigate()
  const totalBars = useSongBars(song)

  const handleOpenTrackPanel = (track?: Track) => {
    setTrackToEdit(track || null)
    setIsTrackPanelOpen(true)
  }

  const handleOpenSongPanel = (songData?: Song) => {
    setSongToEdit(songData || null)
    setIsSongPanelOpen(true)
  }

  const handleDeleteSong = async () => {
    if (!song) return;
    
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

  const handlePatternClick = () => {
    // setSelectedPattern({ trackId, barIndex })
    setIsPatternPanelOpen(true)
  }

  if (songLoading || tracksLoading) return <div>Loading...</div>
  if (songError) return <div>Error: {songError.message}</div>
  if (!song) return <div>Song not found</div>
  if (!songId) return <div>No song ID provided</div>

  return (
    <>
      <div className="flex justify-between">
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
        </div>

        <div className="flex gap-2">
          <Button variant="inverted" size="medium" icon={Pencil} ariaLabel="edit song" onClick={() => handleOpenSongPanel(song)} />
          <Button variant="inverted" size="medium" icon={Trash} ariaLabel="delete song" onClick={handleDeleteSong} />
        </div>
      </div>

      {/* Tracks list */}
      {tracks && tracks.length > 0 ? (
        <TrackList 
          tracks={tracks} 
          totalBars={totalBars}
          onPatternClick={handlePatternClick}
          onEdit={handleOpenTrackPanel}
        />
      ) : (
        <p className="text-neutral-400">No tracks yet</p>
      )}

      <Button 
        variant="inverted"
        className="w-fit"
        onClick={() => handleOpenTrackPanel()}>
        add track
      </Button>

      {/* Panel pour les tracks */}
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

      {/* Panel pour l'édition de chanson */}
      <Panel
        isOpen={isSongPanelOpen}
        onClose={() => setIsSongPanelOpen(false)}
        title={<>edit<br/>song</>}
      >
        <SongForm
          isOpen={isSongPanelOpen}
          onClose={() => setIsSongPanelOpen(false)}
          song={songToEdit}
        />
      </Panel>

      {/* Panel pour les patterns */}
      <Panel2
        isOpen={isPatternPanelOpen}
        onClose={() => setIsPatternPanelOpen(false)}
      >
        <PatternForm
          isOpen={isPatternPanelOpen}
          onClose={() => setIsPatternPanelOpen(false)}
          // trackId={selectedPattern?.trackId}
          // barIndex={selectedPattern?.barIndex}
        />
      </Panel2>
    </>
  )
}