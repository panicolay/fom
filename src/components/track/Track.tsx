import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PatternPopover } from "../pattern/PatternPopover";
interface TrackProps {
    track: TrackType;
    onEdit: (track: TrackType) => void;
    totalBars: number;
}

export function Track({ track, onEdit, totalBars }: TrackProps) {
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
            <PatternPopover />

            <div className="flex flex-1 hover:bg-neutral-900">
                {[...Array(totalBars)].map((_, index) => (
                    <div 
                        key={index} 
                        className="flex-1 h-10 hover:bg-neutral-500" 
                    />
                ))}
            </div>

        </div>
    );
}