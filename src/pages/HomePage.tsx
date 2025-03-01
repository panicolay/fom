import { useEffect, useState } from 'react'
import { SongForm } from '../components/songs/SongForm'
import { Panel } from '../components/ui/Panel'
import { Button } from '../components/ui/Button'
import { SongList } from '../components/songs/SongList'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'
import { Song } from '../types/song'

export function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songToEdit, setSongToEdit] = useState<Song | null>(null)
    const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()

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
        setTimeout(() => {
            setSongToEdit(null)
        }, 200)
    }

    return (
        <>
            <h1 className="font-display text-7xl font-semibold text-neutral-200">THE<br />FORM OF<br />MUSIC</h1>

            <Button 
                className="w-fit"
                onClick={() => handleOpenModal()}>
                Add new song
            </Button>

            <Panel
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={songToEdit ? <>Edit<br/>song</> : <>Add new<br/>song</>}
                side="right"
            >
                <SongForm 
                    song={songToEdit}
                    onSuccess={handleCloseModal}
                />
            </Panel>

            <SongList onEdit={handleOpenModal} />
        </>
    )
}