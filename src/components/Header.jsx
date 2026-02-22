import React from 'react';
import { ChevronLeft, ChevronRight, Search, Music, Video } from 'lucide-react';
import { Input, Button, ButtonGroup } from '@heroui/react';

export default function Header({
    searchTerm,
    onSearch,
    contentType,
    onContentTypeChange
}) {
    const [value, setValue] = React.useState(searchTerm || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    return (
        <div className="flex items-center gap-4 px-6 h-full glass">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-all">
                    <ChevronLeft size={18} />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-default-400 hover:text-white transition-all">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSubmit} className="flex-1 max-w-md">
                <Input
                    size="sm"
                    placeholder="Search songs, artists, albums..."
                    startContent={<Search size={16} className="text-default-400" />}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    classNames={{
                        inputWrapper: "glass !bg-white/5 border border-white/10 group-data-[focus=true]:border-purple-500/50 h-9",
                        input: "text-sm"
                    }}
                />
            </form>

            {/* Content Type Toggle */}
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
    );
}
