import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { Slider, Image } from '@heroui/react';
import { getArtwork, formatDuration, formatPrice } from '../services/itunesApi';

export default function PlayerBar({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    onTogglePlay,
    onSeek,
    onVolumeChange,
    onNext,
    onPrev,
    onShuffle,
    onRepeat,
}) {
    if (!currentTrack) {
        return (
            <div className="glass-strong flex items-center justify-center h-full">
                <p className="text-default-400 text-sm">Select a song to start playing</p>
            </div>
        );
    }

    const artworkUrl = getArtwork(currentTrack.artworkUrl100, 120);

    return (
        <div className="glass-strong flex items-center gap-4 px-5 h-full">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 w-[240px]">
                <Image
                    src={artworkUrl}
                    alt={currentTrack.trackName}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    classNames={{ wrapper: "flex-shrink-0" }}
                />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{currentTrack.trackName}</p>
                    <p className="text-xs text-default-400 truncate">{currentTrack.artistName}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center gap-1 max-w-xl mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onShuffle}
                        className={`p-1.5 rounded-full transition-colors ${shuffle ? 'text-purple-400' : 'text-default-400 hover:text-white'}`}
                    >
                        <Shuffle size={16} />
                    </button>
                    <button onClick={onPrev} className="p-1.5 rounded-full text-default-300 hover:text-white transition-colors">
                        <SkipBack size={18} fill="currentColor" />
                    </button>
                    <button
                        onClick={onTogglePlay}
                        className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button onClick={onNext} className="p-1.5 rounded-full text-default-300 hover:text-white transition-colors">
                        <SkipForward size={18} fill="currentColor" />
                    </button>
                    <button
                        onClick={onRepeat}
                        className={`p-1.5 rounded-full transition-colors ${repeat ? 'text-purple-400' : 'text-default-400 hover:text-white'}`}
                    >
                        <Repeat size={16} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                    <span className="text-[10px] text-default-400 w-8 text-right font-mono">
                        {formatDuration(currentTime * 1000)}
                    </span>
                    <Slider
                        size="sm"
                        step={0.1}
                        maxValue={duration || 30}
                        minValue={0}
                        value={currentTime}
                        onChange={(val) => onSeek(val)}
                        className="flex-1"
                        classNames={{
                            track: "bg-white/10 h-1",
                            filler: "bg-gradient-to-r from-purple-500 to-pink-500",
                            thumb: "w-3 h-3 bg-white shadow-md after:w-3 after:h-3",
                        }}
                        aria-label="Song progress"
                    />
                    <span className="text-[10px] text-default-400 w-8 font-mono">
                        {formatDuration(duration * 1000)}
                    </span>
                </div>
            </div>

            {/* Volume + Price */}
            <div className="flex items-center gap-3 w-[200px] justify-end">
                {/* Volume */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
                        className="text-default-400 hover:text-white transition-colors"
                    >
                        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <Slider
                        size="sm"
                        step={0.01}
                        maxValue={1}
                        minValue={0}
                        value={volume}
                        onChange={(val) => onVolumeChange(val)}
                        className="w-20"
                        classNames={{
                            track: "bg-white/10 h-1",
                            filler: "bg-white/60",
                            thumb: "w-2.5 h-2.5 bg-white after:w-2.5 after:h-2.5",
                        }}
                        aria-label="Volume"
                    />
                </div>

                {/* Price + Buy Link */}
                {currentTrack.trackPrice !== undefined && (
                    <a
                        href={currentTrack.trackViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-xs font-medium text-purple-300 hover:border-purple-400/40 transition-all"
                    >
                        {formatPrice(currentTrack.trackPrice, currentTrack.currency)}
                        <ExternalLink size={10} />
                    </a>
                )}
            </div>
        </div>
    );
}
