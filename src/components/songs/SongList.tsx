import { formatSecondsToTime } from '../../utils/timeUtils'
import { useNavigate } from 'react-router-dom'
import { useSongs } from '../../hooks/useSongs'

export function SongList() {
  const navigate = useNavigate()
  const { data: songs, isLoading, error } = useSongs()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!songs?.length) return <div className="text-base-200">No songs found</div>

  return (
    <table className="border-t border-base-700">
      <tbody>
        {songs.map((song) => (
          <tr 
            key={song.id} 
            className="h-14 border-b border-base-700 cursor-pointer" 
            onClick={() => navigate(`/songs/${song.id}`)}
          >
            <td className="text-base-200 font-medium">{song.title}</td>
            <td className="text-base-400 text-left">{song.artist}</td>
            <td className="text-base-400 text-right">{song.bpm} bpm</td>
            <td className="text-base-400 text-right">{formatSecondsToTime(Number(song.length))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}