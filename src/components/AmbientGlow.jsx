import React, { useMemo } from 'react';
import { getArtwork } from '../services/itunesApi';
import { useSettings } from '../hooks/useStorage';

export default function AmbientGlow({ currentTrack, size = 'lg' }) {
    const { settings } = useSettings();

    const layerStyles = useMemo(() => {
        const styles = {
            xs: {
                l1: "-inset-1 rounded-xl opacity-30 blur-md",
                l2: "-inset-0.5 rounded-xl opacity-20 blur-sm"
            },
            sm: {
                l1: "-inset-2 rounded-[1rem] opacity-40 blur-xl",
                l2: "-inset-1 rounded-[1rem] opacity-20 blur-lg"
            },
            md: {
                l1: "-inset-4 rounded-[1.5rem] opacity-45 blur-2xl",
                l2: "-inset-2 rounded-[1.5rem] opacity-25 blur-xl"
            },
            lg: {
                l1: "-inset-6 sm:-inset-8 rounded-[2rem] opacity-50 blur-3xl",
                l2: "-inset-4 sm:-inset-6 rounded-[2rem] opacity-30 blur-2xl"
            },
            xl: {
                l1: "-inset-10 sm:-inset-12 rounded-[2.5rem] opacity-60 blur-[3rem]",
                l2: "-inset-6 sm:-inset-8 rounded-[2.5rem] opacity-40 blur-[2.5rem]"
            }
        };

        const currentStyle = styles[size] || styles.lg;

        return {
            layer1Class: `absolute ${currentStyle.l1} animate-[ambientPulse_4s_ease-in-out_infinite]`,
            layer2Class: `absolute ${currentStyle.l2} animate-[ambientPulse_4s_ease-in-out_1.5s_infinite]`
        };
    }, [size]);

    if (!currentTrack || settings.isAmbientMode === false) return null;

    return (
        <>
            <div
                className={layerStyles.layer1Class}
                style={{
                    backgroundImage: `url(${getArtwork(currentTrack.artworkUrl100, 300)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div
                className={layerStyles.layer2Class}
                style={{
                    backgroundImage: `url(${getArtwork(currentTrack.artworkUrl100, 300)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </>
    );
}
