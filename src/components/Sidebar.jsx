import React, { useState } from 'react';
import { Home, History, Heart, Settings, Plus, ListMusic, Music } from 'lucide-react';
import { usePlaylists } from '../hooks/useStorage';
import { useNavigate, useLocation } from 'react-router-dom';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistCover from './PlaylistCover';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export default function Sidebar({ isDark, onThemeToggle, isSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { playlists, createPlaylist } = usePlaylists();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleCreatePlaylist = (name) => {
        const newPlaylist = createPlaylist(name);
        navigate(`/playlist/${newPlaylist.slug}`);
    };

    return (
        <div className={`flex flex-col h-full apple-glass py-4 overflow-hidden border-r bg-[#1a1a24] lg:bg-transparent ${!isSidebarOpen ? 'lg:px-2 lg:items-center' : 'px-4'}`}>
            {/* Logo */}
            <div className={`flex items-center mb-8 mt-2 whitespace-nowrap ${!isSidebarOpen ? 'lg:justify-center' : 'px-2'}`}>
                {isSidebarOpen ? (
                    <span className="text-xl font-bold tracking-tight text-white/90">
                        APPLE MUSIC
                    </span>
                ) : (
                    <Music size={28} className="text-theme-400 hidden lg:block" fill="currentColor" />
                )}
            </div>

            {/* Navigation */}
            <div className={`mb-2 ${!isSidebarOpen ? 'lg:hidden' : 'px-2'}`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">Menu</span>
            </div>
            <nav className="space-y-1 mb-6">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${!isSidebarOpen ? 'lg:justify-center lg:px-0 px-3' : 'px-3'}
              ${location.pathname === path
                                ? 'bg-gradient-to-r from-theme-500/20 to-pink-500/20 text-white border border-theme-500/20'
                                : 'text-default-500 hover:text-white hover:bg-white/5'
                            }`}
                        title={!isSidebarOpen ? label : ''}
                    >
                        <Icon size={isSidebarOpen ? 18 : 22} className={location.pathname === path ? 'text-theme-400' : ''} />
                        <span className={!isSidebarOpen ? 'lg:hidden' : ''}>{label}</span>
                    </button>
                ))}
            </nav>

            {/* Library / Playlists */}
            <div className={`mb-2 flex items-center justify-between ${!isSidebarOpen ? 'lg:justify-center lg:px-0 px-2' : 'px-2'}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wider text-default-400 ${!isSidebarOpen ? 'lg:hidden' : ''}`}>Playlists</span>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-1 hover:bg-white/10 rounded-full text-default-400 hover:text-white transition-colors"
                    title={!isSidebarOpen ? "Create Playlist" : ""}
                >
                    <Plus size={isSidebarOpen ? 14 : 18} />
                </button>
            </div>

            <nav className={`space-y-1 flex-1 overflow-y-auto custom-scrollbar ${!isSidebarOpen ? 'lg:pr-0 pr-1' : 'pr-1'}`}>
                {playlists.map((pl) => {
                    const path = `/playlist/${pl.slug}`;
                    const isActive = location.pathname === path;
                    return (
                        <button
                            key={pl.id}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 truncate
                  ${!isSidebarOpen ? 'lg:justify-center lg:px-0 px-3' : 'px-3'}
                  ${isActive
                                    ? 'bg-gradient-to-r from-theme-500/20 to-pink-500/20 text-white border border-theme-500/20'
                                    : 'text-default-500 hover:text-white hover:bg-white/5 text-left'
                                }`}
                            title={!isSidebarOpen ? pl.name : ""}
                        >
                            <PlaylistCover
                                tracks={pl.tracks}
                                className={`${isSidebarOpen ? 'w-5 h-5' : 'lg:w-8 lg:h-8 w-5 h-5'} flex-shrink-0 opacity-80`}
                                iconSize={isSidebarOpen ? 16 : 22}
                            />
                            <span className={`truncate ${!isSidebarOpen ? 'lg:hidden' : ''}`}>{pl.name}</span>
                        </button>
                    )
                })}
                {playlists.length === 0 && (
                    <div className={`py-4 text-xs text-default-500 text-center border border-dashed border-white/10 rounded-xl mt-2 ${!isSidebarOpen ? 'lg:px-1 px-3' : 'px-3'}`}>
                        {!isSidebarOpen ? (
                            <span className="hidden lg:block">Click +</span>
                        ) : null}
                        <span className={!isSidebarOpen ? 'lg:hidden' : ''}>No playlists yet.<br />Click + to create one.</span>
                    </div>
                )}
            </nav>

            {/* Bottom actions (Theme only) */}
            <div className={`mt-4 flex-shrink-0 ${!isSidebarOpen ? 'lg:px-0 px-2' : 'px-2'}`}>
                <button
                    onClick={onThemeToggle}
                    className="w-full flex justify-center items-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-colors"
                    title="Settings & Appearance"
                >
                    <Settings size={isSidebarOpen ? 18 : 22} />
                </button>
            </div>

            <AddPlaylistModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreatePlaylist}
            />
        </div >
    );
}
