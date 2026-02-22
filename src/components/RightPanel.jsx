import React from 'react';
import { Chip, Image, ScrollShadow } from '@heroui/react';
import { TrendingUp, Clock } from 'lucide-react';
import { GENRE_TAGS, getArtwork, formatDuration } from '../services/itunesApi';

export default function RightPanel({ onGenreClick, recentlyPlayed, currentTrack, onPlayTrack }) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ScrollShadow className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Genre Tags */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} className="text-purple-400" />
                        <h3 className="text-sm font-semibold">Trending Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {GENRE_TAGS.map((tag) => (
                            <Chip
                                key={tag.name}
                                variant="flat"
                                size="sm"
                                className={`cursor-pointer bg-gradient-to-r ${tag.color} bg-opacity-10 text-white/90 border-0 hover:opacity-80 transition-opacity px-2`}
                                onClick={() => onGenreClick(tag.name)}
                            >
                                <span className="mr-1">{tag.emoji}</span>
                                {tag.name}
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* Recently Played */}
                {recentlyPlayed.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-pink-400" />
                                <h3 className="text-sm font-semibold">Recently Played</h3>
                            </div>
                            <span className="text-[10px] text-default-400">{recentlyPlayed.length} tracks</span>
                        </div>
                        <div className="space-y-2">
                            {recentlyPlayed.slice(0, 8).map((track, idx) => (
                                <button
                                    key={`${track.trackId}-${idx}`}
                                    onClick={() => onPlayTrack(track)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group
                    ${currentTrack?.trackId === track.trackId ? 'bg-white/5' : ''}`}
                                >
                                    <Image
                                        src={getArtwork(track.artworkUrl100, 80)}
                                        alt={track.trackName}
                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                        classNames={{ wrapper: "flex-shrink-0 w-10 h-10" }}
                                    />
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-xs font-medium truncate">{track.trackName}</p>
                                        <p className="text-[10px] text-default-400 truncate">{track.artistName}</p>
                                    </div>
                                    <span className="text-[10px] text-default-500 font-mono">
                                        {formatDuration(track.trackTimeMillis)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Now Playing Card */}
                {currentTrack && (
                    <div className="glass-card p-3 ambient-glow">
                        <p className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold mb-2">Now Playing</p>
                        <Image
                            src={getArtwork(currentTrack.artworkUrl100, 500)}
                            alt={currentTrack.trackName}
                            className="w-full aspect-square rounded-xl object-cover mb-3"
                        />
                        <p className="text-sm font-semibold truncate">{currentTrack.trackName}</p>
                        <p className="text-xs text-default-400 truncate">{currentTrack.artistName}</p>
                        {currentTrack.collectionName && (
                            <p className="text-[10px] text-default-500 truncate mt-0.5">{currentTrack.collectionName}</p>
                        )}

                        {/* Playing indicator */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="playing-indicator text-purple-400">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <span className="text-[10px] text-purple-400 font-medium">Playing</span>
                        </div>
                    </div>
                )}
            </ScrollShadow>
        </div>
    );
}
