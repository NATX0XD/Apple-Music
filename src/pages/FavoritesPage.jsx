import React from 'react';
import TrackList from '../components/TrackList';
import { useFavorites } from '../hooks/useStorage';
import { Heart } from 'lucide-react';

export default function FavoritesPage({ player, handlePlayTrack }) {
    const { favorites } = useFavorites();

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 mt-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Favorites</h2>
                        <p className="text-default-400 text-sm">Songs you have liked</p>
                    </div>
                </div>
            </div>

            {favorites.length > 0 ? (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden glass-card">
                    <TrackList
                        tracks={favorites}
                        currentTrack={player.currentTrack}
                        onPlay={handlePlayTrack}
                    />
                </div>
            ) : (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                    <Heart size={48} className="mx-auto mb-4 text-default-300 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                    <p className="text-default-400">Click the heart icon on any song to add it here.</p>
                </div>
            )}
        </div>
    );
}
