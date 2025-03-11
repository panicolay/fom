import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePatternsByTrackId } from "../../hooks/usePatterns";
import { generatePatternTimeline } from "../../utils/patternUtils";

interface TrackProps {
    track: TrackType;
    onEdit: (track: TrackType) => void;
    totalBars: number;
    onPatternClick: (trackId: string, barIndex: number) => void;
}

export function Track({ track, onEdit, totalBars, onPatternClick }: TrackProps) {
    const { data: patterns, isLoading: patternsLoading, error: patternsError } = usePatternsByTrackId(track.id);
    
    // On s'assure que patterns est un tableau, sinon on utilise un tableau vide
    const timeline = patterns ? generatePatternTimeline(patterns, totalBars) : Array(totalBars).fill(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: track.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-2 h-10 ${isDragging ? 'cursor-grabbing' : ''}`}
        >
            <button
                {...attributes}
                {...listeners}
                className="p-px opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                aria-label={`Réorganiser la piste ${track.name}`}
            >
                <GripVertical size={18} strokeWidth={1.75} className="text-neutral-600" />
            </button>
            <button
                className="w-30 text-neutral-400 hover:text-neutral-200 cursor-pointer text-left"
                onClick={() => { onEdit(track) }}
                type="button"
            >
                {track.name}
            </button>

            {/* Bars and patterns */}
            <div className="flex bg-neutral-900">
                {timeline.map((patternId, index) => (
                    <button key={index}
                        className={`w-8 h-10 hover:bg-neutral-500 cursor-pointer ${
                            patternId ? 'bg-neutral-700' : ''
                        }`}
                        onClick={() => onPatternClick(track.id, index)}
                        type="button"
                    />
                ))}
            </div>

        </div>
    );
}