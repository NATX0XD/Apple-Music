import React, { useState, useEffect, useCallback } from 'react';
import { ScrollShadow, Spinner } from '@heroui/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import RightPanel from './components/RightPanel';
import HeroBanner from './components/HeroBanner';
import TrackCard from './components/TrackCard';
import VideoCard from './components/VideoCard';
import TrackList from './components/TrackList';
import { searchTracks, searchVideos, FEATURED_SEARCHES, getArtwork } from './services/itunesApi';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useAmbientColor } from './hooks/useAmbientColor';

function App() {
    const [isDark, setIsDark] = useState(true);
    const [activeNav, setActiveNav] = useState('home');
    const [contentType, setContentType] = useState('songs');
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [featuredTracks, setFeaturedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);

    const player = useAudioPlayer();
    const { extractColor } = useAmbientColor();

    // Load featured tracks on mount
    useEffect(() => {
        const loadFeatured = async () => {
            setLoading(true);
            try {
                const randomSearch = FEATURED_SEARCHES[Math.floor(Math.random() * FEATURED_SEARCHES.length)];
                const results = await searchTracks(randomSearch, 25);
                setFeaturedTracks(results);
                setTracks(results);
            } catch (err) {
                console.error('Failed to load featured tracks:', err);
            }
            setLoading(false);
        };
        loadFeatured();
    }, []);

    // Extract ambient color when track changes
    useEffect(() => {
        if (player.currentTrack) {
            const artwork = getArtwork(player.currentTrack.artworkUrl100, 100);
            extractColor(artwork);
        }
    }, [player.currentTrack, extractColor]);

    // Theme toggle
    useEffect(() => {
        document.documentElement.className = isDark ? 'dark' : 'light';
    }, [isDark]);

    // Search handler
    const handleSearch = useCallback(async (term) => {
        setSearchTerm(term);
        setLoading(true);
        try {
            const results = contentType === 'songs'
                ? await searchTracks(term, 30)
                : await searchVideos(term, 20);
            setTracks(results);
        } catch (err) {
            console.error('Search failed:', err);
        }
        setLoading(false);
    }, [contentType]);

    // Content type change
    const handleContentTypeChange = useCallback(async (type) => {
        setContentType(type);
        const term = searchTerm || FEATURED_SEARCHES[0];
        setLoading(true);
        try {
            const results = type === 'songs'
                ? await searchTracks(term, 30)
                : await searchVideos(term, 20);
            setTracks(results);
        } catch (err) {
            console.error('Failed to load:', err);
        }
        setLoading(false);
    }, [searchTerm]);

    // Play track
    const handlePlayTrack = useCallback((track, queue, index) => {
        if (!track.previewUrl) return;
        player.playTrack(track, queue || tracks, index || tracks.indexOf(track));

        setRecentlyPlayed(prev => {
            const filtered = prev.filter(t => t.trackId !== track.trackId);
            return [track, ...filtered].slice(0, 20);
        });
    }, [player, tracks]);

    // Genre click
    const handleGenreClick = useCallback((genre) => {
        handleSearch(genre);
    }, [handleSearch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT') return;
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    player.togglePlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    player.seek(Math.min(player.currentTime + 5, player.duration));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    player.seek(Math.max(player.currentTime - 5, 0));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    player.changeVolume(player.volume + 0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    player.changeVolume(player.volume - 0.1);
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [player]);

    // Split tracks for display
    const heroTrack = featuredTracks[0];
    const gridTracks = contentType === 'songs' ? tracks.slice(0, 8) : tracks;
    const listTracks = contentType === 'songs' ? tracks.slice(0, 20) : [];

    return (
        <div className={`h-screen w-screen overflow-hidden ${isDark ? 'dark bg-[#0a0a0f]' : 'light bg-[#f5f5f7]'}`}>
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none ambient-bg transition-all duration-1000" />

            {/* Main Grid: sidebar | right-area */}
            <div className="relative z-10 h-full grid" style={{
                gridTemplateColumns: '260px 1fr',
                gridTemplateRows: '1fr',
            }}>
                {/* Sidebar - full height */}
                <Sidebar
                    activeNav={activeNav}
                    onNavChange={setActiveNav}
                    isDark={isDark}
                    onThemeToggle={() => setIsDark(!isDark)}
                    onSearch={handleSearch}
                />

                {/* Right area = header + content area + player */}
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="h-[64px] flex-shrink-0">
                        <Header
                            searchTerm={searchTerm}
                            onSearch={handleSearch}
                            contentType={contentType}
                            onContentTypeChange={handleContentTypeChange}
                        />
                    </div>

                    {/* Content area: main + right panel */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Main Content */}
                        <ScrollShadow className="flex-1 p-6 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Spinner size="lg" color="secondary" />
                                </div>
                            ) : (
                                <>
                                    {/* Hero Banner (only on home / songs) */}
                                    {contentType === 'songs' && heroTrack && !searchTerm && (
                                        <HeroBanner
                                            track={heroTrack}
                                            onPlay={(t) => handlePlayTrack(t, featuredTracks, 0)}
                                        />
                                    )}

                                    {/* Section Title */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold">
                                            {searchTerm
                                                ? `Results for "${searchTerm}"`
                                                : contentType === 'songs' ? 'Trending Songs' : 'Music Videos'}
                                        </h2>
                                        {searchTerm && (
                                            <button
                                                onClick={() => { setSearchTerm(''); setTracks(featuredTracks); }}
                                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>

                                    {/* Grid Cards */}
                                    <div className={`grid gap-4 mb-8 ${contentType === 'videos'
                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                                        }`}>
                                        {gridTracks.map((track) =>
                                            contentType === 'videos' ? (
                                                <VideoCard
                                                    key={track.trackId}
                                                    track={track}
                                                    onPlay={(t) => handlePlayTrack(t)}
                                                />
                                            ) : (
                                                <TrackCard
                                                    key={track.trackId}
                                                    track={track}
                                                    isPlaying={player.currentTrack?.trackId === track.trackId}
                                                    onPlay={(t) => handlePlayTrack(t)}
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Playlist Table (songs only) */}
                                    {contentType === 'songs' && listTracks.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold mb-3">Playlist</h3>
                                            <TrackList
                                                tracks={listTracks}
                                                currentTrack={player.currentTrack}
                                                onPlay={handlePlayTrack}
                                            />
                                        </div>
                                    )}

                                    {tracks.length === 0 && (
                                        <div className="text-center py-16">
                                            <p className="text-default-400 text-lg">No results found</p>
                                            <p className="text-default-500 text-sm mt-1">Try a different search term</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </ScrollShadow>

                        {/* Right Panel */}
                        <div className="w-[280px] flex-shrink-0 border-l border-white/5 hidden lg:block">
                            <RightPanel
                                onGenreClick={handleGenreClick}
                                recentlyPlayed={recentlyPlayed}
                                currentTrack={player.currentTrack}
                                onPlayTrack={(t) => handlePlayTrack(t)}
                            />
                        </div>
                    </div>

                    {/* Player Bar */}
                    <div className="h-[88px] flex-shrink-0 border-t border-white/5">
                        <PlayerBar
                            currentTrack={player.currentTrack}
                            isPlaying={player.isPlaying}
                            currentTime={player.currentTime}
                            duration={player.duration}
                            volume={player.volume}
                            shuffle={player.shuffle}
                            repeat={player.repeat}
                            onTogglePlay={player.togglePlay}
                            onSeek={player.seek}
                            onVolumeChange={player.changeVolume}
                            onNext={player.playNext}
                            onPrev={player.playPrev}
                            onShuffle={player.setShuffle}
                            onRepeat={player.setRepeat}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
