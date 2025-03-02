import { GripVertical } from "lucide-react";
import { Track as TrackType } from "../../types/trackTypes";

interface TrackProps {
    track: TrackType;
}

export function Track({ track }: TrackProps) {
    return (
        <div className="flex items-center gap-2 h-10">
            <GripVertical size={18} strokeWidth={1.75} className="text-neutral-600" />
            <span className="text-neutral-400">{track.name}</span>
        </div>
    )
}