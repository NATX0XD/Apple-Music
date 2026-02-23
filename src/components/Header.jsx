import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Search, Music, Video, Clock } from 'lucide-react';
import { Input, Button, ButtonGroup } from '@heroui/react';
import { useRecentSearches } from '../hooks/useStorage';

export default function Header({
    searchTerm,
    onSearch,
    contentType,
    onContentTypeChange,
    onToggleSidebar
}) {
    const [value, setValue] = useState(searchTerm || '');
    const [limit, setLimit] = useState(20);
    const [showRecent, setShowRecent] = useState(false);

    const { recentSearches, addSearch } = useRecentSearches();
    const searchRef = useRef(null);

    // Close recent searches dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowRecent(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            addSearch(value.trim());
            onSearch(value.trim(), limit);
            setShowRecent(false);
        }
    };

    const handleRecentClick = (term) => {
        setValue(term);
        addSearch(term);
        onSearch(term, limit);
        setShowRecent(false);
    };

    return (
        <div className="flex items-center gap-4 px-6 h-full glass">
            {/* Sidebar Toggle (Mobile / Optional) */}
            <button
                onClick={onToggleSidebar}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-all xl:hidden"
            >
                <Menu size={20} />
            </button>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1">
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-all">
                    <ChevronLeft size={18} />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-all">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl flex items-center gap-2 relative" ref={searchRef}>
                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <Input
                        size="sm"
                        radius="full"
                        placeholder="Search songs, artists, albums..."
                        startContent={<Search size={16} className="text-default-400 ml-1" />}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setShowRecent(true)}
                        classNames={{
                            inputWrapper: "bg-white/10 hover:bg-white/15 focus-within:!bg-white/20 border-none h-10 shadow-none px-4 transition-colors",
                            input: "text-sm text-white/90 placeholder:text-white/40 font-medium"
                        }}
                    />

                    {/* Recent Searches Dropdown */}
                    {showRecent && recentSearches.length > 0 && (
                        <div className="absolute top-12 left-0 w-full bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                            <div className="p-3 text-xs font-semibold text-default-400 uppercase tracking-wider">
                                Recent Searches
                            </div>
                            <div className="flex flex-col">
                                {recentSearches.map((term, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleRecentClick(term)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors text-sm"
                                    >
                                        <Clock size={14} className="text-default-500" />
                                        <span>{term}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                {/* Limit Input */}
                <div className="w-24 hidden md:block">
                    <Input
                        type="number"
                        size="sm"
                        radius="full"
                        min={1}
                        max={200}
                        placeholder="Limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value) || 20)}
                        classNames={{
                            inputWrapper: "bg-white/10 hover:bg-white/15 focus-within:!bg-white/20 border-none h-10 shadow-none px-3 transition-colors",
                            input: "text-center text-sm font-medium"
                        }}
                        title="Search Limit"
                    />
                </div>
            </div>

            {/* Content Type Toggle */}
            <div className="hidden md:block">
                <ButtonGroup size="sm" variant="flat">
                    <Button
                        startContent={<Music size={14} />}
                        className={`text-xs font-medium ${contentType === 'songs'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-white/5 text-default-400 hover:text-white'
                            }`}
                        onClick={() => onContentTypeChange('songs')}
                    >
                        Songs
                    </Button>
                    <Button
                        startContent={<Video size={14} />}
                        className={`text-xs font-medium ${contentType === 'videos'
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : 'bg-white/5 text-default-400 hover:text-white'
                            }`}
                        onClick={() => onContentTypeChange('videos')}
                    >
                        Music Videos
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}
