import { useEffect, useState } from 'react'
import { SongForm } from '../components/songs/SongForm'
import { Panel } from '../components/overlays/Panel'
import { Button } from '../components/buttons/Button'
import { SongList } from '../components/songs/SongList'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'
import { Song } from '../types/songTypes'

export function HomePage() {
    const [isSongPanelOpen, setIsSongPanelOpen] = useState(false)
    const [songToEdit, setSongToEdit] = useState<Song | null>(null)
    const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()

    useEffect(() => {
        if (!isSongPanelOpen) {
            registerShortcut('openSongForm', { key: 'n' }, () => {
                setSongToEdit(null)
                setIsSongPanelOpen(true)
            })
            return () => unregisterShortcut('openSongForm')
        }
    }, [registerShortcut, unregisterShortcut, isSongPanelOpen])

    const handleOpenSongPanel = (song?: Song) => {
        setSongToEdit(song || null)
        setIsSongPanelOpen(true)
    }

    return (
        <>
            <h1 className="font-display text-7xl font-semibold text-neutral-200">THE<br />FORM OF<br />MUSIC</h1>

            <Button 
                variant="inverted"
                className="w-fit"
                onClick={() => handleOpenSongPanel()}>
                add song
            </Button>

            <Panel
                isOpen={isSongPanelOpen}
                onClose={() => setIsSongPanelOpen(false)}
                title={songToEdit ? <>edit<br/>song</> : <>add <br/>song</>}
            >
                <SongForm 
                    isOpen={isSongPanelOpen}
                    onClose={() => setIsSongPanelOpen(false)}
                    song={songToEdit}
                />
            </Panel>

            <SongList/>
        </>
    )
}