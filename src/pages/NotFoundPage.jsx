import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc3, Music, Headphones, Home, Radio } from 'lucide-react';
import { Button } from '@heroui/react';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Floating music notes background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Music
                    size={20}
                    className="absolute top-[10%] left-[15%] text-theme-500/20 animate-float-slow"
                    style={{ animationDelay: '0s', animationDuration: '6s' }}
                />
                <Music
                    size={16}
                    className="absolute top-[25%] right-[20%] text-theme-400/15 animate-float-slow"
                    style={{ animationDelay: '1s', animationDuration: '7s' }}
                />
                <Headphones
                    size={22}
                    className="absolute bottom-[30%] left-[10%] text-theme-300/15 animate-float-slow"
                    style={{ animationDelay: '2s', animationDuration: '8s' }}
                />
                <Radio
                    size={18}
                    className="absolute top-[15%] right-[10%] text-theme-500/10 animate-float-slow"
                    style={{ animationDelay: '3s', animationDuration: '5s' }}
                />
                <Music
                    size={14}
                    className="absolute bottom-[20%] right-[15%] text-theme-400/20 animate-float-slow"
                    style={{ animationDelay: '1.5s', animationDuration: '9s' }}
                />
                <Disc3
                    size={24}
                    className="absolute bottom-[40%] right-[25%] text-theme-300/10 animate-float-slow"
                    style={{ animationDelay: '0.5s', animationDuration: '6.5s' }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Vinyl record icon with spinning animation */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-theme-500/20 via-theme-400/10 to-transparent flex items-center justify-center border border-theme-500/20 shadow-[0_0_60px_rgba(var(--theme-rgb,168,85,247),0.15)]">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-black/80 to-black/60 dark:from-white/10 dark:to-white/5 flex items-center justify-center border border-white/10 animate-spin-very-slow">
                            <div className="w-8 h-8 rounded-full bg-theme-500/30 border-2 border-theme-500/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-theme-500" />
                            </div>
                        </div>
                    </div>
                    {/* Tonearm */}
                    <div className="absolute -top-2 -right-2 w-16 h-1 bg-gradient-to-r from-default-400 to-default-300 dark:from-default-500 dark:to-default-400 rounded-full transform rotate-[35deg] origin-left opacity-60" />
                </div>

                {/* Error text */}
                <h1 className="text-8xl font-black mb-2 tracking-tighter bg-gradient-to-b from-theme-400 to-theme-600 bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                    <Music size={20} className="text-theme-500" />
                    Track Not Found
                    <Music size={20} className="text-theme-500" />
                </h2>

                <p className="text-sm text-default-500 max-w-md mb-10 leading-relaxed">
                    Looks like this track has been removed from the playlist,
                    or maybe the URL hit a wrong note. Let's get you back to the music.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        radius="full"
                        size="lg"
                        className="bg-theme-500 text-white font-semibold px-10 shadow-lg shadow-theme-500/25 hover:shadow-theme-500/40 hover:scale-105 transition-all"
                        startContent={<Home size={18} />}
                        onPress={() => navigate('/')}
                    >
                        Back to Music
                    </Button>
                </div>

                {/* Decorative equalizer bars */}
                <div className="flex items-end gap-1 mt-10 h-8 opacity-30">
                    {[3, 5, 2, 6, 4, 7, 3, 5, 2, 4, 6, 3, 5, 7, 4].map((h, i) => (
                        <div
                            key={i}
                            className="w-1 bg-theme-500 rounded-full animate-equalizer"
                            style={{
                                height: `${h * 4}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${0.8 + Math.random() * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* CSS animations */}
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
                    50% { transform: translateY(-20px) rotate(10deg); opacity: 0.3; }
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                @keyframes spin-very-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-very-slow {
                    animation: spin-very-slow 8s linear infinite;
                }
                @keyframes equalizer {
                    0%, 100% { transform: scaleY(0.3); }
                    50% { transform: scaleY(1); }
                }
                .animate-equalizer {
                    animation: equalizer 0.8s ease-in-out infinite alternate;
                    transform-origin: bottom;
                }
            `}</style>
        </div>
    );
}
