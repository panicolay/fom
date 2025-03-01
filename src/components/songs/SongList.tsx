import { Song } from '../../types/songTypes'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { Pencil, Trash } from 'lucide-react'
import { TableButton } from '../table/TableButton'
import { useNavigate } from 'react-router-dom'
import { useSongMutation } from '../../hooks/useSongMutation'
import { useSongs } from '../../hooks/useSongs'

type Props = {
  onEdit: (song: Song) => void
}

export function SongList({ onEdit }: Props) {
  const navigate = useNavigate()
  const { deleteSong } = useSongMutation()
  const { data: songs, isLoading, error } = useSongs()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!songs?.length) return <div className="text-neutral-200">No songs found</div>

  const handleDelete = (id: string) => {
    deleteSong(id)
  }

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
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <TableButton icon={Pencil} action={(e) => {e.stopPropagation(); onEdit(song)}}/>
                  <TableButton icon={Trash} action={(e) => {e.stopPropagation(); handleDelete(song.id)}}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 