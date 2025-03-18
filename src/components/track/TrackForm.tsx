import { useState, useEffect } from "react";
import { TextField } from "../form/TextField";
import { TrackFormData, Track } from "../../types/trackTypes";
import { useTrackMutation } from "../../hooks/useTrackMutation";    
import { Button } from "../buttons/Button";

type TrackFormProps = {
    structureId: string
    track?: Track | null
    isOpen: boolean
    onClose: () => void
}

const STATIC_TRACK_FORM_DATA = {
    name: '',
    comment: undefined,
    position: 0
} as const;

const getDefaultTrackFormData = (structureId: string): TrackFormData => ({
    ...STATIC_TRACK_FORM_DATA,
    structure_id: structureId
});

export function TrackForm({ structureId, track, isOpen, onClose }: TrackFormProps) {
    const [formData, setFormData] = useState<TrackFormData>(() => 
        getDefaultTrackFormData(structureId)
    );
    
    useEffect(() => {
        if (!isOpen) return;

        if (track) {
            setFormData({
                name: track.name,
                comment: track.comment,
                position: track.position,
                structure_id: structureId
            });
        } else {
            setFormData(getDefaultTrackFormData(structureId));
            
            // focus if !track
            const titleInput = document.getElementById('track_name')
            titleInput?.focus()
        }
    }, [isOpen, structureId, track]);

    const { createTrack, updateTrack, deleteTrack, isLoading, error } = useTrackMutation()

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
        <form onSubmit={handleSubmit} className="flex flex-col divide-y divide-base-500">
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
            <div className="flex divide-x divide-base-700">
                <Button 
                    type="submit"
                    variant="panelGhost"
                    disabled={isLoading}
                    className="h-14 w-full"
                >
                    {isLoading ? (track ? 'updating...' : 'adding...') : (track ? 'update' : 'confirm')}
                </Button>
                {track && (
                    <Button
                        type="button"
                        variant="panelGhostDanger"
                        className="h-14 w-full"
                        onClick={handleDelete}
                    >
                        delete
                    </Button>
                )}
            </div>
        </form>
    )
}