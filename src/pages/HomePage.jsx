import React from 'react';
import HeroBanner from '../components/HeroBanner';
import TrackCard from '../components/TrackCard';
import VideoCard from '../components/VideoCard';
import TrackList from '../components/TrackList';
import { Spinner } from '@heroui/react';

export default function HomePage({
    loading,
    contentType,
    searchTerm,
    featuredTracks,
    tracks,
    player,
    handlePlayTrack,
    setSearchTerm,
    setTracks
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" color="secondary" />
            </div>
        );
    }

    const heroTrack = featuredTracks[0];

    return (
        <div className="animate-fade-in">
            {/* Hero Banner (only on home / songs) */}
            {contentType === 'songs' && heroTrack && !searchTerm && (
                <HeroBanner
                    track={heroTrack}
                    onPlay={(t) => handlePlayTrack(t, featuredTracks, 0)}
                />
            )}

            {/* Section Title */}
            <div className="flex items-center justify-between mb-4 mt-6">
                <h2 className="text-xl font-bold">
                    {searchTerm
                        ? `Results for "${searchTerm}"`
                        : contentType === 'songs' ? 'Trending Songs' : 'Music Videos'}
                </h2>
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setTracks(featuredTracks);
                        }}
                        className="text-xs text-theme-400 hover:text-theme-300 transition-colors"
                    >
                        Clear search
                    </button>
                )}
            </div>

            {/* Grid Cards */}
            <div className={`grid gap-4 mb-8 ${contentType === 'videos'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                }`}>
                {tracks.slice(0, 10).map((track) =>
                    contentType === 'videos' ? (
                        <VideoCard
                            key={track.trackId}
                            track={track}
                            onPlay={(t) => handlePlayTrack(t)}
                        />
                    ) : (
                        <TrackCard
                            key={track.trackId}
                            track={track}
                            isPlaying={player.currentTrack?.trackId === track.trackId}
                            onPlay={(t) => handlePlayTrack(t)}
                        />
                    )
                )}
            </div>

            {/* Playlist Table (songs only) */}
            {contentType === 'songs' && tracks.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">All Songs list</h3>
                    <TrackList
                        tracks={tracks}
                        currentTrack={player.currentTrack}
                        onPlay={handlePlayTrack}
                    />
                </div>
            )}

            {tracks.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-default-400 text-lg">No results found</p>
                    <p className="text-default-500 text-sm mt-1">Try a different search term</p>
                </div>
            )}
        </div>
    );
}
