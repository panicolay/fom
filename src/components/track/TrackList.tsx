import { Track } from "./Track";
import { Track as TrackType } from "../../types/trackTypes";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { useTrackMutation } from "../../hooks/useTrackMutation";
import { TimeLineItem, Pattern, PatternFormData } from "../../types/patternTypes";
import { Button } from "../buttons/Button";
import { Popover } from "../overlays/Popover";
import { TrackForm } from "./TrackForm";
import { useState, useRef } from "react";
import { Plus } from "lucide-react";

interface TrackListProps {
    tracks: TrackType[];
    totalBars: number;
    structureId: string;
    onPatternClick: (trackId: string, timelineItem: TimeLineItem, patterns: Pattern[]) => void;
    currentEditingPattern?: PatternFormData | null;
}

export function TrackList({ tracks, totalBars, structureId, onPatternClick, currentEditingPattern }: TrackListProps) {
    const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false);
    const addTrackButtonRef = useRef<HTMLButtonElement>(null);
    const [activeButtonElement, setActiveButtonElement] = useState<HTMLButtonElement | null>(null);
    const [trackToEdit, setTrackToEdit] = useState<TrackType | null>(null);
    const { reorderTracks } = useTrackMutation();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleOpenTrackPanel = (track?: TrackType, buttonElement?: HTMLButtonElement | null) => {
        setTrackToEdit(track || null)
        setActiveButtonElement(buttonElement || null)
        setIsTrackPanelOpen(true)
    }

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
        <div className="flex flex-col gap-4">
            {tracks.length > 0 ? (
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
                                    onEdit={handleOpenTrackPanel}
                                    totalBars={totalBars}
                                    onPatternClick={onPatternClick}
                                    currentEditingPattern={currentEditingPattern}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            ) : (
                <p className="text-base-400">No tracks yet</p>
            )}

            <Button
                ref={addTrackButtonRef}
                className="h-12 w-12 border border-base-800"
                onClick={() => handleOpenTrackPanel(undefined, addTrackButtonRef.current)}
            >
                <Plus size={16} strokeWidth={1.75} />
            </Button>

            <Popover 
                name="track"
                isOpen={isTrackPanelOpen}
                onClose={() => setIsTrackPanelOpen(false)}
                anchorElement={activeButtonElement}
                className="w-60"
            >
                <TrackForm
                    isOpen={isTrackPanelOpen}
                    onClose={() => setIsTrackPanelOpen(false)}
                    structureId={structureId}
                    track={trackToEdit}
                />
            </Popover>
        </div>
    );
}