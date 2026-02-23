import React, { useState } from 'react';
import TrackList from '../components/TrackList';
import { useHistory } from '../hooks/useStorage';
import { History as HistoryIcon, Trash2, AlertTriangle } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

export default function HistoryPage({ player, handlePlayTrack }) {
    const { history, clearHistory } = useHistory();
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const confirmClearHistory = () => {
        clearHistory();
        setIsClearModalOpen(false);
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 mt-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-theme-500/20 text-theme-400 rounded-xl">
                        <HistoryIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Listening History</h2>
                        <p className="text-default-400 text-sm">Your most recently played tracks</p>
                    </div>
                </div>

                {history.length > 0 && (
                    <button
                        onClick={() => setIsClearModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors text-red-400"
                    >
                        <Trash2 size={16} />
                        Clear History
                    </button>
                )}
            </div>

            {history.length > 0 ? (
                <div className="mt-8">
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

            <Modal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                backdrop="blur"
                placement="center"
                size="md"
                className="max-w-[400px]"
                classNames={{
                    base: "apple-glass rounded-2xl",
                    header: "border-b border-black/5 dark:border-white/5 px-6 py-5",
                    body: "px-6 py-6",
                    footer: "border-t border-black/5 dark:border-white/5 px-6 py-4",
                    closeButton: "hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 transition-colors"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-red-400">
                                    <AlertTriangle size={24} />
                                    Clear History
                                </h2>
                            </ModalHeader>

                            <ModalBody>
                                <p className="text-base text-default-300">
                                    Are you sure you want to clear your entire listening history? This action cannot be undone.
                                </p>
                            </ModalBody>

                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="text-default-400 font-medium">
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={confirmClearHistory}
                                    className="font-semibold shadow-lg shadow-red-500/20"
                                >
                                    Clear History
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
