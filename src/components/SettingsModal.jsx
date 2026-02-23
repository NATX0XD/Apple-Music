import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Check, Moon, Sun } from 'lucide-react';
import { useSettings } from '../hooks/useStorage';

const THEME_COLORS = [
    { name: 'Purple', value: 'purple', hex: '#a855f7' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Green', value: 'green', hex: '#22c55e' },
    { name: 'Orange', value: 'orange', hex: '#f97316' },
    { name: 'Red', value: 'red', hex: '#ef4444' },
];

export default function SettingsModal({ isOpen, onClose }) {
    const { settings, updateSettings } = useSettings();
    const isDark = settings.isDark !== false;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            placement="bottom"
            motionProps={{
                variants: {
                    enter: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
                    exit: { y: 20, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
                }
            }}
            classNames={{
                base: "bg-white/95 dark:bg-[#1c1c2e]/95 backdrop-blur-xl text-black dark:text-white border border-black/10 dark:border-white/10 rounded-t-3xl rounded-b-none sm:rounded-2xl mx-0 sm:mx-6 mb-0 sm:mb-8 max-w-lg shadow-2xl",
                header: "border-b border-black/5 dark:border-white/5",
                body: "py-6",
                footer: "border-t border-black/5 dark:border-white/5",
                closeButton: "right-4 top-4 left-auto hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 transition-colors"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold">Settings</h2>
                            <p className="text-sm text-default-600 dark:text-default-400 font-normal">Customize your Apple Music experience</p>
                        </ModalHeader>

                        <ModalBody className="py-6 space-y-8">
                            {/* App Mode */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-default-600 dark:text-default-400 mb-4">Appearance</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => updateSettings({ isDark: false })}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${!isDark ? 'border-theme-500 bg-theme-500/10' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <Sun size={24} className="mb-2" />
                                        <span className="text-sm font-medium">Light</span>
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ isDark: true })}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${isDark ? 'border-theme-500 bg-theme-500/10' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <Moon size={24} className="mb-2" />
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>
                                </div>
                            </div>

                            {/* Theme Color */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-default-600 dark:text-default-400 mb-4">Accent Color</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {THEME_COLORS.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => updateSettings({ themeColor: color.value })}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${settings.themeColor === color.value
                                                ? 'border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10 shadow-lg'
                                                : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center shadow-inner"
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                {settings.themeColor === color.value && <Check size={12} className="text-white drop-shadow-md" />}
                                            </div>
                                            <span className="text-sm font-medium">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="secondary" variant="flat" onPress={onClose} className="font-semibold" radius="full">
                                Done
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
