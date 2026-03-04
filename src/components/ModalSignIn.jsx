import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';

export default function ModalSignIn({ isOpen, onClose, signIn }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            placement="center"
            motionProps={{
                variants: {
                    enter: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
                    exit: { y: -20, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
                }
            }}
            classNames={{
                base: "bg-white/95 dark:bg-[#1c1c2e]/95 backdrop-blur-xl text-black dark:text-white border border-black/10 dark:border-white/10 sm:rounded-2xl mx-4 sm:mx-0 max-w-sm shadow-2xl",
                header: "border-b border-black/5 dark:border-white/5 pb-4",
                body: "py-8",
                closeButton: "right-4 top-4 left-auto hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 transition-colors"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 items-center justify-center pt-6">
                            <div className="w-12 h-12 rounded-xl bg-theme-500/10 flex items-center justify-center mb-2 border border-theme-500/20">
                                {/* SVG for Music/Apple Music-like Logo */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-500">
                                    <path d="M9 18V5l12-2v13"></path>
                                    <circle cx="6" cy="18" r="3"></circle>
                                    <circle cx="18" cy="16" r="3"></circle>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold">Sign In to Music</h2>
                            <p className="text-sm text-default-500 dark:text-default-400 font-normal text-center mt-1">
                                Access your favorite songs, playlists, and personalized recommendations.
                            </p>
                        </ModalHeader>

                        <ModalBody className="flex flex-col items-center">
                            <Button
                                size="lg"
                                radius="full"
                                className="w-full bg-white text-black font-semibold border border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/90 transition-colors"
                                onPress={() => {
                                    signIn();
                                    onClose(); // Close modal after initiating sign in
                                }}
                                startContent={
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>

                                }
                            >
                                Continue with Google
                            </Button>

                            <p className="text-xs text-default-400 mt-6 text-center leading-relaxed">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}