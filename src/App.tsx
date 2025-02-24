import { SongList } from './components/songs/SongList'
import { SongForm } from './components/songs/SongForm'
import { useSongs } from './hooks/useSongs'

function App() {
  const { songs, loading, error, refresh } = useSongs()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-neutral-200">FORM OF MUSIC</h1>
        <SongForm onSongAdded={refresh} />
        <SongList songs={songs} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default App
