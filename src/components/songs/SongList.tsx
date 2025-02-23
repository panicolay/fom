import { Song } from '../../types/song'

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
    <div>
      <h2 className="text-xl font-semibold">Songs</h2>
      <ul className="">
        {songs.map((song) => (
          <li 
            key={song.id} 
            className=""
          >
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  )
} 