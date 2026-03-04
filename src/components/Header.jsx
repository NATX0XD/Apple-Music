import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronLeft, ChevronRight, Search, Music, Video, Clock, X, ListEnd, LogIn } from 'lucide-react';
import { Input, Button } from '@heroui/react';
import { useRecentSearches } from '../hooks/useStorage';
import profileImg from '../images/68-020415-1032-5.JPG';
import MiniProfile from './UsersMiniProfile';
import UsersMiniProfile from './UsersMiniProfile';
export default function Header({
    searchTerm,
    onSearch,
    contentType,
    onContentTypeChange,
    onToggleSidebar,
    signOut,
    userInfo,
    signIn,
    setIsModalSignInOpen,
    isModalSignInOpen
}) {
    const [value, setValue] = useState(searchTerm || '');
    const [limit, setLimit] = useState(20);
    const [showRecent, setShowRecent] = useState(false);

    useEffect(() => {
        setValue(searchTerm || '');
    }, [searchTerm]);

    const { recentSearches, addSearch, removeSearch } = useRecentSearches();
    const searchRef = useRef(null);
    const navigate = useNavigate();

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
        <div className="flex items-center gap-4 px-6 h-full apple-glass backdrop-blur-[64px] bg-black/60 z-20">
            {/* Sidebar Toggle (Mobile / Optional) */}
            <button
                onClick={onToggleSidebar}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-all xl:hidden flex-shrink-0"
            >
                <Menu size={20} />
            </button>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => navigate(1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Search */}
            <div className="flex-1 flex items-center gap-2 relative z-[100] mr-2" ref={searchRef}>
                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <Input
                        size="sm"
                        radius="full"
                        placeholder="Search songs, artists, albums..."
                        startContent={<Search size={16} className="text-default-400 ml-1" />}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setShowRecent(true)}
                        variant="bordered"
                        classNames={{
                            inputWrapper: "bg-black/5  dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 focus-within:!bg-black/10 dark:focus-within:!bg-white/15 border-1 border-black/20 dark:border-white/20 hover:border-black/30 dark:hover:border-white/30 h-10 shadow-none px-4 transition-colors",
                            input: " bg-transparent text-sm text-black/90 dark:text-white/90 placeholder:text-black/40 dark:placeholder:text-white/40 font-medium"
                        }}
                    />

                    {/* Recent Searches Dropdown */}
                    {showRecent && recentSearches.length > 0 && (
                        <div className="absolute top-12 left-0 w-full bg-white dark:bg-[#1a1a24] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                            <div className="p-3 text-xs font-semibold text-default-500 dark:text-default-400 uppercase tracking-wider mb-1">
                                Recent Searches
                            </div>
                            <div className="flex flex-col">
                                {recentSearches.map((term, i) => (
                                    <div key={i} className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-1 group">
                                        <button
                                            type="button"
                                            onClick={() => handleRecentClick(term)}
                                            className="flex items-center gap-3 flex-1 py-3 px-3 text-left text-sm text-default-700 dark:text-default-200"
                                        >
                                            <Clock size={14} className="text-default-500" />
                                            <span>{term}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSearch(term);
                                            }}
                                            className="p-2 mr-1 text-default-400 hover:text-danger hover:bg-danger/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove Search"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
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
                        max={50}
                        placeholder="Limit"
                        value={limit}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                setLimit('');
                            } else {
                                setLimit(Number(val));
                            }
                        }}
                        onBlur={() => {
                            const num = Number(limit);
                            if (!num || num < 1) setLimit(1);
                            else if (num > 50) setLimit(50);
                        }}
                        variant="bordered"
                        startContent={<ListEnd size={14} className="text-default-400" />}
                        classNames={{
                            inputWrapper: "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 focus-within:!bg-black/10 dark:focus-within:!bg-white/15 border-1 border-black/20 dark:border-white/20 hover:border-black/30 dark:hover:border-white/30 h-10 shadow-none px-3 transition-colors",
                            input: " bg-transparent text-center text-sm font-medium text-black dark:text-white"
                        }}
                        title="Search Limit (max 50)"
                    />
                </div>
            </div>

            {/* Content Type Toggle & Profile Avatar Wrapper */}
            <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
                <div className="hidden md:flex bg-black/5 dark:bg-white/5 p-1.5 rounded-full items-center gap-1  dark:border-white/10">
                    <Button
                        size="md"
                        radius="full"
                        startContent={<Music size={14} />}
                        className={`text-xs font-medium px-4 h-7 ${contentType === 'songs'
                            ? 'bg-white dark:bg-[#2a2a35] text-theme-600 dark:text-theme-300 shadow-sm'
                            : 'bg-transparent text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white'
                            }`}
                        onPress={() => onContentTypeChange('songs')}
                    >
                        Songs
                    </Button>
                    <Button
                        size="md"
                        radius="full"
                        startContent={<Video size={14} />}
                        className={`text-xs font-medium px-4 h-7 ${contentType === 'videos'
                            ? 'bg-white dark:bg-[#2a2a35] text-theme-600 dark:text-theme-300 shadow-sm'
                            : 'bg-transparent text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white'
                            }`}
                        onPress={() => onContentTypeChange('videos')}
                    >
                        Music Videos
                    </Button>
                </div>

                {/* Profile Avatar - flush right
                <a
                    href="https://nattakit-react-form.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
                >
                    <div className="text-right hidden xl:block">
                        <p className="text-xs font-semibold leading-tight group-hover:text-theme-500 dark:group-hover:text-theme-300 transition-colors text-black dark:text-white">Nattakit Jinakul</p>
                        <p className="text-[10px] text-default-600 dark:text-default-500 leading-tight">DEV | KMUTNB</p>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10 group-hover:border-theme-500/50 transition-all flex-shrink-0 shadow-md">
                        <img
                            src={profileImg}
                            alt="Nattakit Jinakul"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </a> */}

                {/* Sign Out Button */}
                {userInfo ? (
                    <UsersMiniProfile userInfo={userInfo} onPress={signOut} />
                ) : (
                    <Button
                        size="md"
                        radius="full"
                        startContent={<LogIn size={14} />}
                        className="text-xs font-medium px-4 h-7 bg-transparent text-default-600 dark:text-default-400 hover:text-black dark:hover:text-white transition-colors"
                        onPress={() => setIsModalSignInOpen(true)}
                    >
                        Sign In
                    </Button>
                )}
            </div>
        </div>
    );
}
