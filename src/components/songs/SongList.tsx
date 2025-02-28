import { useSongMutation } from '../../hooks/useSongMutation'
import { Song } from '../../types/song'
import { formatSecondsToTime } from '../../utils/timeUtils'
import { Button } from '../ui/Button'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

type Props = {
  songs: Song[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onEdit: (song: Song) => void
}

export function SongList({ songs, loading, error, onRefresh, onEdit }: Props) {
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!songs.length) return <div className="text-neutral-200">No songs found</div>
  const { deleteSong } = useSongMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteSong(id)
      onRefresh()
    } catch (e) {
      // L'erreur est déjà gérée dans le hook
    }  
  }

  return (
    <div className="">
      <table className="w-full border-t border-neutral-500">
        <tbody>
          {songs.map((song) => (
            <tr key={song.id} className="h-12 border-b border-neutral-500">
              <td className=""><span className="text-neutral-200 font-medium">{song.title}</span> - <span className="text-neutral-500">{song.artist}</span></td>
              <td className="text-right text-neutral-500">{song.bpm ? (<>{song.bpm} <span className="text-neutral-700">bpm</span></>) : ''}</td>
              <td className="text-right text-neutral-500">{song.length ? formatSecondsToTime(Number(song.length)) : ''}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="small" variant="secondary" icon={PencilIcon} onClick={() => onEdit(song)}/>
                  <Button size="small" variant="secondary" icon={TrashIcon} onClick={() => handleDelete(song.id)}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 