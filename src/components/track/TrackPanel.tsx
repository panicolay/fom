import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { TextField } from '../form/TextField'
import { Button } from '../ui/Button'
import { useState, useEffect } from 'react'
import { TrackFormData } from '../../types/trackTypes'
import { useTrackMutation } from '../../hooks/useTrackMutation'

type PanelProps = {
    isOpen: boolean
    onClose: () => void
    songId: string
}

export function TrackPanel({ isOpen, onClose, songId }: PanelProps) {
    const [formData, setFormData] = useState<TrackFormData>({
        name: '',
        comment: undefined,
        song_id: songId,
        position: 0
    })

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                comment: undefined,
                song_id: songId,
                position: 0
            })
        }
    }, [isOpen, songId])

    const { createTrack, isLoading, error } = useTrackMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await createTrack(formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 bg-neutral-900">
                    <DialogTitle className="text-neutral-200">
                        This is a title
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <TextField 
                            variant="panel"
                            label="track name"
                            id="track_name"
                            value={formData.name}
                            onChange={(value) => setFormData({ ...formData, name: value as string })}
                            type="text"
                            required={true} 
                        />
                        <TextField
                            variant="panel"
                            label="comment"
                            id="track_comment"
                            value={formData.comment}
                            onChange={(value) => setFormData({ ...formData, comment: value as string })}
                            type="text"
                            required={false}
                        />
                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        <Button 
                            type="submit"
                            variant="secondary"
                            disabled={isLoading}
                            className="w-fill">
                            {isLoading ? 'adding...' : 'confirm'}
                        </Button>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    )
}