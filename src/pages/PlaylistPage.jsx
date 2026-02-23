import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import TrackList from '../components/TrackList';
import { usePlaylists } from '../hooks/useStorage';
import { Trash2, Music } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import PlaylistCover from '../components/PlaylistCover';

export default function PlaylistPage({ player, handlePlayTrack }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { playlists, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const playlist = playlists.find(p => p.slug === slug);

    if (!playlist) {
        return <Navigate to="/" replace />;
    }

    const handleDeletePlaylist = () => {
        deletePlaylist(playlist.id);
        setIsDeleteModalOpen(false);
        navigate('/');
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-10 pt-6">
                <div className="w-48 h-48 bg-gradient-to-br from-theme-500/20 to-pink-500/20 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-theme-500/10 mix-blend-overlay z-10 pointer-events-none" />
                    <PlaylistCover
                        tracks={playlist.tracks}
                        className="w-full h-full object-cover"
                        iconSize={64}
                    />
                </div>
                <div className="flex-1">
                    <p className="uppercase text-xs font-bold tracking-widest text-default-500 mb-2">Playlist</p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 truncate w-full">{playlist.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-default-400 font-medium">
                        <span className="flex items-center gap-1"><Music size={14} /> {playlist.tracks.length} Tracks</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex justify-center items-center p-3 sm:mb-2 bg-white/5 hover:bg-red-500/20 text-default-400 hover:text-red-400 rounded-xl transition-colors"
                    title="Delete Playlist"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {playlist.tracks.length > 0 ? (
                <div className="mt-8">
                    <TrackList
                        tracks={playlist.tracks}
                        currentTrack={player.currentTrack}
                        onPlay={handlePlayTrack}
                        playlistActions={{
                            onRemove: (trackId) => removeTrackFromPlaylist(playlist.id, trackId)
                        }}
                    />
                </div>
            ) : (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                    <Music size={48} className="mx-auto mb-4 text-default-300 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">This playlist is empty</h3>
                    <p className="text-default-400">Play a song and open the drawer to add it here.</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeletePlaylist}
                title="Delete Playlist"
                message={`Delete "${playlist.name}" and its ${playlist.tracks.length} track${playlist.tracks.length !== 1 ? 's' : ''}? This can't be undone.`}
                confirmText="Delete"
                isDanger
            />
        </div>
    );
}
