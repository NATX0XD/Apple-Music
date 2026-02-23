import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HeroUIProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HeroUIProvider>
    </React.StrictMode>
);
