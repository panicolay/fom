import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePatternsByTrackId } from "../../hooks/usePatterns";
import { generatePatternTimeline } from "../../utils/patternUtils";
import { isPattern, Pattern, PatternFormData, TimeLineItem } from "../../types/patternTypes";
import { useRef } from "react";
interface TrackProps {
    track: TrackType;
    onEdit: (track: TrackType, buttonElement: HTMLButtonElement | null) => void;
    totalBars: number;
    onPatternClick: (trackId: string, timelineItem: TimeLineItem, patterns: Pattern[], buttonElement: HTMLButtonElement | null) => void;
    currentEditingPattern?: PatternFormData | null;
}

export function Track({ track, onEdit, totalBars, onPatternClick, currentEditingPattern }: TrackProps) {
    const {data: patterns} = usePatternsByTrackId(track.id);
    const editTrackButtonRef = useRef<HTMLButtonElement>(null);
    const patternButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    
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

    // Fonction de callback pour la ref qui satisfait le type attendu
    const setPatternButtonRef = (index: number) => (element: HTMLButtonElement | null) => {
        patternButtonRefs.current[index] = element;
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
                <GripVertical size={18} strokeWidth={1.75} className="text-base-600" />
            </button>
            <button
                className="w-30 text-base-400 hover:text-base-200 cursor-pointer text-left"
                ref={editTrackButtonRef}
                onClick={() => { onEdit(track, editTrackButtonRef.current) }}
                type="button"
            >
                {track.name}
            </button>

            {/* Bars and patterns */}
            <div className="flex relative flex-grow hover:bg-base-900"> {/** TODO: why relative? */}
                {timeline.map((item, index) => (
                    <button
                        key={index}
                        ref={setPatternButtonRef(index)}
                        className={`h-10 group/button hover:bg-base-500 cursor-pointer transition-colors duration-160 ${
                            isPattern(item) ? 'bg-base-700' : ''
                        }`}
                        onClick={() => onPatternClick(
                            track.id, 
                            item, 
                            patterns ?? [], 
                            patternButtonRefs.current[index]
                        )}
                        type="button"
                        style={{
                            width: `${(isPattern(item) ? item.total_length : 1) * 100 / totalBars}%`
                        }}
                    >
                        {isPattern(item) ? (
                            <div className="w-full h-full flex">
                                {Array.from({ length: item.repeat }).map((_, i) => (
                                    <div 
                                        key={i}
                                        className="
                                            border-r border-transparent border-dashed
                                            last:border-none
                                            group-hover/button:border-base-600/75
                                            transition-colors duration-160"
                                        style={{ 
                                            width: `${100 / item.repeat}%`
                                        }}
                                    />
                                ))}
                            </div>
                        ) : ''}
                    </button>
                ))}
                {currentEditingPattern && currentEditingPattern.track_id === track.id && (
                    <div className="absolute top-0 h-10 bg-base-200 pointer-events-none animate-pulse"
                        style={{
                            left: `${currentEditingPattern.start * 100 / totalBars}%`,
                            width: `${currentEditingPattern.length * currentEditingPattern.repeat * 100 / totalBars}%`
                        }}
                    >
                        <div className="w-full h-full flex divide-x divide-base-400/50 divide-dashed">
                            {Array.from({ length: currentEditingPattern.repeat }).map((_, i) => (
                                <div 
                                    key={i}
                                    style={{ 
                                        width: `${100 / currentEditingPattern.repeat}%`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}