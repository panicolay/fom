import { formatSecondsToTime } from '../../utils/timeUtils'
import { useNavigate } from 'react-router-dom'
import { Structure } from '../../types/structureTypes'
import { useStructures } from '../../hooks/useStructures'

export function StructureList() {
  const navigate = useNavigate()
  const { data: structures, isLoading, error } = useStructures()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!structures?.length) return <div className="text-base-200">No structures found</div>

  return (
    <table className="">
      <thead>
        <tr className="h-14 border-b border-base-800 text-left text-sm text-base-500 uppercase font-display">
          <th className="px-4 font-normal">Title</th>
          <th className="px-4 font-normal">Artist</th>
          <th className="px-4 font-normal">Album</th>
          <th colSpan={3}></th>
        </tr>
      </thead>
      <tbody>
        {structures.map((structure: Structure) => (
          <tr
            key={structure.id}
            className="h-14 border-b border-base-800 text-base-400 cursor-pointer group hover:text-base-300 hover:bg-base-900/50 transition-colors duration-80"
            onClick={() => navigate(`/structures/${structure.id}`)}
          >
            <td className="px-4 truncate max-w-50 text-base-200 font-medium group-hover:text-base-100 transition-colors duration-80">
              {structure.title}
            </td>
            <td className="px-4 truncate max-w-50">{structure.artist || '-'}</td>
            <td className="px-4 truncate max-w-50">{structure.album || '-'}</td>
            <td className="px-4 text-right whitespace-nowrap">{structure.bpm} bpm</td>
            <td className="px-4 text-right whitespace-nowrap">{structure.time_signature}</td>
            <td className="px-4 text-right whitespace-nowrap">
              {formatSecondsToTime(Number(structure.length))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
