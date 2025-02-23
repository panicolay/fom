import { SongList } from './components/songs/SongList'
import { SongForm } from './components/songs/SongForm'
import { useSongs } from './hooks/useSongs'

function App() {
  const { songs, loading, error, refresh } = useSongs()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">FOM</h1>
      <SongForm onSongAdded={refresh} />
      <SongList songs={songs} loading={loading} error={error} />
    </div>
  )
}

export default App
