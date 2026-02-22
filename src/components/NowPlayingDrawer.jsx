import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Music, Video, Play } from 'lucide-react';
import { Button, ButtonGroup, ScrollShadow } from '@heroui/react';
import { getArtwork, searchVideos, formatDuration } from '../services/itunesApi';

export default function NowPlayingDrawer({ isOpen, onClose, player }) {
    const [hasVideo, setHasVideo] = useState(null);
    const [videoTrackData, setVideoTrackData] = useState(null);
    const [audioTrackData, setAudioTrackData] = useState(null);

    const currentTrack = player?.currentTrack;
    const isVideoMode = player?.isVideo;

    // Check if video is available when track changes
    useEffect(() => {
        if (!isOpen || !currentTrack) return; // Only check when drawer is open to save API calls

        if (currentTrack.kind !== 'music-video') {
            setAudioTrackData(currentTrack);
        }

        let isCancelled = false;

        const checkVideo = async () => {
            if (currentTrack.kind === 'music-video') {
                if (!isCancelled) {
                    setHasVideo(true);
                    setVideoTrackData(currentTrack);
                }
                return;
            }

            setHasVideo(null); // Loading state
            try {
                // Search for musicVideo matching trackName and artistName
                const query = `${currentTrack.trackName} ${currentTrack.artistName}`;
                const videos = await searchVideos(query, 1);

                if (!isCancelled) {
                    if (videos && videos.length > 0) {
                        setHasVideo(true);
                        setVideoTrackData(videos[0]);
                    } else {
                        setHasVideo(false);
                        setVideoTrackData(null);
                    }
                }
            } catch (err) {
                if (!isCancelled) setHasVideo(false);
            }
        };

        checkVideo();
        return () => { isCancelled = true; };
    }, [currentTrack, isOpen]);

    const handleModeSwitch = async (mode) => {
        if (mode === 'video' && !isVideoMode) {
            if (videoTrackData) {
                player.playTrack(videoTrackData, player.queue, player.queueIndex);
            }
        } else if (mode === 'audio' && isVideoMode) {
            // Restore the audio track firmly
            if (audioTrackData) {
                player.playTrack(audioTrackData, player.queue, player.queueIndex);
            } else if (player.queue && player.queue.length > 0 && player.queueIndex >= 0) {
                const originalAudioTrack = player.queue[player.queueIndex];
                if (originalAudioTrack && originalAudioTrack.kind !== 'music-video') {
                    player.playTrack(originalAudioTrack, player.queue, player.queueIndex);
                }
            }
        }
    };

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-50 apple-glass flex flex-col shadow-2xl overflow-hidden backdrop-blur-[64px] bg-black/60"
                >
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Now Playing
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronDown size={28} />
                        </button>
                    </div>

                    {/* Content Area - Split into Two Columns */}
                    <div className="flex-1 flex flex-row overflow-hidden">
                        {/* Left Column: Image/Video & Toggle */}
                        <div className="w-[55%] p-8 flex flex-col items-center justify-start border-r border-white/5 relative">
                            {/* Mode Toggle */}
                            <div className="flex justify-center mb-8 w-full max-w-sm">
                                <ButtonGroup size="md" variant="flat" className="w-full">
                                    <Button
                                        startContent={<Music size={16} />}
                                        className={`flex-1 font-medium ${!isVideoMode
                                            ? 'bg-purple-500/30 text-white border border-purple-500/50 shadow-lg'
                                            : 'bg-white/5 text-default-400 hover:text-white'
                                            }`}
                                        onClick={() => handleModeSwitch('audio')}
                                    >
                                        Song
                                    </Button>
                                    <Button
                                        startContent={<Video size={16} />}
                                        isLoading={hasVideo === null && !isVideoMode}
                                        isDisabled={hasVideo === false}
                                        className={`flex-1 font-medium ${isVideoMode
                                            ? 'bg-pink-500/30 text-white border border-pink-500/50 shadow-lg'
                                            : 'bg-white/5 text-default-400 hover:text-white'
                                            }`}
                                        onClick={() => handleModeSwitch('video')}
                                    >
                                        {hasVideo === false ? 'No Video' : 'Video'}
                                    </Button>
                                </ButtonGroup>
                            </div>

                            {/* Artwork/Video Container */}
                            <div className="w-full max-w-xl aspect-square rounded-3xl overflow-hidden shadow-2xl bg-black/50 relative flex items-center justify-center border border-white/10">
                                {isVideoMode ? (
                                    <video
                                        ref={player.audioRef}
                                        src={currentTrack.previewUrl}
                                        className="w-full h-full object-contain bg-black"
                                        muted={player.volume === 0}
                                        playsInline
                                        autoPlay
                                        controls
                                        onTimeUpdate={player.handleTimeUpdate}
                                        onLoadedMetadata={player.handleLoadedMetadata}
                                        onEnded={player.handleEnded}
                                        onPlay={() => player.setIsPlaying(true)}
                                        onPause={() => player.setIsPlaying(false)}
                                    />
                                ) : (
                                    <img
                                        src={getArtwork(currentTrack.artworkUrl100, 1000)}
                                        alt={currentTrack.trackName}
                                        className="w-full h-full object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Column: Track Details & Queue */}
                        <div className="w-[45%] p-8 flex flex-col overflow-hidden">
                            {/* Track Details */}
                            <div className="mb-10 text-left">
                                <h3 className="text-4xl font-extrabold mb-3 tracking-tight truncate">
                                    {currentTrack.trackName}
                                </h3>
                                <p className="text-2xl text-purple-400 font-semibold truncate opacity-90">
                                    {currentTrack.artistName}
                                </p>
                                {currentTrack.collectionName && (
                                    <p className="text-lg text-default-400 mt-2 truncate font-medium">
                                        {currentTrack.collectionName}
                                    </p>
                                )}
                            </div>

                            {/* Up Next Queue */}
                            {player.queue && (
                                <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl p-5 border border-white/5 shadow-xl relative">
                                    <div className="flex justify-between items-center mb-5 sticky top-0">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-default-400">
                                            Up Next
                                        </h4>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-default-300 font-mono">
                                            {Math.max(0, player.queue.length - player.queueIndex - 1)} Tracks
                                        </span>
                                    </div>

                                    <ScrollShadow className="flex-1 overflow-y-auto pr-3 space-y-2">
                                        {player.queue.length > 0 && player.queue.slice(player.queueIndex + 1).map((track, idx) => (
                                            <button
                                                key={`${track.trackId}-${idx}`}
                                                onClick={() => player.playTrack(track, player.queue, player.queueIndex + 1 + idx)}
                                                className="w-full flex items-center gap-4 hover:bg-white/10 p-3 rounded-xl transition-all group text-left hover:scale-[1.01] active:scale-[0.99]"
                                            >
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                                    <img
                                                        src={getArtwork(track.artworkUrl100, 150)}
                                                        alt={track.trackName}
                                                        className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className="text-base font-semibold truncate leading-tight group-hover:text-purple-300 transition-colors">
                                                        {track.trackName}
                                                    </p>
                                                    <p className="text-sm text-default-400 truncate mt-1">
                                                        {track.artistName}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-default-500 font-mono opacity-60">
                                                    {formatDuration(track.trackTimeMillis)}
                                                </span>
                                            </button>
                                        ))}
                                        {(!player.queue || player.queueIndex >= player.queue.length - 1) && (
                                            <div className="h-full flex flex-col items-center justify-center opacity-50 py-10">
                                                <Music size={32} className="mb-3" />
                                                <p className="text-sm font-medium">End of playlist</p>
                                            </div>
                                        )}
                                    </ScrollShadow>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
