import { useEffect, useState } from "react";
import { TextField } from "../form/TextField";
import { PatternFormData } from "../../types/patternTypes";
import { usePatternMutation } from "../../hooks/usePatternMutation";
import { PanelButton } from "../buttons/PanelButton";

type PatternFormProps = {
    trackId: string
    barIndex: number
    isOpen: boolean
    onClose: () => void
}

const STATIC_PATTERN_FORM_DATA = {
    length: 1,
    repeat: 1,
    name: undefined,
    comment: undefined
} as const;

const getDefaultPatternFormData = (trackId: string, barIndex: number): PatternFormData => ({
    ...STATIC_PATTERN_FORM_DATA,
    track_id: trackId,
    start: barIndex
});

export function PatternForm({ trackId, barIndex, isOpen, onClose }: PatternFormProps) {
    const [formData, setFormData] = useState<PatternFormData>(() => 
        getDefaultPatternFormData(trackId, barIndex)
    );

    useEffect(() => {
        if (isOpen) {
            setFormData(getDefaultPatternFormData(trackId, barIndex))
        }
    }, [isOpen, trackId, barIndex])

    useEffect(() => {
        const titleInput = document.getElementById('start')
        titleInput?.focus()
    }, [])

    const { createPattern } = usePatternMutation()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createPattern(formData, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col divide-y divide-neutral-500">
            <div className="flex w-full divide-x divide-neutral-500">
                <TextField variant="popover" label="start" id="start"
                    className="flex-1 min-w-0"
                    value={formData.start.toString()}
                    onChange={(value) => setFormData({ ...formData, start: Number(value) })}
                    type="number" required
                />
                <TextField variant="popover" label="length" id="length"
                    className="flex-1 min-w-0"
                    value={formData.length.toString()}
                    onChange={(value) => setFormData({ ...formData, length: Number(value) })}
                    type="number" required
                />
                <TextField variant="popover" label="reps." id="reps"
                    className="flex-1 min-w-0"
                    value={formData.repeat.toString()}
                    onChange={(value) => setFormData({ ...formData, repeat: Number(value) })}
                    type="number" required
                />
            </div>
            <TextField variant="popover" label="comment" id="comment"
                value={formData.comment || ""}
                onChange={(value) => setFormData({ ...formData, comment: value as string })}
                type="text" required={false}
            />
            <PanelButton label="confirm" variant="primary" type="submit"
                className="!h-12"
            >Confirm</PanelButton>
        </form>
    )
}