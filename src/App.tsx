import { useState } from 'react'
import { SongList } from './components/songs/SongList'
import { SongForm } from './components/songs/SongForm'
import { useSongs } from './hooks/useSongs'

function App() {
  const { songs, loading, error, refresh } = useSongs()
  const [isSongFormOpen, setIsSongFormOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">FOM</h1>

      <button onClick={() => setIsSongFormOpen(true)}>Add new song</button>

      {isSongFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h2>Add new song</h2>
              <button onClick={() => setIsSongFormOpen(false)}>Close</button>
            </div>
            <SongForm
              onSongAdded={() => {
                refresh();
                setIsSongFormOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <SongList songs={songs} loading={loading} error={error} />
    </div>
  )
}

export default App
