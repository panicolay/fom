import { useEffect, useState } from 'react'
import { useSongs } from '../hooks/useSongs'
import { SongForm } from '../components/songs/SongForm'
import { DialogCustom } from '../components/ui/DialogCustom'
import { Button } from '../components/ui/Button'
import { SongList } from '../components/songs/SongList'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'
import { Song } from '../types/song'

export function HomePage() {
    const { songs, loading: songsLoading, error: songsError, refresh } = useSongs()
    const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songToEdit, setSongToEdit] = useState<Song | null>(null)

    useEffect(() => {
        if (!isModalOpen) {
            registerShortcut('openSongForm', { key: 'n' }, () => {
                setSongToEdit(null)
                setIsModalOpen(true)
            })
            return () => unregisterShortcut('openSongForm')
        }
    }, [registerShortcut, unregisterShortcut, isModalOpen])

    const handleOpenModal = (song?: Song) => {
        setSongToEdit(song || null)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSongToEdit(null)
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-neutral-200">FORM OF MUSIC</h1>

            <Button 
                className="w-fit"
                onClick={() => handleOpenModal()}>
                Add new song
            </Button>

            <DialogCustom
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={songToEdit ? "Edit song" : "Add new song"}
            >
                <SongForm 
                    song={songToEdit}
                    onSuccess={() => {
                        handleCloseModal()
                        refresh()
                    }}
                />
            </DialogCustom>

            <SongList
                songs={songs}
                loading={songsLoading}
                error={songsError}
                onRefresh={refresh}
                onEdit={handleOpenModal}
            />
        </>
    )
}