import React from 'react';
import { Button, Image } from '@heroui/react';
import { Play, UserPlus } from 'lucide-react';
import { getArtwork } from '../services/itunesApi';

export default function HeroBanner({ track, onPlay }) {
    if (!track) return null;

    const artwork = getArtwork(track.artworkUrl100, 600);

    return (
        <div className="relative rounded-2xl overflow-hidden h-[260px] mb-6 group">
            {/* Background blur */}
            <div className="absolute inset-0">
                <Image
                    src={artwork}
                    alt=""
                    className="w-full h-full object-cover scale-110 blur-sm opacity-40"
                    classNames={{ wrapper: "w-full h-full !max-w-full" }}
                    removeWrapper={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full p-6">
                <div className="flex-1 flex flex-col justify-end">
                    <span className="text-[10px] uppercase tracking-widest text-theme-400 font-semibold mb-1">
                        Artist
                    </span>
                    <h2 className="text-3xl font-extrabold text-white text-shadow-lg mb-1 leading-tight">
                        {track.artistName}
                    </h2>
                    <p className="text-sm text-white/60 mb-4">{track.collectionName}</p>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-theme-500 to-pink-500 text-white font-semibold shadow-lg shadow-theme-500/25 px-5"
                            startContent={<Play size={14} fill="white" />}
                            onPress={() => onPlay(track)}
                        >
                            Play
                        </Button>
                        <Button
                            size="sm"
                            variant="bordered"
                            className="border-white/20 text-white hover:bg-white/10"
                            startContent={<UserPlus size={14} />}
                            onPress={() => window.open(track.artistViewUrl, '_blank')}
                        >
                            Follow
                        </Button>
                    </div>
                </div>

                {/* Artwork */}
                <div className="hidden sm:flex items-center justify-end h-full">
                    <Image
                        src={artwork}
                        alt={track.trackName}
                        className="w-[200px] h-[200px] rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    );
}
