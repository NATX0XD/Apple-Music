import React, { useState } from 'react';
import { Home, History, Heart, Settings, Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePlaylists } from '../hooks/useStorage';
import { useNavigate, useLocation } from 'react-router-dom';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistCover from './PlaylistCover';
import { Image, Tooltip } from '@heroui/react';
import logo from '../images/logo/apple-music.png';
const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export default function Sidebar({ isDark, onThemeToggle, isSidebarOpen, onToggleSidebar, userInfo, onRequireAuth }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { playlists, createPlaylist } = usePlaylists();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleCreatePlaylist = (name) => {
        const newPlaylist = createPlaylist(name);
        navigate(`/playlist/${newPlaylist.slug}`);
    };

    const isCollapsed = !isSidebarOpen;

    return (
        <div className={`flex flex-col h-full apple-glass py-4 overflow-hidden border-r border-white/10 backdrop-blur-[64px] bg-black/60 transition-all duration-300 ${isCollapsed ? 'lg:px-3 lg:items-center' : 'px-4'}`}>
            {/* Logo */}
            <div className={`flex mb-6  whitespace-nowrap ${isCollapsed ? 'flex-col-reverse items-center gap-4 lg:justify-center mt-0' : 'items-center px-2 justify-between mt-2'}`}>
                {isSidebarOpen ? (
                    <div className="flex items-center gap-2">
                        <img
                            alt="Apple Music Logo"
                            src={logo}
                            className="w-6 h-6 object-contain rounded-md"
                        />
                        <span className="text-xl font-bold tracking-tight text-black border-black/10 dark:text-white/90">
                            APPLE MUSIC
                        </span>
                    </div>
                ) : (
                    <img
                        alt="Apple Music Logo"
                        src={logo}
                        className="w-10 h-10 object-contain rounded-xl"
                    />
                )}
                {/* Collapse/Expand Toggle - desktop only */}
                <button
                    onClick={onToggleSidebar}
                    className="hidden lg:flex p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-colors"
                    title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
            </div>

            {/* Navigation Menu */}
            <div className={`mb-2 ${isCollapsed ? 'lg:hidden' : 'px-2'}`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">Menu</span>
            </div>
            <nav className={`space-y-1.5 mb-6 ${isCollapsed ? 'lg:px-0' : ''}`}>
                {navItems.map(({ icon: Icon, label, path }) => {
                    // Hide restricted menus if not logged in
                    if (!userInfo && path !== '/') return null;

                    const isActive = location.pathname === path;
                    const button = (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'lg:justify-center lg:p-3' : 'px-3 py-2.5'}
                                ${isActive
                                    ? `${isCollapsed ? 'lg:bg-theme-500/15' : 'bg-gradient-to-r from-theme-500/20 to-pink-500/20'} text-black dark:text-white border border-theme-500/20`
                                    : 'text-default-600 dark:text-default-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                }`}
                            title={isCollapsed ? label : ''}
                        >
                            <Icon size={isCollapsed ? 20 : 18} className={isActive ? 'text-theme-400' : ''} />
                            <span className={isCollapsed ? 'lg:hidden' : ''}>{label}</span>
                        </button>
                    );

                    if (isCollapsed) {
                        return (
                            <Tooltip key={path} content={label} placement="right" delay={0} closeDelay={0}>
                                {button}
                            </Tooltip>
                        );
                    }
                    return button;
                })}
            </nav>

            {/* Library / Playlists Header (Only show when logged in) */}
            {userInfo && (
                <>
                    <div className={`mb-2 flex items-center justify-between ${isCollapsed ? 'lg:justify-center lg:px-0 px-2' : 'px-2'}`}>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider text-default-600 dark:text-default-400 ${isCollapsed ? 'lg:hidden' : ''}`}>Playlists</span>
                        <Tooltip content="Create Playlist" placement="right" isDisabled={!isCollapsed} delay={0} closeDelay={0}>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className={`hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-colors ${isCollapsed ? 'lg:p-2 p-1' : 'p-1'}`}
                                title={isSidebarOpen ? "" : "Create Playlist"}
                            >
                                <Plus size={isCollapsed ? 20 : 14} />
                            </button>
                        </Tooltip>
                    </div>
                    {/* Placeholder image logo you originally placed here */}
                    <Image
                        alt="Apple Music Logo"
                        src="../images/logo/apple-music.png"
                        width={24}
                    />

                    <nav className={`space-y-1 flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'lg:pr-0 pr-1' : 'pr-1'}`}>
                        {playlists.map((pl) => {
                            const path = `/playlist/${pl.slug}`;
                            const isActive = location.pathname === path;
                            const button = (
                                <button
                                    key={pl.id}
                                    onClick={() => navigate(path)}
                                    className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 truncate
                                        ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-3 py-2'}
                                        ${isActive
                                            ? `${isCollapsed ? 'lg:bg-theme-500/15' : 'bg-gradient-to-r from-theme-500/20 to-pink-500/20'} text-black dark:text-white border border-theme-500/20`
                                            : 'text-default-600 dark:text-default-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-left border border-transparent'
                                        }`}
                                    title={isCollapsed ? pl.name : ""}
                                >
                                    <PlaylistCover
                                        tracks={pl.tracks}
                                        className={`${isCollapsed ? 'lg:w-7 lg:h-7 w-5 h-5' : 'w-5 h-5'} flex-shrink-0 opacity-80 rounded-md`}
                                        iconSize={isCollapsed ? 18 : 16}
                                    />
                                    <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{pl.name}</span>
                                </button>
                            );

                            if (isCollapsed) {
                                return (
                                    <Tooltip key={pl.id} content={pl.name} placement="right" delay={0} closeDelay={0}>
                                        {button}
                                    </Tooltip>
                                );
                            }
                            return <React.Fragment key={pl.id}>{button}</React.Fragment>;
                        })}
                        {playlists.length === 0 && (
                            <div className={`py-4 text-xs text-default-600 dark:text-default-500 text-center border border-dashed border-black/10 dark:border-white/10 rounded-xl mt-2 ${isCollapsed ? 'lg:px-1 px-3' : 'px-3'}`}>
                                {isCollapsed ? (
                                    <span className="hidden lg:block text-lg">+</span>
                                ) : null}
                                <span className={isCollapsed ? 'lg:hidden' : ''}>No playlists yet.<br />Click + to create one.</span>
                            </div>
                        )}
                    </nav>
                </>
            )}

            {/* Guest View Message (Show when NOT logged in) */}
            {!userInfo && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 text-default-400">
                        <Heart size={20} />
                    </div>
                    {isSidebarOpen ? (
                        <>
                            <p className="text-sm font-semibold mb-1 text-black dark:text-white">Save your music</p>
                            <p className="text-xs text-default-500 mb-4 px-2">Log in to create playlists and save your favorite songs.</p>
                            <button
                                onClick={onRequireAuth}
                                className="text-xs font-semibold bg-theme-500 text-white px-4 py-2 rounded-full hover:bg-theme-600 transition-colors shadow-sm w-full"
                            >
                                Sign In
                            </button>
                        </>
                    ) : (
                        <Tooltip content="Sign In" placement="right">
                            <button
                                onClick={onRequireAuth}
                                className="w-8 h-8 flex items-center justify-center bg-theme-500 text-white rounded-full hover:bg-theme-600 transition-colors shadow-sm"
                            >
                                <Heart size={14} />
                            </button>
                        </Tooltip>
                    )}
                </div>
            )}

            <hr className="border-black/10 dark:border-white/10" />
            {/* Bottom actions (Theme only) */}
            <div className={`mt-4 flex-shrink-0 ${isCollapsed ? 'lg:px-0 px-2' : 'px-2'}`}>
                <Tooltip content="Settings" placement="right" isDisabled={!isCollapsed} delay={0} closeDelay={0}>
                    <button
                        onClick={onThemeToggle}
                        className={`w-full flex items-center rounded-xl transition-all duration-300 ${isCollapsed ? 'lg:justify-center p-3' : 'justify-start px-4 py-3 gap-4'} bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white group border border-transparent hover:border-black/10 dark:hover:border-white/10`}
                        title="Settings & Appearance"
                    >
                        <Settings size={isCollapsed ? 20 : 18} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>Settings</span>
                    </button>




                </Tooltip>
            </div>

            <AddPlaylistModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreatePlaylist}
            />

            <div className={`mt-2 pb-2 text-[10px] text-default-500 dark:text-default-400 opacity-70 dark:opacity-50 text-center ${isCollapsed ? 'lg:hidden' : ''}`}>
                Copyright &copy; {new Date().getFullYear() + 543} by Mr. Nattakit Jinakul TCT
            </div>
        </div >
    );
}
