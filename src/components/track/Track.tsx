import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TrackProps {
    track: TrackType;
}

export function Track({ track }: TrackProps) {
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
            className="flex items-center gap-2 h-10"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={18} strokeWidth={1.75} className="text-neutral-600" />
            </button>
            <span className="text-neutral-400">{track.name}</span>
        </div>
    );
}