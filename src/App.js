import React, { useState, useEffect, useCallback } from 'react';
import { ScrollShadow } from '@heroui/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import RightPanel from './components/RightPanel';
import NowPlayingDrawer from './components/NowPlayingDrawer';
import SettingsModal from './components/SettingsModal';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import PlaylistPage from './pages/PlaylistPage';
import { searchTracks, searchVideos, FEATURED_SEARCHES, getArtwork } from './services/itunesApi';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useAmbientColor } from './hooks/useAmbientColor';
import { useHistory, useSettings } from './hooks/useStorage';

function App() {
    const { settings, updateSettings } = useSettings();
    const isDark = settings.isDark !== false; // Default true

    const themeBgColors = {
        purple: { dark: 'bg-[#120a1f]', light: 'bg-[#f8f5fc]' },
        pink: { dark: 'bg-[#1f0a12]', light: 'bg-[#fcf5f8]' },
        blue: { dark: 'bg-[#0a101f]', light: 'bg-[#f5f7fc]' },
        green: { dark: 'bg-[#0a1f10]', light: 'bg-[#f5fcf6]' },
        orange: { dark: 'bg-[#1f100a]', light: 'bg-[#fcf7f5]' },
        red: { dark: 'bg-[#1f0a0a]', light: 'bg-[#fcf5f5]' },
        default: { dark: 'bg-[#0a0a0f]', light: 'bg-[#fcfcfc]' }
    };
    const currentThemeBg = themeBgColors[settings.themeColor] || themeBgColors.default;
    const bgClass = isDark ? currentThemeBg.dark : currentThemeBg.light;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [contentType, setContentType] = useState('songs');
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [featuredTracks, setFeaturedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const player = useAudioPlayer();
    const { extractColor } = useAmbientColor();
    const { addToHistory } = useHistory();
    const navigate = useNavigate();

    // The Right Panel requirements state we should remove Recently Played. 
    // We can just omit passing it to RightPanel.

    // Load featured tracks on mount
    useEffect(() => {
        // Handle responsive sidebar
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        const loadFeatured = async () => {
            setLoading(true);
            try {
                const randomSearch = FEATURED_SEARCHES[Math.floor(Math.random() * FEATURED_SEARCHES.length)];
                const results = await searchTracks(randomSearch, parseInt(settings.trackLimit) || 25);
                setFeaturedTracks(results);
                setTracks(results);
            } catch (err) {
                console.error('Failed to load featured tracks:', err);
            }
            setLoading(false);
        };
        loadFeatured();

        return () => window.removeEventListener('resize', handleResize);
    }, [settings.trackLimit]);

    // Extract ambient color when track changes
    useEffect(() => {
        if (player.currentTrack) {
            const artwork = getArtwork(player.currentTrack.artworkUrl100, 100);
            extractColor(artwork);
        }
    }, [player.currentTrack, extractColor]);

    // Theme toggle
    useEffect(() => {
        document.documentElement.className = isDark ? `dark theme-${settings.themeColor || 'theme'}` : `light theme-${settings.themeColor || 'theme'}`;
        // Set body background programmatically or let class handle it
    }, [isDark, settings.themeColor]);

    // Apply specific CSS variables based on theme color (Optional implementation for custom themes)
    useEffect(() => {
        if (settings.themeColor) {
            document.documentElement.setAttribute('data-theme', settings.themeColor);
        }
    }, [settings.themeColor]);

    // Search handler
    const handleSearch = useCallback(async (term, limit = 20) => {
        setSearchTerm(term);
        setLoading(true);
        navigate('/'); // Go back to Home to show results
        try {
            const results = contentType === 'songs'
                ? await searchTracks(term, limit)
                : await searchVideos(term, limit);
            setTracks(results);
        } catch (err) {
            console.error('Search failed:', err);
        }
        setLoading(false);
    }, [contentType, navigate]);

    // Content type change
    const handleContentTypeChange = useCallback(async (type) => {
        setContentType(type);
        setLoading(true);
        navigate('/');
        const term = searchTerm || FEATURED_SEARCHES[0];
        try {
            const results = type === 'songs'
                ? await searchTracks(term, 30) // Use limit state ideally
                : await searchVideos(term, 20);
            setTracks(results);
        } catch (err) {
            console.error('Failed to load:', err);
        }
        setLoading(false);
    }, [searchTerm, navigate]);

    const handlePlayTrack = useCallback((track, queue, index) => {
        if (!track.previewUrl) return;

        let resolvedIndex = index;
        if (resolvedIndex === undefined) {
            const idx = tracks.indexOf(track);
            resolvedIndex = idx !== -1 ? idx : 0;
        }

        player.playTrack(track, queue || tracks, resolvedIndex);

        // Add to local storage history
        addToHistory(track);
    }, [player, tracks, addToHistory]);

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

    return (
        <div className={`h-screen w-screen overflow-hidden ${isDark ? 'dark ' : 'light '} ${bgClass}`}>
            <div className="fixed inset-0 pointer-events-none ambient-bg transition-all duration-1000" />

            <div className="relative z-10 h-full flex">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div
                    className={`z-50 flex-shrink-0 transition-all duration-300 absolute lg:relative h-full overflow-hidden ${isSidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] lg:translate-x-0 lg:w-[80px]'
                        }`}
                >
                    <Sidebar
                        isDark={isDark}
                        onThemeToggle={() => setIsSettingsOpen(true)}
                        isSidebarOpen={isSidebarOpen}
                    />
                </div>

                <div className="flex flex-col h-full flex-1 min-w-0 overflow-hidden relative">
                    <div className="h-[64px] flex-shrink-0">
                        <Header
                            searchTerm={searchTerm}
                            onSearch={handleSearch}
                            contentType={contentType}
                            onContentTypeChange={handleContentTypeChange}
                            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                    </div>

                    <div className="flex-1 flex overflow-hidden relative">
                        <ScrollShadow className="flex-1 p-6 overflow-y-auto">
                            <Routes>
                                <Route path="/" element={
                                    <HomePage
                                        loading={loading}
                                        contentType={contentType}
                                        searchTerm={searchTerm}
                                        featuredTracks={featuredTracks}
                                        tracks={tracks}
                                        player={player}
                                        handlePlayTrack={handlePlayTrack}
                                        setSearchTerm={setSearchTerm}
                                        setTracks={setTracks}
                                    />
                                } />
                                <Route path="/history" element={
                                    <HistoryPage player={player} handlePlayTrack={handlePlayTrack} />
                                } />
                                <Route path="/favorites" element={
                                    <FavoritesPage player={player} handlePlayTrack={handlePlayTrack} />
                                } />
                                <Route path="/playlist/:slug" element={
                                    <PlaylistPage player={player} handlePlayTrack={handlePlayTrack} />
                                } />
                            </Routes>
                        </ScrollShadow>

                        {/* Right Panel or Video Player */}
                        <div className="w-[280px] flex-shrink-0 border-l border-white/5 hidden lg:block bg-black/10">
                            {player.isVideo && player.currentTrack && !isDrawerOpen ? (
                                <div className="h-full flex flex-col p-4">
                                    <h3 className="text-sm font-bold mb-4">Now Playing Video</h3>
                                    <div className="flex-1 w-full bg-black/60 rounded-xl overflow-hidden relative shadow-lg glass-card flex items-center justify-center">
                                        <video
                                            ref={player.audioRef}
                                            src={player.currentTrack.previewUrl}
                                            className="w-full h-auto max-h-full object-contain"
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
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm font-medium">{player.currentTrack.trackName}</p>
                                        <p className="text-xs text-default-400">{player.currentTrack.artistName}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <RightPanel
                                        currentTrack={player.currentTrack}
                                        onOpenDrawer={() => setIsDrawerOpen(true)}
                                    />
                                    {player.currentTrack && !player.isVideo && (
                                        <audio
                                            ref={player.audioRef}
                                            src={player.currentTrack.previewUrl}
                                            autoPlay
                                            onTimeUpdate={player.handleTimeUpdate}
                                            onLoadedMetadata={player.handleLoadedMetadata}
                                            onEnded={player.handleEnded}
                                            onPlay={() => player.setIsPlaying(true)}
                                            onPause={() => player.setIsPlaying(false)}
                                            className="hidden"
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <NowPlayingDrawer
                            isOpen={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}
                            player={player}
                        />
                    </div>

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
                            onOpenDrawer={() => setIsDrawerOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}

export default App;
