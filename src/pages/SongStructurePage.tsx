import { useParams } from 'react-router-dom'
import { useSong } from '../hooks/useSongs'

export function SongStructurePage() {
  const { songId } = useParams()
  const { data: song, isLoading, error } = useSong(songId)

    // if (isLoading) {
    //   return <div>Loading...</div>
    // }

    // if (error) {
    //   return <div>Error: {error.message}</div>
    // }

  return (
    <h1 className="font-display text-7xl font-semibold text-neutral-200">
      {song?.title}
    </h1>
  )
}