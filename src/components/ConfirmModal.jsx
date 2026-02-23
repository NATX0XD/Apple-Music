import React from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from '@heroui/react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = true,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            placement="center"
            size="sm"
            hideCloseButton
            className="max-w-[380px]"
            classNames={{
                base: "bg-white/95 dark:bg-[#1c1c2e]/95 backdrop-blur-xl text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl",
                body: "px-6 py-5",
                footer: "border-t border-black/5 dark:border-white/5 px-6 py-3",
            }}
        >
            <ModalContent>
                <ModalBody>
                    {/* Close button top-right */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-default-400 hover:text-black dark:hover:text-white transition-colors z-10"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-start gap-4 pt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDanger ? 'bg-red-500/15' : 'bg-theme-500/15'}`}>
                            <AlertTriangle size={20} className={isDanger ? 'text-red-400' : 'text-theme-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold mb-1">{title}</h3>
                            <p className="text-sm text-default-500 dark:text-default-400">{message}</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        variant="flat"
                        className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600"
                        onPress={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        size="sm"
                        color={isDanger ? 'danger' : 'secondary'}
                        variant="flat"
                        className={isDanger
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold'
                            : 'bg-theme-500/20 text-theme-400 hover:bg-theme-500/30 font-semibold'
                        }
                        onPress={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
