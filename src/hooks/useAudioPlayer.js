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
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume));
        }
    }, [volume]);

    const playTrack = useCallback((track, trackQueue = [], index = 0) => {
        if (!track?.previewUrl) return;

        const isMusicVideo = track.wrapperType === 'track' && track.kind === 'music-video';
        setIsVideo(isMusicVideo);
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
        console.trace("[useAudioPlayer] playNext called! Tracing stack:");
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

    const handleTimeUpdate = useCallback((e) => setCurrentTime(e.target.currentTime), []);
    const handleLoadedMetadata = useCallback((e) => setDuration(e.target.duration), []);

    const handleEnded = useCallback((e) => {
        const audio = audioRef.current;
        if (!audio) return;

        // Very strict check: the media must actually be near its end to be considered ended natively.
        // This defeats ALL spurious unmount/swap/src-change "ended" events.
        if (audio.duration > 0 && audio.currentTime >= audio.duration - 1) {
            if (repeat) {
                audio.currentTime = 0;
                audio.play().catch(() => { });
            } else {
                playNext();
            }
        }
    }, [repeat, playNext]);

    return {
        currentTrack,
        isPlaying,
        setIsPlaying,
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
        isVideo,
        audioRef,
        setShuffle: () => setShuffle(!shuffle),
        setRepeat: () => setRepeat(!repeat),
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded
    };
}
