import { useEffect, useState } from "react";
import { TextField } from "../form/TextField";
import { PatternFormData } from "../../types/patternTypes";
import { PanelButton } from "../buttons/PanelButton";
type Props = {
    isOpen: boolean
    onClose: () => void
}

export const DEFAULT_PATTERN_FORM_DATA = {
    start: 0,
    length: 1,
    repeat: 1,
    name: undefined,
    comment: undefined
} as const;

export function PatternForm({ isOpen, onClose }: Props) {

    const [formData, setFormData] = useState<PatternFormData>(DEFAULT_PATTERN_FORM_DATA)

    useEffect(() => {
        if (isOpen) {
            setFormData(DEFAULT_PATTERN_FORM_DATA)
        }
    }, [isOpen])

    useEffect(() => {
        const titleInput = document.getElementById('start')
        titleInput?.focus()
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onClose()
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