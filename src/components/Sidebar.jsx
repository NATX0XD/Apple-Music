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
        <div className="flex flex-col h-full apple-glass p-4 overflow-hidden border-r">
            {/* Logo */}
            <div className="flex items-center mb-8 px-2 mt-2">
                <span className="text-xl font-bold tracking-tight text-white/90">
                    APPLE MUSIC
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

            {/* Bottom actions (Theme only) */}
            <div className="mt-auto px-2">
                <button
                    onClick={onThemeToggle}
                    className="w-full flex justify-center items-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-colors"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
}
