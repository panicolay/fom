import { Track } from "./Track";
import { Track as TrackType } from "../../types/trackTypes";
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTrackMutation } from "../../hooks/useTrackMutation";
import { TimeLineItem, Pattern, PatternFormData } from "../../types/patternTypes";
interface TrackListProps {
    tracks: TrackType[];
    onEdit: (track: TrackType) => void;
    totalBars: number;
    onPatternClick: (trackId: string, timelineItem: TimeLineItem, patterns: Pattern[]) => void;
    currentEditingPattern?: PatternFormData | null;
}

export function TrackList({ tracks, onEdit, totalBars, onPatternClick, currentEditingPattern }: TrackListProps) {
    const { reorderTracks } = useTrackMutation();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = tracks.findIndex((track) => track.id === active.id);
            const newIndex = tracks.findIndex((track) => track.id === over.id);
            
            const newTracks = arrayMove(tracks, oldIndex, newIndex);
            const updatedTracks = newTracks.map((track, index) => ({
                ...track,
                position: index + 1
            }));
            
            reorderTracks(updatedTracks).catch(error => {
                console.error('Failed to reorder tracks:', error);
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={tracks}
                strategy={verticalListSortingStrategy}
            >
                <ul className="-ml-7">
                    {tracks.map((track) => (
                        <Track 
                            key={track.id} 
                            track={track} 
                            onEdit={onEdit}
                            totalBars={totalBars}
                            onPatternClick={onPatternClick}
                            currentEditingPattern={currentEditingPattern}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}