import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import { ListPlus } from 'lucide-react';

export default function AddPlaylistModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) setName('');
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            placement="center"
            size="md"
            className="mb-10 sm:mb-0 max-w-[400px]" // bump up a bit from bottom on mobile, restrict width
            classNames={{
                base: "apple-glass rounded-2xl",
                header: "border-b border-black/5 dark:border-white/5 px-6 py-5",
                body: "px-6 py-6",
                footer: "border-t border-black/5 dark:border-white/5 px-6 py-4",
                closeButton: "hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 transition-colors"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ListPlus size={24} className="text-theme-400" />
                                New Playlist
                            </h2>
                            <p className="text-sm text-default-400 font-normal mt-1">Give your new playlist a name.</p>
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                autoFocus
                                value={name}
                                onValueChange={setName}
                                placeholder="My Awesome Mix"
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-theme-500 bg-white/5",
                                    input: "text-white text-base"
                                }}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="light" onPress={onClose} className="text-default-400 font-medium">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-theme-500 text-white font-semibold shadow-lg shadow-theme-500/20"
                                isDisabled={!name.trim()}
                            >
                                Create
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}
