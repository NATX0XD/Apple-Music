import React from 'react';
import { ListMusic } from 'lucide-react';

export default function PlaylistCover({ tracks, className = "", iconSize = 22 }) {
    if (!tracks || tracks.length === 0) {
        return (
            <div className={`flex items-center justify-center bg-white/5 rounded ${className}`}>
                <ListMusic size={iconSize} className="text-default-400" />
            </div>
        );
    }

    // Get up to 4 most recently added tracks.
    // Assuming tracks are appended, the latest are at the end of the array.
    const recentTracks = [...tracks].reverse().slice(0, 4);

    // If we have 1 to 3 tracks, maybe just show the first one to avoid empty holes?
    // Or we want explicitly a grid of 4? The request says "ล่าสุดของเพลงที่เพิ่มมา 4 เพลง รวมเป็นรูปเดียว"
    // Let's show a 2x2 grid if there are 4 tracks, or just the latest 1 if less than 4? 
    // Usually, Apple Music shows 1 image until there are at least 4. Let's do that for cleanliness,
    // or just fill the grid with the same image if less than 4 to always be a grid.
    // Let's just use the first available artwork.
    if (recentTracks.length < 4) {
        return (
            <img
                src={recentTracks[0].artworkUrl100}
                className={`object-cover rounded ${className}`}
                alt="Playlist cover"
            />
        );
    }

    // When 4 or more, returning a 2x2 grid
    return (
        <div className={`grid grid-cols-2 grid-rows-2 gap-[1px] rounded overflow-hidden ${className}`}>
            {recentTracks.map((track, i) => (
                <img
                    key={i}
                    src={track.artworkUrl100.replace('100x100bb', '50x50bb')} // optimize image size
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            ))}
        </div>
    );
}
