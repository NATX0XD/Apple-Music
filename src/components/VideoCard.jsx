import React from 'react';
// @heroui/react Image is not used directly here anymore
import { Play, ExternalLink } from 'lucide-react';
import { getArtwork, formatDuration, formatPrice } from '../services/itunesApi';

export default function VideoCard({ track, onPlay }) {
    const artwork = getArtwork(track.artworkUrl100, 400);

    return (
        <div
            className="glass-card p-3 cursor-pointer group overflow-hidden"
            onClick={() => onPlay(track)}
        >
            {/* Thumbnail 16:9 */}
            <div className="relative mb-3 rounded-xl overflow-hidden aspect-video">
                <img
                    src={artwork}
                    alt={track.trackName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play size={20} className="text-black ml-0.5" fill="currentColor" />
                    </div>
                </div>

                {/* Duration badge */}
                {track.trackTimeMillis && (
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <span className="text-[10px] font-mono text-white/90">
                            {formatDuration(track.trackTimeMillis)}
                        </span>
                    </div>
                )}

                {/* MV badge */}
                <div className="absolute top-2 left-2 bg-pink-500/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    <span className="text-[9px] font-bold text-white tracking-wider">MV</span>
                </div>
            </div>

            {/* Info */}
            <div>
                <p className="text-sm font-semibold truncate mb-0.5">{track.trackName}</p>
                <p className="text-xs text-default-400 truncate mb-2">{track.artistName}</p>

                <div className="flex items-center justify-between">
                    {track.trackPrice !== undefined && track.trackPrice >= 0 && (
                        <span className="text-[10px] font-medium text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full">
                            {formatPrice(track.trackPrice, track.currency)}
                        </span>
                    )}
                    <a
                        href={track.trackViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-default-400 hover:text-white transition-colors"
                    >
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
}
