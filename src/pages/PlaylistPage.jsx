import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import TrackList from '../components/TrackList';
import { usePlaylists } from '../hooks/useStorage';
import { Library, Trash2, Music } from 'lucide-react';

export default function PlaylistPage({ player, handlePlayTrack }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { playlists, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();

    const playlist = playlists.find(p => p.slug === slug);

    if (!playlist) {
        return <Navigate to="/" replace />;
    }

    const handleDeletePlaylist = () => {
        if (window.confirm(`Are you sure you want to delete the playlist "${playlist.name}"?`)) {
            deletePlaylist(playlist.id);
            navigate('/');
        }
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-10 pt-6">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 shrink-0">
                    <Library size={64} className="text-white/80" />
                </div>
                <div className="flex-1">
                    <p className="uppercase text-xs font-bold tracking-widest text-default-500 mb-2">Playlist</p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 truncate w-full">{playlist.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-default-400 font-medium">
                        <span className="flex items-center gap-1"><Music size={14} /> {playlist.tracks.length} Tracks</span>
                    </div>
                </div>

                <button
                    onClick={handleDeletePlaylist}
                    className="flex justify-center items-center p-3 sm:mb-2 bg-white/5 hover:bg-red-500/20 text-default-400 hover:text-red-400 rounded-xl transition-colors"
                    title="Delete Playlist"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {playlist.tracks.length > 0 ? (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 shadow-xl glass-card">
                    <TrackList
                        tracks={playlist.tracks}
                        currentTrack={player.currentTrack}
                        onPlay={handlePlayTrack}
                        // Optional: ability to remove a single track
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
        </div>
    );
}
