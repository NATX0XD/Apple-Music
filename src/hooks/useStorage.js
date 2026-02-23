import { useState, useEffect } from 'react';

// A generic hook to manage local storage data
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                window.dispatchEvent(new Event("local-storage-sync"));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage-sync', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-sync', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

export function usePlaylists() {
    const [playlists, setPlaylists] = useLocalStorage('apple-music-playlists', []);

    const createPlaylist = (name) => {
        if (!name.trim()) return;
        const newPlaylist = {
            id: Date.now().toString(),
            name: name.trim(),
            slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
            tracks: []
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
    };

    const addTrackToPlaylist = (playlistId, track) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                // Check if track already exists
                if (!p.tracks.find(t => t.trackId === track.trackId)) {
                    return { ...p, tracks: [...p.tracks, track] };
                }
            }
            return p;
        }));
    };

    const removeTrackFromPlaylist = (playlistId, trackId) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return { ...p, tracks: p.tracks.filter(t => t.trackId !== trackId) };
            }
            return p;
        }));
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    };

    return { playlists, createPlaylist, addTrackToPlaylist, removeTrackFromPlaylist, deletePlaylist };
}

export function useHistory() {
    const [history, setHistory] = useLocalStorage('apple-music-history', []);

    const addToHistory = (track) => {
        setHistory(prev => {
            const filtered = prev.filter(t => t.trackId !== track.trackId);
            return [track, ...filtered].slice(0, 50); // Keep last 50 songs
        });
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return { history, addToHistory, clearHistory };
}

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage('apple-music-favorites', []);

    const isFavorite = (trackId) => {
        return favorites.some(t => t.trackId === trackId);
    };

    const toggleFavorite = (track) => {
        setFavorites(prev => {
            if (prev.some(t => t.trackId === track.trackId)) {
                return prev.filter(t => t.trackId !== track.trackId);
            } else {
                return [track, ...prev];
            }
        });
    };

    return { favorites, toggleFavorite, isFavorite };
}

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useLocalStorage('apple-music-searches', []);

    const addSearch = (term) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
            return [term, ...filtered].slice(0, 10); // Keep last 10 searches
        });
    };

    const clearSearches = () => {
        setRecentSearches([]);
    };

    return { recentSearches, addSearch, clearSearches };
}

export function useSettings() {
    const [settings, setSettings] = useLocalStorage('apple-music-settings', {
        themeColor: 'purple', // default color
        trackLimit: 20
    });

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return { settings, updateSettings };
}
