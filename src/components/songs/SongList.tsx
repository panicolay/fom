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
    <table className="">
      <thead>
        <tr className="h-14
          border-b border-base-800
          text-left text-sm text-base-500 uppercase font-display">
          <th className="px-4 font-normal">Title</th>
          <th className="px-4 font-normal">Artist</th>
          <th className="px-4 font-normal">Album</th>
          <th colSpan={3}></th> {/* Don't show bpm, time signature and length titles */}
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <tr 
            key={song.id} 
            className="h-14
              border-b border-base-800
              text-base-400
              cursor-pointer
              group hover:text-base-300 hover:bg-base-900/50 transition-colors duration-80"
            onClick={() => navigate(`/songs/${song.id}`)}
          >
            <td className="px-4 truncate max-w-50 text-base-200 font-medium group-hover:text-base-100 transition-colors duration-80">{song.title}</td>
            <td className="px-4 truncate max-w-50">{song.artist || '-'}</td>
            <td className="px-4 truncate max-w-50">{song.album || '-'}</td>
            <td className="px-4 text-right whitespace-nowrap">{song.bpm} bpm</td>
            <td className="px-4 text-right whitespace-nowrap">{song.time_signature}</td>
            <td className="px-4 text-right whitespace-nowrap">{formatSecondsToTime(Number(song.length))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}