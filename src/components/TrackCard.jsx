import React from 'react';
// @heroui/react Image is not used directly here anymore
import { Play, ExternalLink } from 'lucide-react';
import { getArtwork, formatPrice } from '../services/itunesApi';

export default function TrackCard({ track, isPlaying, onPlay }) {
    const artwork = getArtwork(track.artworkUrl100, 300);

    return (
        <div
            className={`glass-card dark:border-none p-3 cursor-pointer group relative overflow-hidden
        ${isPlaying ? 'ring-1 ring-theme-500/40 ambient-glow' : ''}`}
            onClick={() => onPlay(track)}
        >
            {/* Artwork */}
            <div className="relative mb-3 rounded-xl overflow-hidden aspect-square">
                <img
                    src={artwork}
                    alt={track.trackName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Play overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200
          ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        {isPlaying ? (
                            <div className="playing-indicator text-theme-600">
                                <span></span><span></span><span></span><span></span>
                            </div>
                        ) : (
                            <Play size={18} className="text-black ml-0.5" fill="currentColor" />
                        )}
                    </div>
                </div>

                {/* Explicit badge */}
                {track.trackExplicitness === 'explicit' && (
                    <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-bold bg-black/20 dark:bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-white/90 dark:text-white/80">
                            E
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <p className="text-sm font-semibold text-black dark:text-white truncate mb-0.5">{track.trackName}</p>
                <p className="text-xs text-default-600 dark:text-default-400 truncate mb-2">{track.artistName}</p>

                <div className="flex items-center justify-between">
                    {track.trackPrice !== undefined && track.trackPrice >= 0 && (
                        <span className="text-[10px] font-medium text-theme-600 dark:text-theme-300 bg-theme-500/10 dark:bg-theme-500/20 px-2 py-0.5 rounded-full">
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
