import React from 'react';
import { Chip, ScrollShadow } from '@heroui/react';
import { TrendingUp } from 'lucide-react';
import { GENRE_TAGS, getArtwork } from '../services/itunesApi';

export default function RightPanel({ onGenreClick, player, onOpenDrawer, mediaElement }) {
    const currentTrack = player?.currentTrack;
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ScrollShadow className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Genre Tags */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} className="text-theme-400" />
                        <h3 className="text-sm font-semibold text-black dark:text-white">Trending Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {GENRE_TAGS.map((tag) => (
                            <Chip
                                key={tag.name}
                                variant="flat"
                                size="md"
                                radius="full"
                                className="cursor-pointer bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-default-800 dark:text-white border border-black/10 dark:border-white/10 transition-colors px-1 py-4 font-medium"
                                onClick={() => onGenreClick(tag.name)}
                            >
                                <div className="flex items-center gap-1.5 px-1 py-0.5">
                                    <span className="text-sm bg-black/10 dark:bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">{tag.emoji}</span>
                                    <span>{tag.name}</span>
                                </div>
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* Now Playing Card */}
                {currentTrack && (
                    <div
                        className="glass-card p-3 ambient-glow cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                        onClick={onOpenDrawer}
                    >
                        <p className="text-[10px] uppercase tracking-wider text-theme-500 font-bold mb-2 flex items-center justify-between">
                            <span>Now Playing</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-default-500 group-hover:text-theme-500">Show Queue</span>
                        </p>
                        {/* Media Display */}
                        {player?.isVideo ? (
                            <div className="mb-3 rounded-xl overflow-hidden shadow-lg bg-black">
                                {mediaElement}
                            </div>
                        ) : (
                            <>
                                {mediaElement}
                                <img
                                    src={getArtwork(currentTrack.artworkUrl100, 500)}
                                    alt={currentTrack.trackName}
                                    className="w-full aspect-square rounded-xl object-cover mb-3 shadow-lg"
                                    loading="lazy"
                                />
                            </>
                        )}
                        <p className="text-sm font-semibold text-black dark:text-white truncate">{currentTrack.trackName}</p>
                        <p className="text-xs text-default-600 dark:text-default-400 truncate">{currentTrack.artistName}</p>
                        {currentTrack.collectionName && (
                            <p className="text-[10px] text-default-500 truncate mt-0.5">{currentTrack.collectionName}</p>
                        )}

                        {/* Playing indicator */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="playing-indicator text-theme-500">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <span className="text-[10px] text-theme-500 font-bold tracking-wide">PLAYING</span>
                        </div>
                    </div>
                )}
            </ScrollShadow>
        </div>
    );
}
