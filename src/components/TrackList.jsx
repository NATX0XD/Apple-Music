import React, { useState } from 'react';
import CustomPagination from './CustomPagination';
import { Play, ExternalLink, Trash2 } from 'lucide-react';
import { getArtwork, formatDuration, formatPrice } from '../services/itunesApi';

export default function TrackList({ tracks, currentTrack, onPlay, playlistActions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    if (!tracks || tracks.length === 0) return null;

    const totalPages = Math.ceil(tracks.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedTracks = tracks.slice(startIndex, startIndex + rowsPerPage);

    // Prevent out of bounds when deleting items or changing rows per page
    if (currentPage > 1 && paginatedTracks.length === 0 && tracks.length > 0) {
        setCurrentPage(1);
    }

    return (
        <div className="flex flex-col">
            <div className="glass-card overflow-hidden">
                {/* Table Header */}
                <div className={`grid gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-default-400 border-b border-white/5 
                ${playlistActions ? 'grid-cols-[40px_1fr_1fr_80px_80px_40px]' : 'grid-cols-[40px_1fr_1fr_80px_80px]'}`}>
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span className="text-right">Time</span>
                    <span className="text-right">Price</span>
                    {playlistActions && <span></span>}
                </div>

                {/* Tracks */}
                <div className="divide-y divide-white/[0.03]">
                    {paginatedTracks.map((track, i) => {
                        // Calculate absolute index for the play track array
                        const absoluteIndex = startIndex + i;
                        const isActive = currentTrack?.trackId === track.trackId;
                        return (
                            <div
                                key={`${track.trackId}-${absoluteIndex}`}
                                className={`grid gap-2 px-4 py-2.5 items-center cursor-pointer 
                transition-all duration-150 group
                ${playlistActions ? 'grid-cols-[40px_1fr_1fr_80px_80px_40px]' : 'grid-cols-[40px_1fr_1fr_80px_80px]'}
                ${isActive ? 'bg-theme-500/10' : 'hover:bg-white/[0.03]'}`}
                                onClick={() => onPlay(track, tracks, absoluteIndex)}
                            >
                                {/* Number / Play icon */}
                                <div className="flex items-center justify-center">
                                    {isActive ? (
                                        <div className="playing-indicator text-theme-400">
                                            <span></span><span></span><span></span><span></span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-xs text-default-400 group-hover:hidden">{absoluteIndex + 1}</span>
                                            <Play size={12} className="text-white hidden group-hover:block" fill="currentColor" />
                                        </>
                                    )}
                                </div>

                                {/* Title + Artist */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={getArtwork(track.artworkUrl100, 80)}
                                        alt=""
                                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                                        loading="lazy"
                                    />
                                    <div className="min-w-0">
                                        <p className={`text-sm truncate ${isActive ? 'text-theme-400 font-semibold' : 'font-medium'}`}>
                                            {track.trackName}
                                        </p>
                                        <p className="text-[11px] text-default-400 truncate">{track.artistName}</p>
                                    </div>
                                </div>

                                {/* Album */}
                                <span className="text-xs text-default-500 truncate">{track.collectionName}</span>

                                {/* Duration */}
                                <span className="text-xs text-default-400 text-right font-mono">
                                    {formatDuration(track.trackTimeMillis)}
                                </span>

                                {/* Price */}
                                <div className="text-right">
                                    {track.trackPrice !== undefined && track.trackPrice >= 0 ? (
                                        <a
                                            href={track.trackViewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-0.5 text-[10px] text-theme-300 hover:text-theme-200 transition-colors"
                                        >
                                            {formatPrice(track.trackPrice, track.currency)}
                                            <ExternalLink size={8} />
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-default-500">—</span>
                                    )}
                                </div>

                                {/* Remove Action */}
                                {playlistActions && playlistActions.onRemove && (
                                    <div className="flex justify-end pr-2">
                                        <button
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-default-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playlistActions.onRemove(track.trackId);
                                            }}
                                            title="Remove from Playlist"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Pagination Card placed below the table */}
            {tracks.length > 0 && (
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(rows) => {
                        setRowsPerPage(rows);
                        setCurrentPage(1); // Reset to page 1 when changing rows per page
                    }}
                    totalItems={tracks.length}
                />
            )}
        </div>
    );
}
