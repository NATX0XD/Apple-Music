import React from 'react';
import { Home, Compass, Radio, Music2, Disc3, Users, ListMusic, Settings, Moon, Sun, Search } from 'lucide-react';
import { Avatar, Input } from '@heroui/react';

const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Compass, label: 'Discover', id: 'discover' },
    { icon: Radio, label: 'Radio', id: 'radio' },
];

const libraryItems = [
    { icon: Disc3, label: 'Albums', id: 'albums' },
    { icon: Music2, label: 'Songs', id: 'songs' },
    { icon: Users, label: 'Artists', id: 'artists' },
    { icon: ListMusic, label: 'Playlists', id: 'playlists' },
];

export default function Sidebar({ activeNav, onNavChange, isDark, onThemeToggle, onSearch }) {
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch(searchValue.trim());
        }
    };

    return (
        <div className="flex flex-col h-full glass-strong p-4 overflow-hidden">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Music2 size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Music
                </span>
            </div>

            {/* Search - mobile only shows inside sidebar */}
            <form onSubmit={handleSearch} className="mb-6">
                <Input
                    size="sm"
                    placeholder="Search..."
                    startContent={<Search size={16} className="text-default-400" />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    classNames={{
                        inputWrapper: "glass !bg-white/5 border border-white/10 group-data-[focus=true]:border-purple-500/50",
                        input: "text-sm"
                    }}
                />
            </form>

            {/* Navigation */}
            <div className="mb-2 px-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">Menu</span>
            </div>
            <nav className="space-y-1 mb-6">
                {navItems.map(({ icon: Icon, label, id }) => (
                    <button
                        key={id}
                        onClick={() => onNavChange(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeNav === id
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/20'
                                : 'text-default-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon size={18} className={activeNav === id ? 'text-purple-400' : ''} />
                        {label}
                    </button>
                ))}
            </nav>

            {/* Library */}
            <div className="mb-2 px-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">Library</span>
                <span className="text-[10px] text-default-500">4</span>
            </div>
            <nav className="space-y-1 flex-1">
                {libraryItems.map(({ icon: Icon, label, id }) => (
                    <button
                        key={id}
                        onClick={() => onNavChange(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeNav === id
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/20'
                                : 'text-default-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon size={18} className={activeNav === id ? 'text-purple-400' : ''} />
                        {label}
                    </button>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-white/5 pt-4 space-y-2">
                {/* Profile */}
                <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar
                        size="sm"
                        name="User"
                        className="bg-gradient-to-br from-purple-500 to-pink-500"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">Music Lover</p>
                        <p className="text-[10px] text-default-400">Premium</p>
                    </div>
                </div>

                <div className="flex items-center justify-between px-3">
                    <button className="p-2 rounded-lg text-default-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={onThemeToggle}
                        className="p-2 rounded-lg text-default-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
