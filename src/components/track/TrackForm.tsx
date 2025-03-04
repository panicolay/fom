import { useState, useEffect } from "react";
import { TextField } from "../form/TextField";
import { TrackFormData, Track } from "../../types/trackTypes";
import { useTrackMutation } from "../../hooks/useTrackMutation";    
import { PanelButton } from "../buttons/PanelButton";
type Props = {
    songId: string
    track?: Track | null
    isOpen: boolean
    onClose: () => void
}

export function TrackForm({ songId, track, isOpen, onClose }: Props) {
    // Initialize form data with empty values
    const [formData, setFormData] = useState<TrackFormData>({
        name: '',
        comment: undefined,
        song_id: songId,
        position: 0
    })

    // Reset form data when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: track?.name || '',
                comment: track?.comment || undefined,
                song_id: songId,
                position: track?.position || 0
            })
        }
    }, [isOpen, songId, track])

    // Create a new track
    const { createTrack, updateTrack, deleteTrack, isLoading, error } = useTrackMutation()

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (track) {
            updateTrack(
                { id: track.id, data: formData },
                {
                    onSuccess: () => {
                        onClose()
                    }
                }
            )
        } else {
            createTrack(
                formData,
                {
                    onSuccess: () => {
                        onClose()
                    }
                }
            )
        }
    }

    const handleDelete = () => {
        if (!track?.id) return;
        
        deleteTrack(track.id, {
            onSuccess: () => {
                onClose()
            }
        })
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
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
            <div className="flex divide-x divide-neutral-500 border-b border-neutral-500">
                <PanelButton 
                    label={isLoading ? (track ? 'updating...' : 'adding...') : (track ? 'update' : 'confirm')}
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="flex-1"
                />
                {track && (
                    <PanelButton 
                        label="delete"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleDelete}
                    />
                )}
            </div>
        </form>
    )
}