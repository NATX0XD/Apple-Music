import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import ModalSignOut from './ModalSignOut';

export default function UsersMiniProfile({ userInfo, onPress }) {
    // userInfo will contain the Google Auth user object. 
    // We map it safely in case it's null or missing fields.
    const displayName = userInfo?.displayName || 'Unknown User';
    const email = userInfo?.email || '';
    const photoURL = userInfo?.photoURL || '';

    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    return (
        <>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div
                        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group bg-transparent border-none p-0 cursor-pointer outline-none"
                        role="button"
                        title="Account options"
                    >
                        <div className="text-right hidden xl:block">
                            <p className="text-xs font-semibold leading-tight group-hover:text-theme-500 transition-colors text-black dark:text-white flex items-center justify-end gap-1">
                                {displayName}
                            </p>
                            <p className="text-[10px] text-default-600 dark:text-default-500 leading-tight">
                                {email}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10 group-hover:border-theme-500/50 transition-all flex-shrink-0 shadow-md flex items-center justify-center bg-black/5 dark:bg-white/5">
                            {photoURL ? (
                                <img
                                    src={photoURL}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                // Fallback avatar if no photo is available
                                <div className="text-sm font-bold text-default-500">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2 opacity-100" textValue="Signed in as">
                        <p className="font-semibold text-xs text-default-500">Signed in as</p>
                        <p className="font-bold text-sm truncate">{email}</p>
                    </DropdownItem>
                    <DropdownItem
                        key="logout"
                        color="danger"
                        className="text-danger"
                        onPress={() => setIsSignOutModalOpen(true)}
                        startContent={<LogOut size={16} />}
                    >
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <ModalSignOut
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={onPress}
            />
        </>
    );
}