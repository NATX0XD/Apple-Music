import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Music, Video, Play, Heart, ListPlus, Plus } from 'lucide-react';
import { Button, ButtonGroup, ScrollShadow } from '@heroui/react';
import TrackList from './TrackList';
import { getArtwork, searchVideos, formatDuration } from '../services/itunesApi';
import { useFavorites, usePlaylists } from '../hooks/useStorage';

export default function NowPlayingDrawer({ isOpen, onClose, player, tracks, handlePlayTrack }) {
    const [hasVideo, setHasVideo] = useState(null);
    const [videoTrackData, setVideoTrackData] = useState(null);
    const [audioTrackData, setAudioTrackData] = useState(null);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

    const { isFavorite, toggleFavorite } = useFavorites();
    const { playlists, addTrackToPlaylist } = usePlaylists();

    const currentTrack = player?.currentTrack;
    const isVideoMode = player?.isVideo;

    // Check if video is available when track changes
    useEffect(() => {
        if (!isOpen || !currentTrack) return;

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

            setHasVideo(null);
            try {
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
                <>
                    {/* Drawer panel - leaves header visible at top */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 z-50 apple-glass flex flex-col shadow-2xl overflow-hidden backdrop-blur-[64px] bg-black/60"
                        style={{ height: 'calc(100% - 4rem)' }}
                    >

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Left Column: Image/Video & Toggle */}
                            <div className="lg:w-[50%] xl:w-[45%] p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start lg:border-r border-white/5 flex-shrink-0">
                                {/* Mode Toggle */}
                                <div className="flex justify-center mb-5 lg:mb-20 w-full max-w-sm relative z-20">
                                    <ButtonGroup size="sm" variant="flat" className="w-full max-w-xs">
                                        <Button
                                            startContent={<Music size={14} />}
                                            className={`flex-1 font-medium text-xs ${!isVideoMode
                                                ? 'bg-theme-500/30 text-white border border-theme-500/50 shadow-lg'
                                                : 'bg-white/5 text-default-400 hover:text-white'
                                                }`}
                                            onClick={() => handleModeSwitch('audio')}
                                        >
                                            Song
                                        </Button>
                                        <Button
                                            startContent={<Video size={14} />}
                                            isLoading={hasVideo === null && !isVideoMode}
                                            isDisabled={hasVideo === false}
                                            className={`flex-1 font-medium text-xs ${isVideoMode
                                                ? 'bg-pink-500/30 text-white border border-pink-500/50 shadow-lg'
                                                : 'bg-white/5 text-default-400 hover:text-white'
                                                }`}
                                            onClick={() => handleModeSwitch('video')}
                                        >
                                            {hasVideo === false ? 'No Video' : 'Video'}
                                        </Button>
                                    </ButtonGroup>
                                </div>

                                {/* Artwork/Video with Ambient Glow */}
                                <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
                                    {/* Ambient glow layers */}
                                    <div
                                        className="absolute -inset-6 sm:-inset-8 rounded-[2rem] opacity-50 blur-3xl animate-[ambientPulse_4s_ease-in-out_infinite]"
                                        style={{
                                            backgroundImage: `url(${getArtwork(currentTrack.artworkUrl100, 300)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <div
                                        className="absolute -inset-4 sm:-inset-6 rounded-[2rem] opacity-30 blur-2xl animate-[ambientPulse_4s_ease-in-out_1.5s_infinite]"
                                        style={{
                                            backgroundImage: `url(${getArtwork(currentTrack.artworkUrl100, 300)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />

                                    {/* Main artwork */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black/50 flex items-center justify-center border border-white/10 z-10">
                                        {isVideoMode ? (
                                            <video
                                                ref={player.audioRef}
                                                src={currentTrack.previewUrl}
                                                className="w-full h-full object-contain bg-black"
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
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Track Info + All Songs list */}
                            <div className="lg:w-[50%] xl:w-[55%] flex flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
                                {/* Track Info Row with Close Button */}
                                <div className="mb-4 lg:mb-6 flex-shrink-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate">
                                                {currentTrack.trackName}
                                            </h3>
                                            <p className="text-base sm:text-lg text-theme-400 font-semibold truncate mt-1">
                                                {currentTrack.artistName}
                                            </p>
                                            {currentTrack.collectionName && (
                                                <p className="text-sm text-default-400 mt-1 truncate">
                                                    {currentTrack.collectionName}
                                                </p>
                                            )}
                                        </div>
                                        {/* Close Button */}
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-white/10 text-default-400 hover:text-white transition-colors flex-shrink-0 mt-1"
                                            title="Close"
                                        >
                                            <ChevronDown size={24} />
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <button
                                            onClick={() => toggleFavorite(currentTrack)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isFavorite(currentTrack.trackId)
                                                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            <Heart size={16} fill={isFavorite(currentTrack.trackId) ? 'currentColor' : 'none'} />
                                            <span className="hidden sm:inline">{isFavorite(currentTrack.trackId) ? 'Favorited' : 'Favorite'}</span>
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white/10 text-white hover:bg-white/20"
                                            >
                                                <ListPlus size={16} />
                                                <span className="hidden sm:inline">Add to Playlist</span>
                                            </button>

                                            {showPlaylistMenu && (
                                                <div className="absolute top-12 left-0 w-56 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2">
                                                    <div className="p-2 text-xs font-semibold text-default-400 uppercase tracking-wider mb-1">
                                                        Select Playlist
                                                    </div>
                                                    <div className="flex flex-col max-h-40 overflow-y-auto custom-scrollbar">
                                                        {playlists.length > 0 ? playlists.map((pl) => (
                                                            <button
                                                                key={pl.id}
                                                                onClick={() => {
                                                                    addTrackToPlaylist(pl.id, currentTrack);
                                                                    setShowPlaylistMenu(false);
                                                                }}
                                                                className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-xl text-left transition-colors text-sm font-medium"
                                                            >
                                                                <Plus size={14} className="text-theme-400 flex-shrink-0" />
                                                                <span className="truncate">{pl.name}</span>
                                                            </button>
                                                        )) : (
                                                            <div className="p-3 text-xs text-default-500 text-center">
                                                                No playlists yet.<br />Create one in the sidebar.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* All Songs List - same TrackList as HomePage */}
                                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-default-400 mb-3 px-1">
                                        All Songs
                                    </h4>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        {tracks && tracks.length > 0 ? (
                                            <TrackList
                                                tracks={tracks}
                                                currentTrack={player.currentTrack}
                                                onPlay={handlePlayTrack}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 opacity-40">
                                                <Music size={28} className="mb-2" />
                                                <p className="text-sm font-medium">No songs in queue</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

