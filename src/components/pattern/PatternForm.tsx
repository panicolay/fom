import { useEffect, useState } from "react";
import { TextField } from "../form/TextField";
import { Pattern, PatternFormData, TimeLineItem, isPattern } from "../../types/patternTypes";
import { usePatternMutation } from "../../hooks/usePatternMutation";
import { PanelButton } from "../buttons/PanelButton";

type PatternFormProps = {
    totalBars: number
    trackId: string
    timelineItem: TimeLineItem
    patterns: Pattern[]
    isOpen: boolean
    onClose: () => void
    onFormDataChange: (formData: PatternFormData | null) => void // TODO: why "|null" after PatternFormData?
}

const STATIC_PATTERN_FORM_DATA = {
    length: 1,
    repeat: 1,
    name: undefined,
    comment: undefined
} as const;

const getDefaultPatternFormData = (trackId: string, start: number): PatternFormData => ({
    ...STATIC_PATTERN_FORM_DATA,
    track_id: trackId,
    start: start
});

export function PatternForm({ totalBars, trackId, timelineItem, patterns, isOpen, onClose, onFormDataChange }: PatternFormProps) {
    const patternToFormData = (pattern: Pattern): PatternFormData => ({
        track_id: trackId,
        start: pattern.start,
        length: pattern.length,
        repeat: pattern.repeat,
        name: pattern.name,
        comment: pattern.comment
    })
    const isEditMode = isPattern(timelineItem)
    const [formData, setFormData] = useState<PatternFormData>(getDefaultPatternFormData(trackId, timelineItem.start)
    );
    const [errors, setErrors] = useState<Record<string, string>>({}) // TODO: understand this line


    useEffect(() => {
        if (!isOpen) return
        if (isOpen) {
            const newFormData = isEditMode ? patternToFormData(timelineItem as Pattern) : getDefaultPatternFormData(trackId, timelineItem.start)
            setFormData(newFormData)
            setErrors({})
            onFormDataChange?.(newFormData)
        } else {
            onFormDataChange?.(null) // TODO: why ? (!isOpen) is not enough? why null?
        }
    }, [isOpen, trackId, timelineItem, isEditMode, onFormDataChange])

    useEffect(() => {
        if (isOpen) {
            onFormDataChange?.(formData)
        }
    }, [formData, isOpen, onFormDataChange]) // TODO: why is this needed? Isn't it already covered by the first useEffect?

    const { createPattern, updatePattern } = usePatternMutation()

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const formDataEnd = formData.start + formData.length * formData.repeat;

        if (formData.start < 0) newErrors.start = "Pattern can't start before bar 0"
        if (formDataEnd > totalBars) newErrors.end = "Pattern can't end after song end"
        if (formData.length <= 0) newErrors.length = "Pattern length must be greater than 0"
        if (formData.repeat <= 0) newErrors.repeat = "Pattern repeat must be greater than 0"

        const patternId = isEditMode ? (timelineItem as Pattern).id : undefined; // TODO: recheck this
        const hasOverlap = patterns.some(pattern => {
            if (isEditMode && pattern.id === patternId) return false; // TODO: why is EditMode here?
            const otherPatternStart = pattern.start;
            const otherPatternEnd = otherPatternStart + pattern.length * pattern.repeat;

            return (
                (formData.start >= otherPatternStart && formData.start < otherPatternEnd) ||
                (formDataEnd > otherPatternStart && formDataEnd <= otherPatternEnd) ||
                (formData.start <= otherPatternStart && formDataEnd >= otherPatternEnd)
            )
        })
        if (hasOverlap) newErrors.overlap = "Pattern overlaps with another pattern"
        // TODO: find a way to display error messages
        // TODO: add also validation for server side? (hook, service, etc)
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) return

        if (isEditMode && isPattern(timelineItem)) { // TODO: check why isPattern is needed here
            updatePattern({
                id: timelineItem.id,
                data: formData
            }, {
                onSuccess: () => {
                    onFormDataChange?.(null) // TODO: why is this needed? Isn't it already covered by the first useEffect?
                    onClose()
                }
            })
        } else {
            createPattern(formData, {
                onSuccess: () => {
                    onFormDataChange?.(null) // TODO: why is this needed? Isn't it already covered by the first useEffect?
                    onClose()
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col divide-y divide-base-500">
            <div className="flex w-full divide-x divide-base-500">
                <TextField variant="popover" label="start" id="start"
                    className="flex-1 min-w-0"
                    value={formData.start.toString()}
                    onChange={(value) => setFormData({ ...formData, start: Number(value) })}
                    type="number" required
                    error={errors.start}
                    min={0}
                    max={totalBars}
                />
                <TextField variant="popover" label="length" id="length"
                    className="flex-1 min-w-0"
                    value={formData.length.toString()}
                    onChange={(value) => setFormData({ ...formData, length: Number(value) })}
                    type="number" required
                    error={errors.length}
                    min={1}
                />
                <TextField variant="popover" label="reps." id="reps"
                    className="flex-1 min-w-0"
                    value={formData.repeat.toString()}
                    onChange={(value) => setFormData({ ...formData, repeat: Number(value) })}
                    type="number" required
                    error={errors.repeat}
                    min={1}
                />
            </div>
            <TextField variant="popover" label="comment" id="comment"
                value={formData.comment || ""}
                onChange={(value) => setFormData({ ...formData, comment: value as string })}
                type="text" required={false}
            />
            <PanelButton label="confirm" variant="primary" type="submit"
                className="!h-12"
            >
                {isEditMode ? "update" : "create"}
            </PanelButton>
        </form>
    )
}