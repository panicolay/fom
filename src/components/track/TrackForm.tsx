import { useState, useEffect, useRef } from "react";
import { TextField } from "../form/TextField";
import { TrackFormData, Track } from "../../types/trackTypes";
import { useTrackMutation } from "../../hooks/useTrackMutation";    
import { Button } from "../buttons/Button";
import { registerFormShortcutBlocker } from '../../utils/shortcuts';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
    handleDeleteTrack: (track: Track, text: string) => void
  }

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
    const { handleDeleteTrack } = useOutletContext<ContextType>()
    const [formData, setFormData] = useState<TrackFormData>(() => 
        getDefaultTrackFormData(structureId)
    );
    
    const formRef = useRef<HTMLFormElement>(null);
    
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

    // shortcut blocker
    useEffect(() => {
        if (!isOpen) return;
        const cleanup = registerFormShortcutBlocker(formRef.current);
        return cleanup;
    }, [isOpen]);

    const { createTrack, updateTrack, isLoading, error } = useTrackMutation()

    const handleDeleteAndClose = (track: Track, text: string) => {
        handleDeleteTrack(track, text)
        onClose()
    }

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
    
    return (
        <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="flex flex-col divide-y divide-base-500"
        >
            <TextField 
                variant="popover"
                label="track name"
                id="track_name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
                type="text"
                required={true} 
            />
            <TextField
                variant="popover"
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
                    className="h-12 w-full"
                >
                    {isLoading ? (track ? 'updating...' : 'adding...') : (track ? 'update' : 'confirm')}
                </Button>
                {track && (
                    <Button
                        type="button"
                        variant="panelGhostDanger"
                        className="h-12 w-full"
                        onClick={() => handleDeleteAndClose(track, `You are about to delete ${track.name}, with all its patterns.`)}
                    >
                        delete
                    </Button>
                )}
            </div>
        </form>
    )
}