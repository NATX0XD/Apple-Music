import { useCallback, useRef } from 'react';

export function useAmbientColor() {
    const canvasRef = useRef(document.createElement('canvas'));
    const ctxRef = useRef(canvasRef.current.getContext('2d', { willReadFrequently: true }));

    const extractColor = useCallback((imageUrl) => {
        if (!imageUrl) return;

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            canvas.width = 50;
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);

            try {
                const imageData = ctx.getImageData(0, 0, 50, 50).data;
                let r = 0, g = 0, b = 0, count = 0;

                // Sample pixels skipping every 4th pixel for performance
                for (let i = 0; i < imageData.length; i += 16) {
                    const pr = imageData[i];
                    const pg = imageData[i + 1];
                    const pb = imageData[i + 2];
                    // Skip very dark and very light pixels
                    const brightness = (pr + pg + pb) / 3;
                    if (brightness > 30 && brightness < 230) {
                        r += pr;
                        g += pg;
                        b += pb;
                        count++;
                    }
                }

                if (count > 0) {
                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);

                    // Boost saturation slightly
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const mid = (max + min) / 2;
                    r = Math.min(255, Math.round(r + (r - mid) * 0.3));
                    g = Math.min(255, Math.round(g + (g - mid) * 0.3));
                    b = Math.min(255, Math.round(b + (b - mid) * 0.3));

                    document.documentElement.style.setProperty('--ambient-r', r);
                    document.documentElement.style.setProperty('--ambient-g', g);
                    document.documentElement.style.setProperty('--ambient-b', b);
                }
            } catch (e) {
                // CORS error fallback - use a nice default theme
                document.documentElement.style.setProperty('--ambient-r', 108);
                document.documentElement.style.setProperty('--ambient-g', 92);
                document.documentElement.style.setProperty('--ambient-b', 231);
            }
        };
        img.src = imageUrl;
    }, []);

    return { extractColor };
}
