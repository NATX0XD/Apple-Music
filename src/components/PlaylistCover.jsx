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

    const recentTracks = [...tracks].reverse().slice(0, 4);


    if (recentTracks.length < 4) {
        return (
            <img
                src={recentTracks[0].artworkUrl100}
                className={`object-cover rounded ${className}`}
                alt="Playlist cover"
            />
        );
    }

    return (
        <div className={`grid grid-cols-2 grid-rows-2 gap-[1px] rounded overflow-hidden ${className}`}>
            {recentTracks.map((track, i) => (
                <img
                    key={i}
                    src={track.artworkUrl100.replace('100x100bb', '50x50bb')} 
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            ))}
        </div>
    );
}
