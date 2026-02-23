import React, { useState } from 'react';
import { Home, History, Heart, Settings, Plus, ListMusic, Music } from 'lucide-react';
import { usePlaylists } from '../hooks/useStorage';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export default function Sidebar({ isDark, onThemeToggle, isSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { playlists, createPlaylist } = usePlaylists();

    const handleCreatePlaylist = () => {
        const name = window.prompt("Enter new playlist name:");
        if (name && name.trim()) {
            const newPlaylist = createPlaylist(name);
            navigate(`/playlist/${newPlaylist.slug}`);
        }
    };

    return (
        <div className={`flex flex-col h-full apple-glass p-4 overflow-hidden border-r bg-[#1a1a24] lg:bg-transparent ${!isSidebarOpen ? 'lg:px-2' : ''}`}>
            {/* Logo */}
            <div className="flex items-center mb-8 px-2 mt-2 whitespace-nowrap">
                <span className="text-xl font-bold tracking-tight text-white/90">
                    APPLE MUSIC
                </span>
            </div>

            {/* Navigation */}
            <div className="mb-2 px-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">Menu</span>
            </div>
            <nav className="space-y-1 mb-6">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${location.pathname === path
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/20'
                                : 'text-default-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon size={18} className={location.pathname === path ? 'text-purple-400' : ''} />
                        {label}
                    </button>
                ))}
            </nav>

            {/* Library / Playlists */}
            <div className="mb-2 px-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">Playlists</span>
                <button
                    onClick={handleCreatePlaylist}
                    className="p-1 hover:bg-white/10 rounded-full text-default-400 hover:text-white transition-colors"
                >
                    <Plus size={14} />
                </button>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {playlists.map((pl) => {
                    const path = `/playlist/${pl.slug}`;
                    const isActive = location.pathname === path;
                    return (
                        <button
                            key={pl.id}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 truncate
                  ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/20'
                                    : 'text-default-500 hover:text-white hover:bg-white/5 text-left'
                                }`}
                        >
                            <ListMusic size={16} className={`flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                            <span className="truncate">{pl.name}</span>
                        </button>
                    )
                })}
                {playlists.length === 0 && (
                    <div className="px-3 py-4 text-xs text-default-500 text-center border border-dashed border-white/10 rounded-xl mt-2">
                        No playlists yet.<br />Click + to create one.
                    </div>
                )}
            </nav>

            {/* Bottom actions (Theme only) */}
            <div className="mt-4 px-2 flex-shrink-0">
                <button
                    onClick={onThemeToggle}
                    className="w-full flex justify-center items-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-colors"
                    title="Settings & Appearance"
                >
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
}
