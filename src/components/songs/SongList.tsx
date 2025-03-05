import { formatSecondsToTime } from '../../utils/timeUtils'
import { useNavigate } from 'react-router-dom'
import { useSongs } from '../../hooks/useSongs'

export function SongList() {
  const navigate = useNavigate()
  const { data: songs, isLoading, error } = useSongs()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!songs?.length) return <div className="text-neutral-200">No songs found</div>

  return (
    <div className="">
      <table className="w-full border-t border-neutral-500">
        <tbody>
          {songs.map((song) => (
            <tr 
              key={song.id} 
              className="h-12 border-b border-neutral-500 cursor-pointer" 
              onClick={() => navigate(`/songs/${song.id}`)}
            >
              <td className=""><span className="text-neutral-200 font-medium">{song.title}</span> - <span className="text-neutral-400">{song.artist}</span></td>
              <td className="text-right text-neutral-400">{song.bpm ? (<>{song.bpm} bpm</>) : ''}</td>
              <td className="text-right text-neutral-400">{song.length ? formatSecondsToTime(Number(song.length)) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 