import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePatternsByTrackId } from "../../hooks/usePatterns";
import { generatePatternTimeline } from "../../utils/patternUtils";
import { isPattern, Pattern, PatternFormData, TimeLineItem } from "../../types/patternTypes";

interface TrackProps {
    track: TrackType;
    onEdit: (track: TrackType) => void;
    totalBars: number;
    onPatternClick: (trackId: string, timelineItem: TimeLineItem, patterns: Pattern[]) => void;
    currentEditingPattern?: PatternFormData | null;
}

export function Track({ track, onEdit, totalBars, onPatternClick, currentEditingPattern }: TrackProps) {
    const {data: patterns} = usePatternsByTrackId(track.id);
    
    // Créer la timeline avec des EmptyBar au lieu de null
    const timeline: TimeLineItem[] = patterns 
        ? generatePatternTimeline(patterns, totalBars) 
        : Array(totalBars).fill(null).map((_, index) => ({ type: 'empty', start: index }));

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
            <div className="flex bg-neutral-900 relative flex-grow"> {/** TODO: why relative? */}
                {timeline.map((item, index) => (
                    <button 
                        key={index}
                        className={`h-10 hover:bg-neutral-500 cursor-pointer ${
                            isPattern(item) ? 'bg-neutral-700' : 'bg-neutral-900'
                        }`}
                        style={{
                            width: `${(isPattern(item) ? item.total_length : 1) * 100 / totalBars}%`
                        }}
                        onClick={() => onPatternClick(track.id, item, patterns ?? [])} // TODO: recheck this (patterns ?? [])
                        type="button"
                    />
                ))}
                {currentEditingPattern && currentEditingPattern.track_id === track.id && ( // TODO: recheck condition
                    <div className="absolute top-0 h-10 bg-blue-500/40 border border-blue-400 pointer-events-none"
                        style={{
                            left: `${currentEditingPattern.start * 100 / totalBars}%`,
                            width: `${currentEditingPattern.length * currentEditingPattern.repeat * 100 / totalBars}%`
                        }}
                    />
                )}
            </div>

        </div>
    );
}