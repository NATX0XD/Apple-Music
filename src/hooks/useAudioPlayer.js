import { useState, useRef, useCallback, useEffect } from 'react';

export function useAudioPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [queue, setQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(-1);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    useEffect(() => {
        const audio = new Audio();
        audio.volume = volume;
        audioRef.current = audio;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            if (repeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                playNext();
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.pause();
            audio.src = '';
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playTrack = useCallback((track, trackQueue = [], index = 0) => {
        const audio = audioRef.current;
        if (!audio || !track?.previewUrl) return;

        audio.src = track.previewUrl;
        audio.play().catch(() => { });
        setCurrentTrack(track);
        setIsPlaying(true);
        if (trackQueue.length > 0) {
            setQueue(trackQueue);
            setQueueIndex(index);
        }
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const seek = useCallback((time) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrentTime(time);
    }, []);

    const changeVolume = useCallback((vol) => {
        setVolume(Math.max(0, Math.min(1, vol)));
    }, []);

    const playNext = useCallback(() => {
        if (queue.length === 0) return;
        let nextIndex;
        if (shuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            nextIndex = (queueIndex + 1) % queue.length;
        }
        const nextTrack = queue[nextIndex];
        if (nextTrack) {
            playTrack(nextTrack, queue, nextIndex);
        }
    }, [queue, queueIndex, shuffle, playTrack]);

    const playPrev = useCallback(() => {
        if (queue.length === 0) return;
        const audio = audioRef.current;
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
        const prevTrack = queue[prevIndex];
        if (prevTrack) {
            playTrack(prevTrack, queue, prevIndex);
        }
    }, [queue, queueIndex, playTrack]);

    return {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
        playNext,
        playPrev,
        setShuffle: () => setShuffle(!shuffle),
        setRepeat: () => setRepeat(!repeat),
    };
}
