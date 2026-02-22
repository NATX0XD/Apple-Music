const BASE_URL = 'https://itunes.apple.com';

export const searchTracks = async (term, limit = 25) => {
    const res = await fetch(
        `${BASE_URL}/search?term=${encodeURIComponent(term)}&entity=musicTrack&limit=${limit}`
    );
    const data = await res.json();
    return data.results || [];
};

export const searchVideos = async (term, limit = 20) => {
    const res = await fetch(
        `${BASE_URL}/search?term=${encodeURIComponent(term)}&entity=musicVideo&limit=${limit}`
    );
    const data = await res.json();
    return data.results || [];
};

export const searchByGenre = async (genre, limit = 25) => {
    const res = await fetch(
        `${BASE_URL}/search?term=${encodeURIComponent(genre)}&entity=musicTrack&limit=${limit}&attribute=genreTerm`
    );
    const data = await res.json();
    return data.results || [];
};

export const getArtwork = (url, size = 300) => {
    if (!url) return '';
    // iTunes returns URLs like .../100x100bb.jpg
    // Replace the default 100x100 with our desired size
    return url.replace(/100x100bb/, `${size}x${size}bb`);
};

export const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatPrice = (price, currency = 'USD') => {
    if (price === undefined || price === null || price < 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);
};

export const FEATURED_SEARCHES = [
    'top hits 2025',
    'taylor swift',
    'the weeknd',
    'bruno mars',
    'dua lipa',
    'billie eilish',
];

export const GENRE_TAGS = [
    { name: 'Pop', emoji: '🎤', color: 'from-pink-500 to-rose-500' },
    { name: 'Rock', emoji: '🎸', color: 'from-red-500 to-orange-500' },
    { name: 'Hip-Hop', emoji: '🎧', color: 'from-purple-500 to-violet-500' },
    { name: 'Jazz', emoji: '🎷', color: 'from-amber-500 to-yellow-500' },
    { name: 'K-Pop', emoji: '🇰🇷', color: 'from-blue-400 to-cyan-400' },
    { name: 'EDM', emoji: '🎹', color: 'from-green-400 to-emerald-400' },
    { name: 'R&B', emoji: '🎵', color: 'from-indigo-500 to-blue-500' },
    { name: 'Classical', emoji: '🎻', color: 'from-slate-400 to-gray-500' },
    { name: 'Country', emoji: '🤠', color: 'from-orange-400 to-amber-400' },
    { name: 'Latin', emoji: '💃', color: 'from-red-400 to-pink-400' },
];
