import { useParams } from 'react-router-dom'
import { useTracksByStructureId } from '../hooks/useTracks'
import { Button } from '../components/buttons/Button'
import { formatSecondsToTime } from '../utils/timeUtils'
import { TrackList } from '../components/track/TrackList'
import { User, Disc3, Timer, Activity } from 'lucide-react'
import { Structure } from '../types/structureTypes'
import { Pencil, Trash } from 'lucide-react'
import { useSongBars } from '../hooks/useSongBars'
import { useStructure } from '../hooks/useStructures'
import { useOutletContext } from 'react-router-dom'

type ContextType = {
  handleStructureFormOpen: (structure?: Structure) => void
  handleDeleteStructure: (structure: Structure, text: string) => void
}

export function StructurePage() {
  const { handleStructureFormOpen, handleDeleteStructure } = useOutletContext<ContextType>()
  const { structureId } = useParams()
  const {
    data: structure,
    isLoading: structureLoading,
    error: structureError,
  } = useStructure(structureId)
  const { data: tracks, isLoading: tracksLoading } = useTracksByStructureId(structureId)
  const totalBars = useSongBars(structure)

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
            {structure.artist && (
              <li className="flex items-center gap-2">
                <User size={16} strokeWidth={1.75} className="text-base-500" /> {structure.artist}
              </li>
            )}
            {structure.album && (
              <li className="flex items-center gap-2">
                <Disc3 size={16} strokeWidth={1.75} className="text-base-500" /> {structure.album}
              </li>
            )}
            {structure.length && (
              <li className="flex items-center gap-2">
                <Timer size={16} strokeWidth={1.75} className="text-base-500" />{' '}
                {formatSecondsToTime(Number(structure.length))} ({totalBars} bars)
              </li>
            )}
            {structure.bpm && (
              <li className="flex items-center gap-2">
                <Activity size={16} strokeWidth={1.75} className="text-base-500" /> {structure.bpm}{' '}
                bpm
              </li>
            )}
            {structure.time_signature && <li>{structure.time_signature}</li>}
            {structure.key && <li>{structure.key}</li>}
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            className="h-12 w-12 border border-base-800"
            title="edit structure"
            aria-label="edit structure"
            onClick={() => handleStructureFormOpen(structure)}
          >
            <Pencil size={16} strokeWidth={1.75} />
          </Button>

          <Button
            className="h-12 w-12 border border-base-800"
            title="delete structure"
            aria-label="delete structure"
            onClick={() =>
              handleDeleteStructure(
                structure,
                `You are about to delete ${structure.title}, with all its tracks and patterns.`,
              )
            }
          >
            <Trash size={16} strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      {/* Tracks list */}
      <TrackList tracks={tracks || []} totalBars={totalBars} structureId={structureId} />
    </>
  )
}
