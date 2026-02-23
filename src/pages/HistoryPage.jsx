import React from 'react';
import TrackList from '../components/TrackList';
import { useHistory } from '../hooks/useStorage';
import { History as HistoryIcon, Trash2 } from 'lucide-react';

export default function HistoryPage({ player, handlePlayTrack }) {
    const { history, clearHistory } = useHistory();

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 mt-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                        <HistoryIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Listening History</h2>
                        <p className="text-default-400 text-sm">Your most recently played tracks</p>
                    </div>
                </div>

                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors text-red-400"
                    >
                        <Trash2 size={16} />
                        Clear History
                    </button>
                )}
            </div>

            {history.length > 0 ? (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden glass-card">
                    <TrackList
                        tracks={history}
                        currentTrack={player.currentTrack}
                        onPlay={handlePlayTrack}
                    />
                </div>
            ) : (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                    <HistoryIcon size={48} className="mx-auto mb-4 text-default-300 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No history yet</h3>
                    <p className="text-default-400">Songs you play will show up here.</p>
                </div>
            )}
        </div>
    );
}
