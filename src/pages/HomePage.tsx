import { useEffect, useState } from 'react'
import { useSongs } from '../hooks/useSongs'
import { SongForm } from '../components/songs/SongForm'
import { DialogCustom } from '../components/ui/DialogCustom'
import { Button } from '../components/ui/Button'
import { SongList } from '../components/songs/SongList'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'

export function HomePage() {
    const { songs, loading: songsLoading, error: songsError, refresh } = useSongs()
    const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        registerShortcut('openSongForm', { key: 'n' }, () => setIsModalOpen(true))
        return () => unregisterShortcut('openSongForm')
    }, [registerShortcut, unregisterShortcut])

    return (
        <>
            <h1 className="text-3xl font-bold text-neutral-200">FORM OF MUSIC</h1>

            <Button 
                className="w-fit"
                onClick={() => setIsModalOpen(true)}>
                Add new song
            </Button>

            <DialogCustom
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add new song"
            >
                <SongForm 
                    onSongAdded={() => {
                        setIsModalOpen(false)
                        refresh()
                    }}
                />
            </DialogCustom>

            <SongList
                songs={songs}
                loading={songsLoading}
                error={songsError}
                onRefresh={refresh}
            />
        </>
    )
}