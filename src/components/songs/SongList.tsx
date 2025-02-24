import { Song } from '../../types/song'
import { formatSecondsToTime } from '../../utils/timeUtils'

type Props = {
  songs: Song[]
  loading: boolean
  error: string | null
}

export function SongList({ songs, loading, error }: Props) {
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!songs.length) return <div>No songs found</div>

  return (
    <div className="flex flex-col gap-3">
      {/* <h2 className="text-xl font-bold text-neutral-200">Songs</h2> */}
      <ul className="border-t border-neutral-500">
        {songs.map((song) => (
          <li 
            key={song.id} 
            className="h-12 flex items-center justify-between text-neutral-200 border-b border-neutral-500"
          >
            <div className="flex items-center gap-2">
              <span className="text-neutral-200">{song.title}</span>
              <span className="text-neutral-500">{song.artist}</span>
            </div>
            <div className="flex gap-4 text-neutral-400 text-sm">
              {song.bpm && <span>{song.bpm} BPM</span>}
              {song.length && <span>{formatSecondsToTime(Number(song.length))}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 