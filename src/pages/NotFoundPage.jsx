import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@heroui/react';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6 shadow-inner border border-danger/20">
                <AlertTriangle size={48} strokeWidth={1.5} />
            </div>

            <h1 className="text-7xl font-bold mb-3 tracking-tight text-black dark:text-white">
                404
            </h1>

            <h2 className="text-2xl font-semibold mb-2 text-default-800 dark:text-default-200">
                Page Not Found
            </h2>

            <p className="text-sm text-default-500 max-w-sm mb-8 leading-relaxed">
                The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>

            <Button
                radius="full"
                size="lg"
                className="bg-black text-white dark:bg-white dark:text-black font-semibold px-10 shadow-lg hover:scale-105 transition-transform"
                startContent={<Home size={18} />}
                onPress={() => navigate('/')}
            >
                Return Home
            </Button>
        </div>
    );
}
