import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { LogOut } from 'lucide-react';

export default function ModalSignOut({ isOpen, onClose, onConfirm }) {
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
                body: "py-6",
                footer: "border-t border-black/5 dark:border-white/5 pt-4",
                closeButton: "right-4 top-4 left-auto hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 transition-colors"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 items-center justify-center pt-6">
                            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-2 border border-danger/20">
                                <LogOut className="text-danger" size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Sign Out</h2>
                        </ModalHeader>

                        <ModalBody className="flex flex-col items-center">
                            <p className="text-sm text-default-500 dark:text-default-400 font-normal text-center">
                                Are you sure you want to sign out of your account?
                            </p>
                        </ModalBody>

                        <ModalFooter className="flex w-full justify-center gap-3">
                            <Button
                                className="flex-1 bg-black/5 dark:bg-white/10 text-default-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-colors font-semibold"
                                radius="full"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                className="flex-1 font-semibold"
                                radius="full"
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                Sign Out
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
