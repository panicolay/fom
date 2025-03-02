import { Track } from "./Track";
import { Track as TrackType } from "../../types/trackTypes";

interface TrackListProps {
    tracks: TrackType[];
}

export function TrackList({ tracks }: TrackListProps) {
    return (
        <ul>
            {tracks.map((track) => (
                <Track key={track.id} track={track} />
            ))}
        </ul>
    )
}