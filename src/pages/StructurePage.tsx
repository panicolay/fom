import { useParams } from 'react-router-dom'
import { useTracksByStructureId } from '../hooks/useTracks'
import { Button } from '../components/buttons/Button'
import { useState } from 'react'
import { formatSecondsToTime } from '../utils/timeUtils'
import { TrackList } from '../components/track/TrackList'
import { TrackForm } from '../components/track/TrackForm'
import { Track } from '../types/trackTypes'
import { User, Disc3, Timer, Activity } from 'lucide-react'
import { useStructureMutation } from '../hooks/useStructureMutation'
import { useNavigate } from 'react-router-dom'
import { Structure } from '../types/structureTypes'
import { Pencil, Trash } from 'lucide-react'
import { useSongBars } from '../hooks/useSongBars'
import { Panel2 } from '../components/overlays/Panel2'
import { PatternForm } from '../components/pattern/PatternForm'
import { Pattern, PatternFormData, TimeLineItem } from '../types/patternTypes'
import { useStructure } from '../hooks/useStructures'
import { useOutletContext } from 'react-router-dom'

type ContextType = {
  handleStructureFormOpen: (structure?: Structure) => void
}

export function StructurePage() {
  const { handleStructureFormOpen } = useOutletContext<ContextType>()
  const { structureId } = useParams()
  const { data: structure, isLoading: structureLoading, error: structureError } = useStructure(structureId)
  const { deleteStructure } = useStructureMutation()
  const { data: tracks, isLoading: tracksLoading } = useTracksByStructureId(structureId)
  const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false)
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null)
  const [isPatternPanelOpen, setIsPatternPanelOpen] = useState(false)
  const [trackId, setTrackId] = useState<string | null>(null)
  const [timelineItem, setTimelineItem] = useState<TimeLineItem | null>(null)
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const navigate = useNavigate()
  const totalBars = useSongBars(structure)
  const [currentEditingPattern, setCurrentEditingPattern] = useState<PatternFormData | null>(null)

  const handleDeleteStructure = async () => {
    if (!structure) return;
    
    try {
      await deleteStructure(
        structure.id,
        {
          onSuccess: () => navigate('/')
        }
      )
    } catch (error) {
      console.error('Failed to delete structure:', error)
    }
  }

  const handleOpenTrackPanel = (track?: Track) => {
    setTrackToEdit(track || null)
    setIsTrackPanelOpen(true)
  }

  const handlePatternClick = (trackId: string, item: TimeLineItem, patterns: Pattern[]) => {
    setTrackId(trackId)
    setTimelineItem(item)
    setPatterns(patterns)
    setIsPatternPanelOpen(true)
  }

  if (structureLoading || tracksLoading) return <div>Loading...</div>
  if (structureError) return <div>Error: {structureError.message}</div>
  if (!structure) return <div>Structure not found</div>
  if (!structureId) return <div>No structure ID provided</div>

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="font-display uppercase text-6xl font-semibold text-base-200">
            {structure.title}
          </h1>

          {/* song general info */}
          <ul className="flex text-base-400 gap-6">
            {structure.artist && <li className="flex items-center gap-2"><User size={16} strokeWidth={1.75} className="text-base-500" /> {structure.artist}</li>}
            {structure.album && <li className="flex items-center gap-2"><Disc3 size={16} strokeWidth={1.75} className="text-base-500" /> {structure.album}</li>}
            {structure.length && <li className="flex items-center gap-2"><Timer size={16} strokeWidth={1.75} className="text-base-500" /> {formatSecondsToTime(Number(structure.length))} ({totalBars} bars)</li>}
            {structure.bpm && <li className="flex items-center gap-2"><Activity size={16} strokeWidth={1.75} className="text-base-500" /> {structure.bpm} bpm</li>}
            {structure.time_signature && <li>{structure.time_signature}</li>}
            {structure.key && <li>{structure.key}</li>}
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            className="h-14 w-14 border border-base-800"
            title="edit structure"
            aria-label="edit structure"
            onClick={() => handleStructureFormOpen(structure)}
          >
            <Pencil size={18} strokeWidth={1.5} />
          </Button>
          
          <Button
            className="h-14 w-14 border border-base-800"
            title="delete structure"
            aria-label="delete structure"
            onClick={handleDeleteStructure}
          >
            <Trash size={18} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Tracks list */}
      {tracks && tracks.length > 0 ? (
        <TrackList 
          tracks={tracks} 
          totalBars={totalBars}
          onPatternClick={handlePatternClick}
          onEdit={handleOpenTrackPanel}
          currentEditingPattern={currentEditingPattern}
        />
      ) : (
        <p className="text-base-400">No tracks yet</p>
      )}

      <Button 
        className="h-14 w-fit px-4 border border-base-800"
        onClick={() => handleOpenTrackPanel()}
      >
        add track
      </Button>

      <Panel2 name="track"
        isOpen={isTrackPanelOpen}
        onClose={() => setIsTrackPanelOpen(false)}
        // title={trackToEdit ? <>edit<br/>track</> : <>add<br/>track</>}
      >
        <TrackForm
          isOpen={isTrackPanelOpen}
          onClose={() => setIsTrackPanelOpen(false)}
          structureId={structureId}
          track={trackToEdit}
        />
      </Panel2>

      { trackId !== null && timelineItem !== null && (
        <Panel2 name="pattern"
          isOpen={isPatternPanelOpen}
          onClose={() => setIsPatternPanelOpen(false)}
        >
        <PatternForm  
          isOpen={isPatternPanelOpen}
            onClose={() => setIsPatternPanelOpen(false)}
            totalBars={totalBars}
            trackId={trackId}
            timelineItem={timelineItem}
            patterns={patterns}
            onFormDataChange={setCurrentEditingPattern}
        />
        </Panel2>
      )}
    </>
  )
}