import { useState, useEffect } from "react";
import { TextField } from "../form/TextField";
import { Button } from "../ui/Button";
import { TrackFormData } from "../../types/trackTypes";
import { useTrackMutation } from "../../hooks/useTrackMutation";    
import { usePanelContext } from "../../hooks/usePanelContext";

type Props = {
    songId: string
}

export function TrackForm({ songId }: Props) {
    const { isOpen, onClose } = usePanelContext()
    // Initialize form data
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
                name: '',
                comment: undefined,
                song_id: songId,
                position: 0
            })
        }
    }, [isOpen, songId])

    // Create a new track
    const { createTrack, isLoading, error } = useTrackMutation()

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        createTrack(formData, {
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
            <Button 
                type="submit"
                variant="secondary"
                disabled={isLoading}
                className="w-fill">
                {isLoading ? 'adding...' : 'confirm'}
            </Button>
        </form>
    )
}