import React from 'react';
import { Chip, ScrollShadow } from '@heroui/react';
import { TrendingUp } from 'lucide-react';
import { GENRE_TAGS, getArtwork } from '../services/itunesApi';
import { useSettings } from '../hooks/useStorage';
import AmbientGlow from './AmbientGlow';

export default function RightPanel({ onGenreClick, player, onOpenDrawer, mediaElement }) {
    const currentTrack = player?.currentTrack;
    const { settings } = useSettings();
    const AmbientMode = settings.isAmbientMode !== false;
    return (
        <div className="flex flex-col h-full overflow-hidden overflow-y-hidden">
            <ScrollShadow className="flex-1 p-4 space-y-6 overflow-x-hidden overflow-y-auto w-full">
                {/* Genre Tags */}
                <div className="relative z-20">
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
                                className="cursor-pointer dark:border-none bg-white dark:bg-[#18181b] hover:bg-gray-100 dark:hover:bg-[#27272a] text-default-800 dark:text-white border border-black/10 dark:border-white/10 transition-colors px-1 py-4 font-medium"
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
                {currentTrack ? (
                    <div className="relative isolate group cursor-pointer w-full max-w-full" onClick={onOpenDrawer}>
                        {/* Ambient mode && check hide show */}

                        {AmbientMode && (
                            <AmbientGlow currentTrack={currentTrack} size="xs" />
                        )}

                        <div
                            className="relative z-10 bg-white dark:bg-[#18181b] rounded-2xl border border-black/5 dark:border-none shadow-sm p-3 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors"
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
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-default-600 dark:text-default-400 py-20">No song selected</p>
                    </div>

                )}

            </ScrollShadow>
        </div>
    );
}
